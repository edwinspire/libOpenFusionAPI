import { ajv } from "../ajv.js";
import { url_key } from "../utils_path.js";

/**
 * EndpointLoader subsystem
 * Handles loading endpoints from DB and generating handlers
 */
export default class EndpointLoader {
  /**
   * @param {Object} internalEndpoint Reference to the internal cache of endpoints
   * @param {Function} fnLocal Reference to local functions registry
   * @param {Map} loadingPromises Map of active loading promises (thundering herd protection)
   * @param {Object} dependencies External dependencies (dbFetcher, vmFactory, mcpBuilder)
   */
  constructor(internalEndpoint, fnLocal, loadingPromises, dependencies) {
    this._ep = internalEndpoint;
    this._fnLocal = fnLocal;
    this._loadingPromises = loadingPromises;
    this._dbFetcher = dependencies.dbFetcher;
    this._vmFactory = dependencies.vmFactory;
    this._mcpBuilder = dependencies.mcpBuilder;

    this._handlerInitializers = {
      MCP: async (returnHandler) => {
        returnHandler.params.server_mcp = await this._mcpBuilder(
          returnHandler.params.app,
          returnHandler.params.environment
        );
      },
      MONGODB: async (returnHandler, appvars_obj) => {
        await this._initVmHandler(returnHandler, appvars_obj);
      },
      JS: async (returnHandler, appvars_obj) => {
        await this._initVmHandler(returnHandler, appvars_obj);
      },
      FUNCTION: async (returnHandler) => {
        this._initFunctionHandler(returnHandler);
      },
    };
  }

  getFnNames() {
    let r = {};

    Object.keys(this._fnLocal).forEach((key) => {
      r[key] = {
        name: key,
      };
    });

    return r;
  }

  /**
   * Main entry point to get or load an endpoint
   */
  async getEndpoint(params) {
    const key = url_key(
      params.app,
      params.resource,
      params.environment,
      params.method,
      params.method == "WS"
    );

    if (!key) {
      return null;
    }

    if (this._ep[key] && this._ep[key].handler) {
      return this._ep[key];
    }

    // Thundering herd protection: if already loading, return existing promise
    if (this._loadingPromises.has(key)) {
      await this._loadingPromises.get(key);
      return this._ep[key];
    }

    const loadPromise = this._loadEndpointsByAPPToCache(params);
    this._loadingPromises.set(key, loadPromise);

    try {
      await loadPromise;
    } finally {
      if (this._loadingPromises.has(key)) {
        this._loadingPromises.delete(key);
      }
    }

    return this._ep[key];
  }

  async _loadEndpointsByAPPToCache(params) {
    try {
      const all_eps = await this._dbFetcher({
        app: params.app,
        enabled: true,
        endpoint: {
          enabled: true,
        },
      });

      if (all_eps && all_eps.idapp) {
        if (all_eps.enabled && all_eps.endpoints) {
          for (let i = 0; i < all_eps.endpoints.length; i++) {
            let endpoint = all_eps.endpoints[i];

            const key = url_key(
              all_eps.app,
              endpoint.resource,
              endpoint.environment,
              endpoint.method,
              endpoint.method == "WS"
            );

            if (!key) {
              continue;
            }

            endpoint.url_key = key;
            endpoint.idapp = all_eps.idapp;
            endpoint.jwt_key = all_eps.jwt_key;

            if (!this._ep[key]) {
              this._ep[key] = {};
            }

            this._ep[key].handler = await this._getApiHandler(
              all_eps.app,
              endpoint,
              all_eps.vrs
            );
          }
        }
      }
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async _getApiHandler(app_name, endpointData, app_vars) {
    let returnHandler = {};
    returnHandler.params = endpointData;
    returnHandler.params.app = app_name;

    try {
      if (endpointData.enabled) {
        let appvars_obj = getAppVarsObject(app_vars);

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

        await this._initializeHandler(returnHandler, appvars_obj);
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

  async _initializeHandler(returnHandler, appvars_obj) {
    const initializer = this._handlerInitializers[returnHandler.params.handler];
    if (initializer) {
      await initializer(returnHandler, appvars_obj);
    }
  }

  async _initVmHandler(returnHandler, appvars_obj) {
    try {
      const vm = await this._vmFactory(
        returnHandler.params.app,
        returnHandler.params.code,
        appvars_obj,
        returnHandler.params.custom_data
      );
      returnHandler.params.method_fn = vm;
    } catch (error) {
      console.trace(error);
    }
  }

  _initFunctionHandler(returnHandler) {
    if (returnHandler.params.code) {
      const methodFn = this._fnLocal[returnHandler.params.code];
      if (!methodFn) {
        return null;
      }
      returnHandler.params.method_fn = methodFn;
    }
  }
}

/**
 * Helper to build appvars object
 */
function getAppVarsObject(vrs) {
  let r = {};
  if (vrs && Array.isArray(vrs)) {
    vrs.forEach((v) => {
      r[v.name] = v.value;
    });
  }
  return r;
}
