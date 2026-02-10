import { EventEmitter } from "node:events";
import { get_url_params, url_key } from "../utils_path.js";
import { getApplicationTreeByFilters } from "../../db/app.js";

import { getIPFromRequest } from "../utils.js";
import { getLogLevelForStatus, replaceAllFast } from "./utils.js";
import { createLog, getLogLevelByStatusCode } from "../../db/log.js";
import { getMongoDBHandlerParams } from "../../handler/mongoDB.js";
import { TimedCache } from "./TimedCache.js";
import { CreateMCPHandler } from "./handlerBuild/mcp.js";
import { createFunctionVM } from "../createFunctionVM.js";
import hash from "object-hash";
import Ajv from "ajv";
const ajv = new Ajv();
const default_id_app = "62a03367-e2d5-459c-b236-b6878f546142";

export default class Endpoint extends EventEmitter {
  internal_endpoint = {};
  fnLocal = {};
  loadingPromises = new Map();

  constructor() {
    super();
    this.cache = new TimedCache();
  }

  async pushLog(log) {
    try {
      const data = await createLog(log);
      return { data: data, error: undefined };
    } catch (err) {
      return { data: undefined, error: err };
    }
  }

  getFnNames() {
    let r = {};

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
    const { url_key } = request_path_params;

    // Fast path: already cached
    if (this.internal_endpoint[url_key]) {
      return this.internal_endpoint[url_key];
    }

    // Protection against Thundering Herd: Promise Caching
    if (this.loadingPromises.has(url_key)) {
      // If currently loading, wait for the existing promise
      await this.loadingPromises.get(url_key);
    } else {
      // Start loading and cache the promise
      const loadPromise = this._loadEndpointsByAPPToCache(request_path_params);
      this.loadingPromises.set(url_key, loadPromise);
      try {
        await loadPromise;
      } finally {
        this.loadingPromises.delete(url_key);
      }
    }

    return this.internal_endpoint[url_key];
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
        return {
          idendpoint: this.internal_endpoint[key]?.handler?.params?.idendpoint,
          cache_size: this.cache.getCacheSizeEndpoint({
            app: app_name,
            resource: this.internal_endpoint[key]?.handler?.params?.resource,
            env: this.internal_endpoint[key]?.handler?.params?.environment,
            method: this.internal_endpoint[key]?.handler?.params?.method,
          }),
          statusCode: this.internal_endpoint[key].CountStatusCode,
        };
      });

      r.data = data;
    } catch (error) {
      r.data = error;
      r.code = 500;
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
        // Obtiene el tamaño de cache de cada endpoint qu corresponden a la app pasada como parámetro
        return {
          idendpoint: this.internal_endpoint[key]?.handler?.params?.idendpoint,
          size: this.cache.getCacheSizeEndpoint({
            app: app_name,
            resource: this.internal_endpoint[key]?.handler?.params?.resource,
            env: this.internal_endpoint[key]?.handler?.params?.environment,
            method: this.internal_endpoint[key]?.handler?.params?.method,
          }),
        };
      });

      r.data = sizeList;
    } catch (error) {
      r.data = error;
      r.code = 500;
    }
    return r;
  }

  hash_request(request, endpoint_key) {
    return hash(
      {
        body: request.body,
        query: request.query,
        url_key: endpoint_key,
      },
      {
        algorithm: "sha256",
        respectType: true,
        unorderedObjects: false,
      }
    );
  }

  setCache(url_key, request, reply) {
    // Revisar si el endpoint existe
    // Revisa si el endpoint está habilitado para guardar cache
    // Obtiene el md5 del request
    // Obtiene la ultima respuesta del endpoint
    // Guarda la respuesta en la cache

    let ep = this.internal_endpoint[url_key];

    if (ep) {
      const hash_request = request.openfusionapi.hash_request;
      const reply_lastResponse = reply?.openfusionapi?.lastResponse;

      if (
        reply.statusCode != 500 &&
        reply_lastResponse &&
        ep?.handler?.params?.cache_time > 0
      ) {
        // Verifica si no existe ya datos en cache para este request
        let cache_stored = this.cache.get({
          app: ep?.handler?.params?.app,
          resource: ep?.handler?.params?.resource,
          env: ep?.handler?.params?.environment,
          method: request.method,
          hash: hash_request,
        });

        if (!cache_stored) {
          const contentLength = reply.getHeader("content-length");
          let sizeKB = 0;
          if (contentLength) {
            sizeKB = Number(contentLength) / 1024;
          } else {
            const lastRespData = reply_lastResponse?.data;
            if (Buffer.isBuffer(lastRespData)) {
              sizeKB = lastRespData.length / 1024;
            } else if (typeof lastRespData === 'string') {
              sizeKB = Buffer.byteLength(lastRespData) / 1024;
            } else {
              try {
                sizeKB = Buffer.byteLength(JSON.stringify(reply_lastResponse), "utf8") / 1024;
              } catch (e) {
                sizeKB = 0; // Fallback if stringify fails
              }
            }
          }

          let payload_cache = {
            data: reply?.openfusionapi?.lastResponse?.data ?? undefined,
            responseTime: reply?.openfusionapi?.lastResponse?.responseTime,
            size: sizeKB > 0 ? Math.round(sizeKB * 10000) / 10000 : 0,
            idendpoint: ep?.handler?.params?.idendpoint,
            idapp: ep?.handler?.params?.idapp,
          };

          this.cache.add({
            app: ep?.handler?.params?.app,
            resource: ep?.handler?.params?.resource,
            env: ep?.handler?.params?.environment,
            method: request.method,
            hash: hash_request,
            timeout: ep?.handler?.params?.cache_time ?? 1,
            payload: payload_cache,
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
      r.data = error;
      r.code = 500;
    }
    return r;
  }

  getDataLog(log_level, request, reply) {
    let handler_param = request?.openfusionapi?.handler?.params || {};

    let data_log = {
      trace_id: request.headers["ofapi-trace-id"],
      timestamp: new Date(),
      idapp: handler_param?.idapp ?? default_id_app, // Es un id por defecto temporal
      idendpoint: handler_param?.idendpoint ?? default_id_app, // Es un id por defecto temporal
      method: request.method,
      price_by_request: handler_param?.price_by_request ?? 0,
      price_kb_request: handler_param?.price_kb_request ?? 0,
      price_kb_response: handler_param?.price_kb_response ?? 0,
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
      message: reply?.openfusionapi?.lastResponse?.exception,
      url: request.url,
      log_level: log_level, // Added log_level to the log entry
    };

    //  level =>  0: Disabled, 1 : basic, 2 : Normal, 3 : Full
    data_log.client = getIPFromRequest(request);

    // Common logic for levels > 0
    if (log_level > 0) {
      if (log_level >= 2) {
        // Level 2 (Normal): Basic + query, params (sanitized), body (truncated)
        data_log.query = request.query;
        data_log.user_agent = request.headers["user-agent"];

        // Safe param cloning
        // eslint-disable-next-line no-unused-vars
        const {
          data_test,
          headers_test,
          description,
          rowkey,
          ctrl,
          ...safeParams
        } = handler_param;
        data_log.params = safeParams;

        // Truncate body if it's too large (e.g., > 10KB)
        data_log.body = this.truncateData(request.body);
      }

      if (log_level >= 3) {
        // Level 3 (Full): Normal + headers, response_data (truncated)
        data_log.req_headers = request.headers;
        data_log.res_headers = reply.getHeaders();
        data_log.response_data = this.truncateData(
          reply?.openfusionapi?.lastResponse?.data
        );
      }
    } else {
      // Level 0: Disabled
      return undefined;
    }

    return data_log;
  }

  truncateData(data, maxLength = 10240) {
    if (!data) return undefined;

    try {
      if (typeof data === 'string') {
        if (data.length > maxLength) {
          return data.substring(0, maxLength) + '...[TRUNCATED]';
        }
        return data;
      }

      if (Buffer.isBuffer(data)) {
        if (data.length > maxLength) {
          return '[BUFFER TOO LARGE...TRUNCATED]';
        }
        // Depending on requirements, we might not want to log raw buffers even if small
        return '[BUFFER]';
      }

      if (typeof data === 'object') {
        const str = JSON.stringify(data);
        if (str.length > maxLength) {
          // Safer approach for large objects:
          return { _truncated: true, message: "Data too large to log" };
        }
        return data;
      }
    } catch (e) {
      return '[ERROR TRUNCATING DATA]';
    }

    return data;
  }

  saveLog(request, reply) {
    try {
      let param_log = request?.openfusionapi?.handler?.params?.ctrl?.log ?? {};
      const category = getLogLevelForStatus(reply.statusCode);
      const level = param_log[`status_${category}`] ?? 1;

      const save_log = this.getDataLog(level, request, reply);

      if (save_log) {
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
    // Tambien eliminamos la cache asociada
    this.cache.delete({ app: app_name });
  }

  deleteEndpointByidEndpoint(idendpoint) {
    if (idendpoint) {
      let ep_list = Object.keys(this.internal_endpoint);

      for (let index = 0; index < ep_list.length; index++) {
        let ep = this.internal_endpoint[ep_list[index]];
        if (ep && ep.handler.params.idendpoint == idendpoint) {
          this.cache.delete({
            app: ep?.handler?.params?.app,
            resource: ep?.handler?.params?.resource,
            env: ep?.handler?.params?.environment,
            method: ep?.handler?.params?.method,
          });
          delete this.internal_endpoint[ep_list[index]];

          break;
        }
      }
    }
  }

  deleteEndpointsByIdApp(idapp, env) {
    if (idapp) {
      let ep_list = Object.keys(this.internal_endpoint);

      for (let index = 0; index < ep_list.length; index++) {
        let ep = this.internal_endpoint[ep_list[index]];
        if (
          ep &&
          ep.handler.params.idapp == idapp &&
          ep.handler.params.environment == env
        ) {
          this.cache.delete({
            app: ep?.handler?.params?.app,
            resource: ep?.handler?.params?.resource,
            env: ep?.handler?.params?.environment,
            method: ep?.handler?.params?.method,
          });

          delete this.internal_endpoint[ep_list[index]];
        }
      }
    }
  }

  async _loadEndpointsByAPPToCache(params) {
    try {
      // Carga los endpoints de una App a cache
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
            // Para estos casos lo que se hace es remplazar las variables directamente en el código

            returnHandler.params.code = replaceAllFast(
              returnHandler.params.code,
              props
            );

            //        console.log("Se han reemplazado");
          }
        }

        /////////////////////////////////////////////////////////////

        if (returnHandler?.params?.json_schema?.in?.enabled) {
          try {
            returnHandler.params.json_schema.in.fn_ajv_validate_schema =
              ajv.compile(returnHandler.params.json_schema.in.schema);
          } catch (error) {
            console.trace(error);
          }
        }

        // Para que los datos del server vayan a cache
        if (returnHandler.params.handler == "MCP") {
          returnHandler.params.server_mcp = await CreateMCPHandler(
            returnHandler.params.app,
            returnHandler.params.environment
          );
        }

        if (returnHandler.params.handler == "MONGODB") {
          returnHandler.params.jsFn = await createFunctionVM(
            getMongoDBHandlerParams(returnHandler.params.code).code,
            appvars_obj,
            returnHandler.params.timeout
          );

          // Se libera espacio de esta variable ya que no se va a utilizar mas
          returnHandler.params.code = undefined;
        } else if (returnHandler.params.handler == "JS") {
          returnHandler.params.jsFn = await createFunctionVM(
            returnHandler.params.code,
            appvars_obj,
            returnHandler.params.timeout
          );

          // Se libera espacio de esta variable ya que no se va a utilizar mas
          returnHandler.params.code = undefined;
        } else if (returnHandler.params.handler == "FUNCTION") {
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
      }
    } catch (error) {
      returnHandler.message = error.message;
      returnHandler.status = 500;
      console.trace(error);
    }

    return returnHandler;
  }
}
