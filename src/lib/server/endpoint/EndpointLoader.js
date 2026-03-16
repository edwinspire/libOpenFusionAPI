import { get_url_params, url_key } from "../utils_path.js";
import { replaceAllFast } from "./utils.js";
// import Ajv from "ajv";

// const ajv = new Ajv();

/**
 * Handles loading endpoints from the database, building their handlers,
 * and managing the thundering-herd protection during concurrent loads.
 */
export class EndpointLoader {
  /**
   * @param {object} internalEndpoint  - Shared reference to the endpoint registry object.
   * @param {object} fnLocal           - Shared reference to the local function registry.
   * @param {Map}    loadingPromises   - Shared in-flight promise map (thundering-herd guard).
   */
  constructor(internalEndpoint, fnLocal, loadingPromises, dependencies) {
    this._ep = internalEndpoint;
    this._fnLocal = fnLocal;
    this._loadingPromises = loadingPromises;
    this._dbFetcher = dependencies.dbFetcher;
    this._vmFactory = dependencies.vmFactory;
    this._mcpBuilder = dependencies.mcpBuilder;
  }

  getFnNames() {
    let r = {};

    if (this._fnLocal) {
      let list_env = Object.keys(this._fnLocal);

      for (let i = 0; i < list_env.length; i++) {
        let env_name = list_env[i];
        let list_app = Object.keys(this._fnLocal[env_name]);
        if (!r[env_name]) {
          r[env_name] = {};
        }

        for (let index = 0; index < list_app.length; index++) {
          let app_name = list_app[index];
          r[env_name][app_name] = Object.keys(
            this._fnLocal[env_name][app_name]
          );
        }
      }
    }

    return r;
  }

  async getEndpoint(request_path_params) {
    const { url_key: key } = request_path_params;

    // Fast path: already cached
    if (this._ep[key]) {
      return this._ep[key];
    }

    // Thundering-herd protection: reuse in-flight promise
    if (this._loadingPromises.has(key)) {
      await this._loadingPromises.get(key);
    } else {
      const loadPromise = this._loadEndpointsByAPPToCache(request_path_params);
      this._loadingPromises.set(key, loadPromise);
      try {
        await loadPromise;
      } finally {
        this._loadingPromises.delete(key);
      }
    }

    return this._ep[key];
  }

  async _loadEndpointsByAPPToCache(params) {
    try {
      let appData = await this._dbFetcher({
        app: params.app,
        enabled: true,
        endpoint: {
          enabled: true,
          environment: params.environment,
          method: params.method,
          resource: params.resource,
        },
      });

      if (appData && appData.idapp) {
        if (appData.enabled && appData.endpoints) {
          for (let i = 0; i < appData.endpoints.length; i++) {
            let endpoint = appData.endpoints[i];

            const key = url_key(
              appData.app,
              endpoint.resource,
              endpoint.environment,
              endpoint.method,
              endpoint.method == "WS"
            );
            endpoint.url_key = key;
            endpoint.idapp = appData.idapp;
            endpoint.jwt_key = appData.jwt_key;

            if (!this._ep[key]) {
              this._ep[key] = {};
            }

            this._ep[key].handler = await this._getApiHandler(
              appData.app,
              endpoint,
              appData.vrs
            );
          }
        }
      }
    } catch (error) {
      console.trace(error);
      throw error; // Re-throw to inform caller that load failed
    }
  }

  async _getApiHandler(app_name, endpointData, app_vars) {
    let returnHandler = {};
    returnHandler.params = endpointData;
    returnHandler.params.app = app_name;

    try {
      if (endpointData.enabled) {
        let props = [];
        let appvars_obj = {};

        if (Array.isArray(app_vars)) {
          props = app_vars.filter((item) => {
            return endpointData.environment == item.environment;
          });

          for (let index = 0; index < props.length; index++) {
            const element = props[index];
            appvars_obj[element.name] = element.value;
          }
        }

        if (props.length > 0) {
          if (
            endpointData.handler !== "JS" &&
            endpointData.handler !== "MCP" &&
            endpointData.handler !== "MONGODB" &&
            endpointData.handler !== "FUNCTION" &&
            returnHandler.params.code &&
            returnHandler.params.code.length > 0
          ) {
            returnHandler.params.code = replaceAllFast(
              returnHandler.params.code,
              props
            );
          }

          if (
            typeof returnHandler?.params?.custom_data === "string" &&
            (endpointData.handler == "SQL" ||
              endpointData.handler == "HANA" ||
              endpointData.handler == "MONGODB" ||
              endpointData.handler == "SQL_BULK_I")
          ) {
            returnHandler.params.custom_data = JSON.parse(
              replaceAllFast(returnHandler.params.custom_data, props)
            );
          }
        }

        // Compile JSON schema validator if enabled
        // TODO: Re-enable this block when request-time schema validation is wired
        // into the handler pipeline (pre-handler/pre-validation).
        // if (returnHandler?.params?.json_schema?.in?.enabled) {
        //   try {
        //     returnHandler.params.json_schema.in.fn_ajv_validate_schema =
        //       ajv.compile(returnHandler.params.json_schema.in.schema);
        //   } catch (error) {
        //     console.trace(error);
        //   }
        // }

        // Handler-specific initialization
        if (returnHandler.params.handler == "MCP") {
          returnHandler.params.server_mcp = await this._mcpBuilder(
            returnHandler.params.app,
            returnHandler.params.environment
          );
        }

        if (returnHandler.params.handler == "MONGODB") {
          returnHandler.params.jsFn = await this._vmFactory(
            returnHandler.params.code,
            appvars_obj,
            returnHandler.params.timeout
          );
          returnHandler.params.code = undefined;
        } else if (returnHandler.params.handler == "JS") {
          returnHandler.params.jsFn = await this._vmFactory(
            returnHandler.params.code,
            appvars_obj,
            returnHandler.params.timeout
          );
          returnHandler.params.code = undefined;
        } else if (returnHandler.params.handler == "FUNCTION") {
          if (
            this._fnLocal[returnHandler.params.environment] &&
            this._fnLocal[returnHandler.params.environment][
              returnHandler.params.app
            ] &&
            this._fnLocal[returnHandler.params.environment][
              returnHandler.params.app
            ][returnHandler.params.code]
          ) {
            returnHandler.params.Fn =
              this._fnLocal[returnHandler.params.environment][
                returnHandler.params.app
              ][returnHandler.params.code];
          } else if (
            this._fnLocal[returnHandler.params.environment] &&
            this._fnLocal[returnHandler.params.environment]["public"] &&
            this._fnLocal[returnHandler.params.environment]["public"][
              returnHandler.params.code
            ]
          ) {
            returnHandler.params.Fn =
              this._fnLocal[returnHandler.params.environment]["public"][
                returnHandler.params.code
              ];
          }

          returnHandler.message = "";
          returnHandler.status = 200;
        }
      } else {
        returnHandler.message = `Method ${endpointData.method} Unabled`;
        returnHandler.status = 404;
      }
    } catch (error) {
      returnHandler.message = error.message;
      returnHandler.status = 500;
      console.trace(error);
    }

    return returnHandler;
  }
}
