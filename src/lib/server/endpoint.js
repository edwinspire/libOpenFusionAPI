import { EventEmitter } from "node:events";
import { get_url_params, key_endpoint_method } from "./utils_path.js";
import { getAppWithEndpoints } from "../db/app.js";
import { createFunction } from "../handler/jsFunction.js";
import { md5, getIPFromRequest } from "./utils.js";
import PromiseSequence from "@edwinspire/sequential-promises";
import { createLog, getLogLevelByStatusCode } from "../db/log.js";

const QUEUE_LOG_NUM_THREAD = process.env.QUEUE_LOG_NUM_THREAD || 5;

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
  queueLog = new PromiseSequence();

  constructor() {
    super();

    this.queueLog.thread(this.pushLog, QUEUE_LOG_NUM_THREAD, []);
  }

  pushLog(log) {
    return new Promise(async (resolve) => {
      let data;
      let error;

      try {
        data = await createLog(log);
      } catch (error) {
        error = error;
      }
      //    console.log(data, error)
      resolve({ data: data, error: error });
    });
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

  getCache(endpoint_key, hash_request) {
    // Verifica la existencia de las propiedades
    if (
      this.internal_endpoint &&
      this.internal_endpoint[endpoint_key] &&
      this.internal_endpoint[endpoint_key].responses &&
      this.internal_endpoint[endpoint_key].responses[hash_request] !== undefined
    ) {
      // Devuelve el valor si todas las propiedades existen
      return this.internal_endpoint[endpoint_key].responses[hash_request];
    } else {
      // Manejo de ausencia de propiedades (puedes personalizar este comportamiento)
      console.warn(
        `No se encontró el valor en el cache para endpoint_key: ${endpoint_key}, hash_request: ${hash_request}.`
      );
      return null; // O un valor por defecto
    }
  }

  clearCache(endpoint_key) {
    if (
      this.internal_endpoint &&
      this.internal_endpoint[endpoint_key] &&
      this.internal_endpoint[endpoint_key].responses
    ) {
      // Devuelve el valor si todas las propiedades existen
      this.internal_endpoint[endpoint_key].responses = [];
      return true;
    } else {
      return false;
      fnSaveApp;
    }
  }

  getCacheSize(app_name) {
    let r = { data: undefined, code: 204 };
    try {
      r.data = [];
      r.code = 200;
      const filteredKeys = Object.keys(this.internal_endpoint).filter((key) => {
        let u = get_url_params(key);
        return u.app == app_name && this.internal_endpoint[key].responses;
      });

      let sizeList = filteredKeys.map((key) => {
        // Calcula el tamaño de la respuesta
        //let r = this.internal_endpoint[ep_list[index]].responses;
        return {
          url: key,
          bytes: Number(
            (
              Buffer.byteLength(
                JSON.stringify(this.internal_endpoint[key].responses),
                "utf-8"
              ) /
              1014 /
              1000
            ).toFixed(4)
          ),
        };
      });

      r.data = sizeList;
    } catch (error) {
      //console.log(error);
      // @ts-ignore
      r.data = error;
      r.code = 500;
      //res.code(500).json({ error: error.message });
    }
    return r;
  }

  hash_request(request, endpoint_key) {
    return md5({
      body: request.body,
      query: request.query,
      url_key: endpoint_key,
    });
  }

  setCache(endpoint_key, request, reply) {
    // Revisar si el endpoint existe
    // Revisa si el endpoint está habilitado para guardar cache
    // Obtiene el md5 del request
    // Obtiene la ultima respuesta del endpoint
    // Guarda la respuesta en la cache

    let ep = this.internal_endpoint[endpoint_key];

    if (ep) {
      this.addCountStatus(endpoint_key, reply?.statusCode);

      let hash_request = this.hash_request(request, endpoint_key);

      let reply_lastResponse =
        reply?.openfusionapi?.lastResponse?.data ?? undefined;

      if (
        reply.statusCode != 500 &&
        reply_lastResponse &&
        ep?.handler?.params?.cache_time > 0 &&
        ep?.handler?.params?.key
      ) {
        // Revisa si la propiedad responses existe
        if (!this.internal_endpoint[endpoint_key].responses) {
          this.internal_endpoint[endpoint_key].responses = {};
        }

        // Verifica si no existe ya datos en cache para este request
        if (!this.getCache(endpoint_key, hash_request)) {
          this.internal_endpoint[endpoint_key].responses[hash_request] =
            reply_lastResponse;

          let cache_time = (ep?.handler?.params?.cache_time ?? 1) * 1000;

          setTimeout(() => {
            if (this.internal_endpoint[endpoint_key].responses[hash_request]) {
              delete this.internal_endpoint[endpoint_key].responses[
                hash_request
              ];

              console.log(
                `Se elimina la cache de ${endpoint_key} luego de ${cache_time} segundos.`
              );
            }
          }, cache_time);
        }
      }
    } else {
      console.log(
        `Endpoint ${endpoint_key} no existe. No se puede setear la cache.`
      );
    }
  }

  getResponseCountStatusCode(app_name) {
    let r = { data: undefined, code: 204 };
    try {
      r.data = [];
      r.code = 200;
      const filteredKeys = Object.keys(this.internal_endpoint).filter((key) => {
        let u = get_url_params(key);
        return u.app == app_name && this.internal_endpoint[key].CountStatusCode;
      });

      let statusCodeList = filteredKeys.map((key) => {
        let r = {};
        r[key] = this.internal_endpoint[key].CountStatusCode;
        return r;
      });

      r.data = statusCodeList;
    } catch (error) {
      //console.log(error);
      // @ts-ignore
      r.data = error;
      r.code = 500;
      //res.code(500).json({ error: error.message });
    }
    return r;
  }

  saveLog(request, reply) {
    // Ultima Respuesta
    let reply_lastResponse =
      reply?.openfusionapi?.lastResponse?.data ?? undefined;

    let handler_param = request?.openfusionapi?.handler?.params;

    // TODO: No guardar en los parameros de handler los datos de test, y analizar tambien si no se debe guardar el codigo
    // TODO: No guardar en cache respuestas con error
    // TODO: capturar tambien los errores 500 para que en el log se lo pueda visualizar
    let param_log = handler_param?.ctrl?.log ?? {};
    let save_log = undefined;

    if (param_log.level == 0) {
      save_log = false;
    } else if (
      param_log.infor &&
      reply.statusCode >= 100 &&
      reply.statusCode <= 199
    ) {
      save_log = true;
    } else if (
      param_log.success &&
      reply.statusCode >= 200 &&
      reply.statusCode <= 299
    ) {
      save_log = true;
    } else if (
      param_log.redirection &&
      reply.statusCode >= 300 &&
      reply.statusCode <= 399
    ) {
      save_log = true;
    } else if (
      param_log.clientError &&
      reply.statusCode >= 400 &&
      reply.statusCode <= 499
    ) {
      save_log = true;
    } else if (
      param_log.serverError &&
      reply.statusCode >= 500 &&
      reply.statusCode <= 599
    ) {
      save_log = true;
    } else if (reply.statusCode == 404) {
      save_log = true;
    }

    // console.log(">>>> param_log >>> ", param_log, save_log);
    //  level =>  0: Disabled, 1 : basic, 2 : Normal, 3 : Full
    try {
      if (save_log) {
        let data_log = {
          timestamp: new Date(),
          idendpoint:
            handler_param?.idendpoint ?? "00000000000000000000000000000000",
          level: getLogLevelByStatusCode(reply.statusCode),
          method: request.method,
          status_code: reply.statusCode,
          user_agent: request.headers["user-agent"],
          client: getIPFromRequest(request),
          req_headers: param_log.level >= 2 ? request.headers : undefined,
          res_headers: param_log.level >= 2 ? reply.headers : undefined,
          query: param_log.level > 2 ? request.query : undefined,
          //body: param_log.level > 2 ? request.body : undefined,
          params: handler_param,
          response_time: reply?.openfusionapi?.lastResponse?.responseTime,
          response_data: param_log.level > 2 ? reply_lastResponse : undefined,

          /*
      metadata: {
        method: request.method,
        userAgent: request.headers["user-agent"], // Obtener el bro
        client: getIPFromRequest(request),
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply?.openfusionapi?.lastResponse?.responseTime, // Tiempo de respuesta
        responseData: param_log.level > 2 ? reply_lastResponse : undefined,
        req_headers: param_log.level >= 2 ? request.headers : undefined,
        res_headers: param_log.level >= 2 ? reply.headers : undefined,
        endpoint: param_log.level > 2 ? handler_param : undefined,
        query: param_log.level > 2 ? request.query : undefined,
        body: param_log.level > 2 ? request.body : undefined,
      },
      */
        };

        //  console.log(data_log);
        this.queueLog.push(data_log);
      }
    } catch (error) {
      console.error(error);
    }
  }

  addCountStatus(endpoint_key, statusCode) {
    if (endpoint_key && statusCode) {
      // Revisa si la propiedad responses existe
      if (!this.internal_endpoint[endpoint_key].CountStatusCode) {
        this.internal_endpoint[endpoint_key].CountStatusCode = {};
        this.internal_endpoint[endpoint_key].CountStatusCode[statusCode] = 0;
      }

      if (
        this.internal_endpoint[endpoint_key]?.CountStatusCode[statusCode] >= 0
      ) {
        this.internal_endpoint[endpoint_key].CountStatusCode[statusCode]++;
      }
    }
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
