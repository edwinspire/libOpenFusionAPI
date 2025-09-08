import { EventEmitter } from "node:events";
import {
  get_url_params,
  key_endpoint_method,
  internal_url_endpoint,
} from "./utils_path.js";
import { getAppWithEndpoints, getAppByName } from "../db/app.js";
import * as z from "zod";
import { getServer } from "../server/mcp/server.js";
//import { jsonSchemaToZod } from "json-schema-to-zod";
import { JSONSchemaToZod } from "@dmitryrechkin/json-schema-to-zod";
//import { createFunction } from "../handler/utils.js";
import {
  md5,
  getIPFromRequest,
  createFunction,
  //jsonSchemaToZod,
  URLAutoEnvironment,
} from "./utils.js";
//import PromiseSequence from "@edwinspire/sequential-promises";
import { createLog, getLogLevelByStatusCode } from "../db/log.js";
import { getMongoDBHandlerParams } from "../handler/mongoDB.js";
import Ajv from "ajv";
//import { runHandler } from "../handler/handler.js";

const ajv = new Ajv();

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
  //queueLog = new PromiseSequence();

  constructor() {
    super();

    //   this.queueLog.thread(this.pushLog, QUEUE_LOG_NUM_THREAD, []);
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
            try {
              if (
                this.internal_endpoint[endpoint_key]?.responses[hash_request]
              ) {
                delete this.internal_endpoint[endpoint_key].responses[
                  hash_request
                ];

                /*
                console.log(
                  `Se elimina la cache de ${endpoint_key} luego de ${cache_time} segundos.`
                );
                */
              }
            } catch (error) {
              console.error(
                "Clean cache endpoint_key " + endpoint_key,
                error,
                hash_request
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

      r.data = error;
      r.code = 500;
      //res.code(500).json({ error: error.message });
    }
    return r;
  }

  getDataLog(log_level, request, reply) {
    let handler_param = request?.openfusionapi?.handler?.params;

    // TODO: No guardar en los parameros de handler los datos de test, y analizar tambien si no se debe guardar el codigo

    if (handler_param?.data_test) {
      handler_param.data_test = undefined;
    }

    if (handler_param?.headers_test) {
      handler_param.headers_test = undefined;
    }

    if (handler_param?.description) {
      handler_param.description = undefined;
    }

    if (handler_param?.rowkey) {
      handler_param.rowkey = undefined;
    }

    if (handler_param?.ctrl) {
      handler_param.ctrl = undefined;
    }

    let data_log = {
      timestamp: new Date(),
      idendpoint:
        handler_param?.idendpoint ?? "00000000000000000000000000000000",
      level: getLogLevelByStatusCode(reply.statusCode),
      method: request.method,
      status_code: reply.statusCode,
      user_agent: undefined,
      client: undefined,
      req_headers: undefined,
      res_headers: undefined,
      query: undefined,
      body: undefined,
      params: undefined,
      response_time: reply?.openfusionapi?.lastResponse?.responseTime,
      response_data: undefined,
      message: undefined,
      url: request.url,
    };

    //  level =>  0: Disabled, 1 : basic, 2 : Normal, 3 : Full

    switch (log_level) {
      case 0:
        data_log = undefined;
        break;
      case 2:
        data_log.req_headers = request.headers;
        data_log.res_headers = reply.getHeaders();
        //data_log.query = request.query;
        //data_log.body = request.body;
        data_log.user_agent = request.headers["user-agent"];
        data_log.client = getIPFromRequest(request);
        break;
      case 3:
        data_log.req_headers = request.headers;
        data_log.res_headers = reply.getHeaders();
        data_log.query = request.query;
        data_log.body = request.body;
        data_log.user_agent = request.headers["user-agent"];
        data_log.client = getIPFromRequest(request);
        data_log.params = handler_param;
        data_log.response_data =
          reply?.openfusionapi?.lastResponse?.data ?? undefined;
        break;
    }
    return data_log;
  }

  saveLog(request, reply) {
    try {
      // TODO: No guardar en cache respuestas con error
      // TODO: capturar tambien los errores 500 para que en el log se lo pueda visualizar
      let param_log = request?.openfusionapi?.handler?.params?.ctrl?.log ?? {};
      let save_log = undefined;

      if (reply.statusCode >= 100 && reply.statusCode <= 199) {
        save_log = this.getDataLog(param_log.status_info, request, reply);
      } else if (reply.statusCode >= 200 && reply.statusCode <= 299) {
        save_log = this.getDataLog(param_log.status_success, request, reply);
      } else if (reply.statusCode >= 300 && reply.statusCode <= 399) {
        save_log = this.getDataLog(param_log.status_redirect, request, reply);
      } else if (reply.statusCode >= 400 && reply.statusCode <= 499) {
        save_log = this.getDataLog(
          param_log.status_client_error,
          request,
          reply
        );
      } else if (reply.statusCode >= 500 && reply.statusCode <= 599) {
        save_log = this.getDataLog(
          param_log.status_server_error == null
            ? 3
            : param_log.status_server_error,
          request,
          reply
        );
      } else if (reply.statusCode == 404) {
        // Forzar el guardado de los errores 404
        save_log = this.getDataLog(1, request, reply);
      }

      // console.log(">>>> param_log >>> ", param_log, save_log);
      //  level =>  0: Disabled, 1 : basic, 2 : Normal, 3 : Full

      if (save_log) {
        //this.queueLog.push(save_log);
        this.emit("log", save_log);
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

        if (appData.enabled && appData.endpoints) {
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
                await this._getApiHandler(appData.app, endpoint, appData.vars);

              break;
            }
          }
        }
      }
    } catch (error) {
      console.trace(error);
    }
  }

  async _getApiHandler(app_name, endpointData, app_vars) {
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
          //TODO: No reemplazar los valores por las variables, mejor crear variables constantes al inicio de la función y el resto debería llamar al valor de la variable, esto para no tener que reemplezar valores en varios lugares sino ahorrar lineas de codigo
          for (let i = 0; i < props.length; i++) {
            const prop = props[i];

            switch (typeof appVars[prop]) {
              case "string":
                returnHandler.params.code = returnHandler.params.code.replace(
                  prop,
                  appVars[prop]
                );
                break;
              case "number":
                returnHandler.params.code = returnHandler.params.code.replace(
                  prop,
                  appVars[prop]
                );
                break;

              case "object":
                returnHandler.params.code = returnHandler.params.code.replace(
                  '"' + prop + '"',
                  JSON.stringify(appVars[prop])
                );

                returnHandler.params.code = returnHandler.params.code.replace(
                  prop,
                  JSON.stringify(appVars[prop])
                );
                break;
              default:
                console.log(typeof appVars[prop], appVars[prop]);
                break;
            }
          }
        }

        // Habilita la validación de datos de entrada usando AJV
        if (returnHandler?.params?.json_schema?.in?.enabled) {
          console.log("Habiltado Validación JSON Schema");

          try {
            returnHandler.params.json_schema.in.fn_ajv_validate_schema =
              ajv.compile(returnHandler.params.json_schema.in.schema);
          } catch (error) {
            console.trace(error);
          }
        }
        /*
        // Crea una función para la validación de las entradas del MCP
        if (returnHandler?.params?.mcp?.enabled) {
          
          let zod_inputSchema = z
            .any()
            .describe("Data to send to the endpoint.");

          if (returnHandler?.params?.json_schema?.in?.schema) {
            // Convertir
            zod_inputSchema = jsonSchemaToZod(
              returnHandler.params.json_schema.in.schema
            );
          }

          returnHandler.params.json_schema.in.fn_zod_validate_schema =
            zod_inputSchema.shape;
        }
        */

        // Para que los datos del server vayan a cache
        if (returnHandler.params.handler == "MCP") {
          let apps = await getAppByName(returnHandler.params.app);

          returnHandler.params.server_mcp = (headers) => {
            const server = getServer();

            // TODO: Es posible que se pueda mejorar esta parte del código para que no sea necesario ejecutarlo en cada llamada.

            for (let index = 0; index < apps.length; index++) {
              const app = apps[index];
              // console.log("App:", app);

              let mcp_endpoint_tools = app.endpoints.filter((endpoint) => {
                return (
                  endpoint.enabled &&
                  endpoint.environment == returnHandler.params.environment &&
                  endpoint.method != "WS" &&
                  endpoint.handler != "MCP" &&
                  endpoint?.mcp?.enabled
                );
              });

              for (
                let index2 = 0;
                index2 < mcp_endpoint_tools.length;
                index2++
              ) {
                const endpoint = mcp_endpoint_tools[index2];
                //  console.log("Endpoint:", endpoint);
                let url_internal = internal_url_endpoint(
                  app.app,
                  endpoint.resource,
                  endpoint.environment,
                  false
                );

                let zod_inputSchema = z
                  .any()
                  .describe("Data to send to the endpoint.");

                if (
                  endpoint?.json_schema?.in?.enabled &&
                  endpoint?.json_schema?.in?.schema
                ) {
                  // Convertir
                  zod_inputSchema = JSONSchemaToZod.convert(
                    endpoint.json_schema.in.schema
                  );
                }

                //   let x = z.toJSONSchema(zod_inputSchema.shape);
                //   console.log(x);

                server.registerTool(
                  endpoint?.mcp?.name && endpoint?.mcp?.name.length > 0
                    ? endpoint?.mcp?.name
                    : `${url_internal}[${endpoint.method}]`,
                  {
                    title:
                      endpoint?.mcp?.title && endpoint?.mcp?.title.length > 0
                        ? endpoint?.mcp?.title
                        : endpoint.description,
                    description: `${
                      endpoint.access == 0 ? "Public" : "Private"
                    }  ${
                      endpoint?.mcp?.description &&
                      endpoint?.mcp?.description.length > 0
                        ? endpoint?.mcp?.description
                        : endpoint.description
                    }`,
                    inputSchema: zod_inputSchema.shape,
                  },

                  async (data) => {
                    let auto_env = new URLAutoEnvironment();
                    let uF = auto_env.create(url_internal, false);

                    let request_endpoint = await uF[
                      endpoint.method.toUpperCase()
                    ]({
                      data: data,
                      headers: headers,
                    });
                    const mimeType =
                      request_endpoint.headers.get("content-type");
                    let data_out = undefined;
                    //let parse_method = getParseMethod(mimeType);
                    // TODO: los datos de salida siempre deben ser como texto aunque sea un objeto json.

                    data_out = await request_endpoint.text();

                    return {
                      content: [
                        {
                          type: "text",
                          mimeType: mimeType,
                          text: data_out,
                        },
                      ],
                    };
                  }
                );
              }
            }
            return server;
          };
        }

        if (returnHandler.params.handler == "MONGODB") {
          returnHandler.params.jsFn = await createFunction(
            getMongoDBHandlerParams(returnHandler.params.code).code,
            appVars
          );

          // Se libera espacio de esta variable ya que no se va a utilizar mas
          returnHandler.params.code = undefined;
        } else if (returnHandler.params.handler == "JS") {
          returnHandler.params.jsFn = await createFunction(
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
      returnHandler.message = error.message;
      returnHandler.status = 500;
      console.trace(error);
    }

    return returnHandler;
  }
}
