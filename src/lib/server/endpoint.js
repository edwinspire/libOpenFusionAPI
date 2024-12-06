import { EventEmitter } from "node:events";
import { get_url_params, key_endpoint_method } from "./utils_path.js";
import { getAppWithEndpoints } from "../db/app.js";
import { createFunction } from "../handler/jsFunction.js";

/*
{
    "/ggg/jjg/kkk|POST": {
        "handler": "fn",
        "responses": {
            "cache": {
                "md5_request": "data_timeout"
            },
            "status": {"100": 10, "500": 345}
        }
    }
}
*/

export default class Endpoint extends EventEmitter {
  internal_endpoint = {};
  fnLocal = {};

  constructor() {
    super();
  }

  getFnNames() {
    let r = {};
    // this.endpoints.fnLocal[environment][appname][functionName] = fn;
    if (this.fnLocal) {
      let list_env = Object.keys(this.fnLocal);

      for (let i = 0; i < list_env.length; i++) {
        let env_name = list_env[i];
        let list_app = Object.keys(this.fnLocal[env_name]);
        if (!r[env_name]) {
          r[env_name] = {};
        }

        for (let index = 0; index < list_app.length; index++) {
          let app_name = list_app[index];
          r[env_name][app_name] = Object.keys(this.fnLocal[env_name][app_name]);
        }
      }
    }

    return r;
  }

  async getEndpoint(request) {
    let request_path_params = get_url_params(request.url);
    let endpoint_key = key_endpoint_method(
      request_path_params.app,
      request_path_params.resource,
      request_path_params.environment,
      request.method,
      request.ws
    );

    // Revisa si existe el endpoint
    if (!this.internal_endpoint[endpoint_key]) {
      // Si no lo tiene cargado lo obtiene de la base de datos
      await this._loadEndpointsByAPPToCache(
        request_path_params.app,
        endpoint_key
      );
    }
    return this.internal_endpoint[endpoint_key];
  }

  setCache(endpoint, request, reply) {
    // Revisar si el endpoint existe
    // Revisa si el endpoint está habilitado para guardar cache
    // Obtiene el md5 del request
    // Obtiene la ultima respuesta del endpoint
    // Guarda la respuesta en la cache
  }

  deleteApp(app_name) {
    // Elimina todos los endpoints asociados a la app_name
    let ep_list = Object.keys(this.internal_endpoint);

    for (let index = 0; index < ep_list.length; index++) {
      const prms = get_url_params(ep_list[index]);
      if (prms.app == app_name) {
        delete this.internal_endpoint[ep_list[index]];
      }
    }
  }

  async _loadEndpointsByAPPToCache(app, endpoint_key) {
    try {
      // Carga los endpoints de una App a cache
      let appDataResult = await getAppWithEndpoints({ app: app }, false);

      if (appDataResult && appDataResult.length > 0) {
        const appDatas = appDataResult.map((result) => result.toJSON());

        const appData = appDatas[0];

        if (appData.endpoints) {
          for (let i = 0; i < appData.endpoints.length; i++) {
            let endpoint = appData.endpoints[i];

            let url_app_endpoint = key_endpoint_method(
              appData.app,
              endpoint.resource,
              endpoint.environment,
              endpoint.method,
              endpoint.method == "WS"
            );

            endpoint.key = url_app_endpoint;

            if (endpoint_key && endpoint_key == url_app_endpoint) {
              // Carga solo el endpoind solicitado y sale

              if (!this.internal_endpoint[endpoint_key]) {
                this.internal_endpoint[endpoint_key] = {};
              }

              this.internal_endpoint[endpoint_key].handler =
                this._getApiHandler(appData.app, endpoint, appData.vars);

              break;
            }
          }
        }
      }
    } catch (error) {
      console.trace(error);
    }
  }

  _getApiHandler(app_name, endpointData, app_vars) {
    let returnHandler = {};
    returnHandler.params = endpointData;
    returnHandler.params.app = app_name;

    try {
      app_vars =
        typeof app_vars !== "object" ? JSON.parse(app_vars) : app_vars ?? {};

      let appVars = app_vars[endpointData.environment];

      if (endpointData.enabled) {
        if (appVars && typeof appVars === "object") {
          const props = Object.keys(appVars);

          for (let i = 0; i < props.length; i++) {
            const prop = props[i];

            //	console.log('typeof appData.vars[prop]: ', appVars[prop], typeof appVars[prop]);

            switch (typeof appVars[prop]) {
              case "string":
                // @ts-ignore
                returnHandler.params.code = returnHandler.params.code.replace(
                  prop,
                  appVars[prop]
                );
                break;
              case "object":
                // @ts-ignore
                returnHandler.params.code = returnHandler.params.code.replace(
                  '"' + prop + '"',
                  JSON.stringify(appVars[prop])
                );

                // @ts-ignore
                returnHandler.params.code = returnHandler.params.code.replace(
                  prop,
                  JSON.stringify(appVars[prop])
                );
                break;
            }
          }
        }

        // @ts-ignore
        if (returnHandler.params.handler == "JS") {
          // @ts-ignore
          returnHandler.params.jsFn = createFunction(
            returnHandler.params.code,
            appVars
          );

          // Se libera espacio de esta variable ya que no se va a utilizar mas
          returnHandler.params.code = undefined;
        } else if (returnHandler.params.handler == "FUNCTION") {
          // Console obtiene la función
          if (
            this.fnLocal[returnHandler.params.environment] &&
            this.fnLocal[returnHandler.params.environment][
              returnHandler.params.app
            ] &&
            this.fnLocal[returnHandler.params.environment][
              returnHandler.params.app
            ][returnHandler.params.code]
          ) {
            // Busca en la lista de funciones de entorno para asignarla
            returnHandler.params.Fn =
              this.fnLocal[returnHandler.params.environment][
                returnHandler.params.app
              ][returnHandler.params.code];
          } else if (
            this.fnLocal[returnHandler.params.environment] &&
            this.fnLocal[returnHandler.params.environment]["public"] &&
            this.fnLocal[returnHandler.params.environment]["public"][
              returnHandler.params.code
            ]
          ) {
            // Si no existe la función dentro de la app, busca en la lista de la aplicaión publica
            returnHandler.params.Fn =
              this.fnLocal[returnHandler.params.environment]["public"][
                returnHandler.params.code
              ];
          }

          returnHandler.message = "";
          returnHandler.status = 200;
        }
      } else {
        returnHandler.message = `Method ${endpointData.method} Unabled`;
        returnHandler.status = 404;
        //console.log(endpointData);
      }
    } catch (error) {
      // @ts-ignore
      returnHandler.message = error.message;
      returnHandler.status = 500;
      console.trace(error);
    }

    return returnHandler;
  }
}
