import { EventEmitter } from "node:events";
import {
  get_url_params,
  url_key,
  internal_url_endpoint,
} from "./utils_path.js";
import {
  getAppWithEndpoints,
  getAppByName,
  getApplicationTreeByFilters,
} from "../db/app.js";
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
const ajv = new Ajv();

//const QUEUE_LOG_NUM_THREAD = process.env.QUEUE_LOG_NUM_THREAD || 5;
class CacheExpirationQueue {
  constructor() {
    this.heap = [];
    this.timer = null;
  }

  add(expireAt, callback) {
    this.heap.push({ expireAt, callback });
    this.heap.sort((a, b) => a.expireAt - b.expireAt); // simple heap
    this._resetTimer();
  }

  _resetTimer() {
    if (this.timer) clearTimeout(this.timer);

    if (this.heap.length === 0) return;

    const next = this.heap[0];
    const delay = Math.max(0, next.expireAt - Date.now());

    this.timer = setTimeout(() => {
      const item = this.heap.shift();
      item.callback();
      this._resetTimer();
    }, delay);
  }
}

function getLogLevelForStatus(status) {
  if (status >= 100 && status <= 199) return "info";
  if (status >= 200 && status <= 299) return "success";
  if (status >= 300 && status <= 399) return "redirect";
  if (status >= 400 && status <= 499) return "client_error";
  if (status >= 500 && status <= 599) return "server_error";
  return "unknown";
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
    this.cacheQueue = new CacheExpirationQueue();
    //   this.queueLog.thread(this.pushLog, QUEUE_LOG_NUM_THREAD, []);
  }

  pushLog(log) {
    return new Promise(async (resolve) => {
      let data;
      let error;

      try {
        data = await createLog(log);
      } catch (err) {
        error = err;
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

  async getEndpoint(request_path_params) {
    // Revisa si existe el endpoint
    if (!this.internal_endpoint[request_path_params.url_key]) {
      // Si no lo tiene cargado lo obtiene de la base de datos
      await this._loadEndpointsByAPPToCache(request_path_params);
    }

    return this.internal_endpoint[request_path_params.url_key];
  }

  getCache(endpoint_key, hash_request) {
    // Verifica la existencia de las propiedades
    if (
      this.internal_endpoint &&
      this.internal_endpoint[endpoint_key] &&
      this.internal_endpoint[endpoint_key].responses &&
      this.internal_endpoint[endpoint_key].responses[hash_request]?.data
    ) {
      // Devuelve el valor si todas las propiedades existen
      return this.internal_endpoint[endpoint_key].responses[hash_request].data;
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
      this.internal_endpoint[endpoint_key].responses = {};
      return true;
    } else {
      return false;
    }
  }

  getCacheSizeEndpoint(url_key) {
    const responses = this.internal_endpoint[url_key]?.responses;
    if (!responses) return 0;

    let total = 0;
    for (const item of Object.values(responses)) {
      total += item.size;
    }

    return (total / 1024).toFixed(3);
  }

  // this.internal_endpoint[url_key].CountStatusCode
  getInternalAppMetrics(app_name) {
    let r = { data: undefined, code: 204 };
    try {
      r.data = [];
      r.code = 200;
      const filteredKeys = Object.keys(this.internal_endpoint).filter((key) => {
        let u = get_url_params(key);
        return u.app == app_name;
      });

      let data = filteredKeys.map((key) => {
        // Calcula el tamaño de la respuesta
        //let r = this.internal_endpoint[ep_list[index]].responses;
        return {
          idendpoint: this.internal_endpoint[key]?.handler?.params?.idendpoint,
          cache_size: this.getCacheSizeEndpoint(key),
          statusCode: this.internal_endpoint[key].CountStatusCode,
        };
      });

      r.data = data;
    } catch (error) {
      //console.log(error);

      r.data = error;
      r.code = 500;
      //res.code(500).json({ error: error.message });
    }
    return r;
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
          idendpoint: this.internal_endpoint[key]?.handler?.params?.idendpoint,
          size: this.getCacheSizeEndpoint(key),
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

  setCache(url_key, request, reply) {
    // Revisar si el endpoint existe
    // Revisa si el endpoint está habilitado para guardar cache
    // Obtiene el md5 del request
    // Obtiene la ultima respuesta del endpoint
    // Guarda la respuesta en la cache

    let ep = this.internal_endpoint[url_key];

    if (ep) {
      this.addCountStatus(url_key, reply?.statusCode);

      this.emit("request_completed", {
        idendpoint: ep.handler?.params?.idendpoint,
        idapp: ep.handler?.params?.idapp,
        url: request.url,
        method: request.method,
        app: ep.handler?.params?.app,
        environment: ep.handler?.params?.environment,
        //endpoint: ep.handler?.params?.url_method,
        responseTime: reply?.openfusionapi?.lastResponse?.responseTime,
        statusCode: reply.statusCode,
        count_status_code: ep?.CountStatusCode,
      });

      //let hash_request = this.hash_request(request, url_key);
      let hash_request = request.openfusionapi.hash_request;

      let reply_lastResponse =
        reply?.openfusionapi?.lastResponse?.data ?? undefined;

      if (
        reply.statusCode != 500 &&
        reply_lastResponse &&
        ep?.handler?.params?.cache_time > 0
      ) {
        // Revisa si la propiedad responses existe
        if (!this.internal_endpoint[url_key].responses) {
          this.internal_endpoint[url_key].responses = {};
        }

        // Verifica si no existe ya datos en cache para este request
        if (!this.getCache(url_key, hash_request)) {
          const size = Buffer.byteLength(
            JSON.stringify(reply_lastResponse),
            "utf8"
          );

          this.internal_endpoint[url_key].responses[hash_request] = {
            data: reply_lastResponse,
            size,
          };

          let cache_time = (ep?.handler?.params?.cache_time ?? 1) * 1000;

          this.emit("cache_set", {
            app: ep?.handler?.params?.app,
            idendpoint: ep?.handler?.params?.idendpoint,
            idapp: ep?.handler?.params?.idapp,
            cache_size: this.getCacheSizeEndpoint(url_key),
            //count_status_code: ep?.CountStatusCode,
            url: request.url,
          });

          this.cacheQueue.add(Date.now() + cache_time, () => {
            delete this.internal_endpoint[url_key].responses[hash_request];

            this.emit("cache_released", {
              app: ep?.handler?.params?.app,
              idendpoint: ep?.handler?.params?.idendpoint,
              idapp: ep?.handler?.params?.idapp,
              cache_size: this.getCacheSizeEndpoint(url_key),
            });
          });
        }
      }
    } else {
      console.log(`${url_key} not exists on cache (internal_endpoint)`);
    }
  }

  getResponseCountStatusCode(app_name) {
    let r = { data: undefined, code: 204 };
    try {
      r.data = [];
      r.code = 200;
      const filteredKeys = Object.keys(this.internal_endpoint).filter(
        (url_key) => {
          let u = get_url_params(url_key);
          return (
            u.app == app_name && this.internal_endpoint[url_key].CountStatusCode
          );
        }
      );

      let statusCodeList = filteredKeys.map((url_key) => {
        let r = {};
        r[url_key] = this.internal_endpoint[url_key].CountStatusCode;
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
      // let save_log = undefined;

      const category = getLogLevelForStatus(reply.statusCode);
      const level = param_log[`status_${category}`] ?? 1;

      const save_log = this.getDataLog(level, request, reply);

      /*
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
      */

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

  addCountStatus(url_key, statusCode) {
    if (url_key && statusCode) {
      // Revisa si la propiedad responses existe
      if (!this.internal_endpoint[url_key].CountStatusCode) {
        this.internal_endpoint[url_key].CountStatusCode = {};
        this.internal_endpoint[url_key].CountStatusCode[statusCode] = 0;
      }

      if (!this.internal_endpoint[url_key].CountStatusCode[statusCode]) {
        this.internal_endpoint[url_key].CountStatusCode[statusCode] = 0;
      }
      this.internal_endpoint[url_key].CountStatusCode[statusCode]++;
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

  deleteEndpointByidEndpoint(idendpoint) {
    if (idendpoint) {
      let ep_list = Object.keys(this.internal_endpoint);

      for (let index = 0; index < ep_list.length; index++) {
        //const prms = get_url_params(ep_list[index]);
        let ep = this.internal_endpoint[ep_list[index]];
        if (ep && ep.handler.params.idendpoint == idendpoint) {
          this.emit("cache_released", {
            app: ep?.handler?.params?.app,
            idendpoint: ep?.handler?.params?.idendpoint,
            idapp: ep?.handler?.params?.idapp,
            cache_size: 0,
            count_status_code: ep?.CountStatusCode,
            //                 url: request.url,
          });

          delete this.internal_endpoint[ep_list[index]];

          break;
        }
      }
    }
  }

  async _loadEndpointsByAPPToCache(params) {
    try {
      // Carga los endpoints de una App a cache
      //let appDataResult = await getAppWithEndpoints({ app: app }, false);
      let appData = await getApplicationTreeByFilters({
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

            if (!this.internal_endpoint[key]) {
              this.internal_endpoint[key] = {};
            }

            this.internal_endpoint[key].handler = await this._getApiHandler(
              appData.app,
              endpoint,
              appData.vrs
            );
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
      if (endpointData.enabled) {
        let props = [];
        if (Array.isArray(app_vars)) {
          props = app_vars.filter((item) => {
            return endpointData.environment == item.environment;
          });
          if (props.length > 0) {
            if (endpointData.handler == "JS") {
              // Para estos casos lo que se hace es agregar las variables al inicio del código como constantes minimizando el uso de memoria
              for (let i = 0; i < props.length; i++) {
                const prop = props[i];

                const code = String(returnHandler.params.code ?? "");

                if (code.includes(prop.name)) {
                  switch (typeof prop.value) {
                    case "string":
                      returnHandler.params.code = String(
                        `const ${prop.name} = ${JSON.stringify(
                          prop.value
                        )};\n ${returnHandler.params.code}`
                      );
                      break;
                    case "number":
                      returnHandler.params.code = String(
                        `const ${prop.name} = ${prop.value};\n ${returnHandler.params.code}`
                      );

                      break;

                    case "object":
                      returnHandler.params.code = String(
                        `const ${prop.name} = ${JSON.stringify(
                          prop.value
                        )};\n ${returnHandler.params.code}`
                      );

                      break;
                    default:
                      console.log(prop);
                      break;
                  }
                }
              }
            } else {
              // Para estos casos lo que se hace es remplazar las variables directamente en el código
              for (let i = 0; i < props.length; i++) {
                const prop = props[i];
                const re = new RegExp(`\\b${escapeRegExp(prop.name)}\\b`, "g");

                switch (typeof prop.value) {
                  case "string":
                    returnHandler.params.code =
                      returnHandler.params.code.replace(re, prop.value);
                    break;
                  case "number":
                    returnHandler.params.code =
                      returnHandler.params.code.replace(re, prop.value);
                    break;

                  case "object":
                    // Este para los casos en que en el código hayan guardado la variable de aplicación con comillas
                    const reo = new RegExp(
                      `\\b${escapeRegExp(`"${prop.name}"`)}\\b`,
                      "g"
                    );
                    const value_str = JSON.stringify(prop.value);

                    returnHandler.params.code =
                      returnHandler.params.code.replace(reo, value_str);
                    // Este bloque reemplaza las variables que no estén entre comillas
                    returnHandler.params.code =
                      returnHandler.params.code.replace(re, value_str);

                    break;
                  default:
                    console.log(prop);
                    break;
                }
              }
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

        // Para que los datos del server vayan a cache
        if (returnHandler.params.handler == "MCP") {
          let app = await getApplicationTreeByFilters({
            app: returnHandler.params.app,
            enabled: true,
            endpoint: {
              enabled: true,
              environment: returnHandler.params.environment,
            },
          });

          returnHandler.params.server_mcp = (headers) => {
            const server = getServer();

            // TODO: Es posible que se pueda mejorar esta parte del código para que no sea necesario ejecutarlo en cada llamada.
            let mcp_endpoint_tools = app.endpoints.filter((endpoint) => {
              return (
                endpoint.method != "WS" &&
                endpoint.handler != "MCP" &&
                endpoint?.mcp?.enabled
              );
            });

            for (let index2 = 0; index2 < mcp_endpoint_tools.length; index2++) {
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
                  const mimeType = request_endpoint.headers.get("content-type");
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

            return server;
          };
        }

        if (returnHandler.params.handler == "MONGODB") {
          returnHandler.params.jsFn = await createFunction(
            getMongoDBHandlerParams(returnHandler.params.code).code,
            app_vars
          );

          // Se libera espacio de esta variable ya que no se va a utilizar mas
          returnHandler.params.code = undefined;
        } else if (returnHandler.params.handler == "JS") {
          returnHandler.params.jsFn = await createFunction(
            returnHandler.params.code,
            app_vars
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
