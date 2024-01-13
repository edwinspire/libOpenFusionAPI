import "dotenv/config";
import { EventEmitter } from "node:events";
import dns from "dns";
import Fastify from "fastify";
import websocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import dbAPIs from "./db/sequelize.js";
import { defaultApps, getAppByName, getAppWithEndpoints } from "./db/app.js";
import { defaultEndpoints } from "./db/endpoint.js";
import { defaultUser, login } from "./db/user.js";
import { getRoleById } from "./db/role.js";
import { createPathRequest } from "./db/path_request.js";
import { defaultMethods } from "./db/method.js";
import { defaultHandlers } from "./db/handler.js";
import { prefixTableName } from "./db/models.js";
import { runHandler } from "./handler/handler.js";
import { createFunction } from "./handler/jsFunction.js";
import { getApiHandler } from "./db/app.js";

import fs from "fs";
import path from "path";

import {
  validateToken,
  getUserPasswordTokenFromRequest,
  websocketUnauthorized,
  getIPFromRequest,
  getFunctionsFiles,
  md5,
} from "./server/utils.js";

import {
  key_endpoint_method,
  struct_api_path,
  get_url_params,

  //	defaultSystemPath
} from "./server/utils_path.js";

const { PORT, PATH_APP_FUNCTIONS } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

//import { url } from 'node:inspector';
dns.setDefaultResultOrder("ipv4first");

// Este bloque permite convertir un error a String con JSON.stringify
var config = {
  configurable: true,
  value: function () {
    var alt = {};
    var storeKey = function (/** @type {string | number} */ key) {
      // @ts-ignore
      alt[key] = this[key];
    };
    Object.getOwnPropertyNames(this).forEach(storeKey, this);
    return alt;
  },
};
Object.defineProperty(Error.prototype, "toJSON", config);
const dir_fn = path.join(process.cwd(), PATH_APP_FUNCTIONS || "fn");

export default class ServerAPI extends EventEmitter {
  constructor({ buildDB = false } = {}) {
    super();

    if (!PORT) {
      throw { error: "PORT is required" };
    }

    this._fnDEV = new Map();
    this._fnQA = new Map();
    this._fnPRD = new Map();
    this._cacheEndpoint = new Map();
    this._cacheResponse = new Map();

    this.fastify = Fastify({
      logger: true,
    });

    this._build();
  }

  async _build() {
    await this.fastify.register(websocket);
    await this.fastify.register(fastifyStatic, {
      root: join(__dirname, "www"),
      prefix: "/", // opcional: por defecto '/'
    });

    this.buildDB();
    this.loadFunctionFiles();

    this.fastify.addHook("preValidation", async (request, reply) => {
      let request_path_params = get_url_params(request.url);

      if (request_path_params && request_path_params.path) {
        let path_endpoint_method = key_endpoint_method(
          request_path_params.app,
          request_path_params.resource,
          request_path_params.environment,
          request.method
        );

        //
        if (
          !this._cacheEndpoint.has(path_endpoint_method) &&
          !this._appExistsOnCache(request_path_params.app)
        ) {
          // No está en cache, se obtiene todos los endpoints de la aplicación y la carga en CACHE
          await this._loadEndpointsByAPPToCache(request_path_params.app);
        }

        if (this._cacheEndpoint.has(path_endpoint_method)) {
          let handlerEndpoint = this._cacheEndpoint.get(path_endpoint_method);
          handlerEndpoint.url = request_path_params.path;

          if (handlerEndpoint.params.enabled) {
            // Validar si la API es publica o privada
            if (!handlerEndpoint.params.is_public) {
              // Validar si está autenticado
              reply.code(401).send({ error: "Require token" });
            }

            request.openfusionapi = { handler: handlerEndpoint };
          } else {
            reply.code().send({ message: "Endpoint unabled." });
          }
        } else {
          reply.code(404).send({ error: "Not Found" });
        }
      } else {
        reply.code(404).send({ error: "Not Found" });
      }
    });

    this.fastify.addHook("onResponse", async (request, reply) => {
      // Guardamos la respuesta en cache
      if (
        reply.openfusionapi &&
        reply.openfusionapi.lastResponse &&
        reply.openfusionapi.lastResponse.data
      ) {
        this._cacheResponse.set(
          reply.openfusionapi.lastResponse.hash_request,
          reply.openfusionapi.lastResponse.data
        );
      }

      console.log("Fin");
    });

    this.fastify.get("/ws/*", { websocket: true }, (connection, req) => {
      console.log("sssssss");

      connection.socket.on("message", (message) => {
        // message.toString() === 'hi from client'
        connection.socket.send("hi from server");
      });
    });

    // Declare a route
    this.fastify.all(struct_api_path, async (request, reply) => {
      let handlerEndpoint = request.openfusionapi.handler;

      reply.openfusionapi = reply.openfusionapi ?? {};

      if (
        handlerEndpoint.params &&
        handlerEndpoint.params.cache_time &&
        handlerEndpoint.params.cache_time > 0
      ) {
        console.log("----- CACHE ------");

        let hash_request = md5({
          body: request.body,
          query: request.query,
          url: handlerEndpoint.url,
        });

        let data_cache = this._cacheResponse.get(hash_request);

        if (data_cache) {
          // Envia los datos que están en cache
          reply.code(200).send(data_cache);
        } else {

          reply.openfusionapi.lastResponse = {
            hash_request: hash_request,
            data: undefined,
          };

          await runHandler(
            request,
            reply,
            handlerEndpoint.params,
            this._getFunctions(
              handlerEndpoint.params.app,
              handlerEndpoint.params.environment
            )
          );

          setTimeout(() => {
            this._cacheResponse.delete(hash_request);
            console.log("Se elimina la cache de " + hash_request);
          }, handlerEndpoint.params.cache_time * 1000);
        }
      } else {
        await runHandler(
          request,
          reply,
          handlerEndpoint.params,
          this._getFunctions(
            handlerEndpoint.params.app,
            handlerEndpoint.params.environment
          )
        );
      }
    });

    const port = PORT || 3000;
    console.log("Listen on PORT " + port);
    await this.fastify.listen({ port: port });
  }

  loadFunctionFiles() {
    function CreateFnPath(fn_path) {
      try {
        if (!fs.existsSync(fn_path)) {
          // Si no existe, créala recursivamente
          // @ts-ignore
          fs.mkdirSync(
            fn_path,
            { recursive: true },
            (/** @type {any} */ err) => {
              if (err) {
                console.error("Error al crear la ruta:", err);
              } else {
                console.log("Ruta creada exitosamente.");
              }
            }
          );
        } else {
          console.log("La ruta ya existe.");
        }
      } catch (error) {
        console.error(error);
      }
      return fn_path;
    }

    // Crea las rutas para las funciones personalizadas
    CreateFnPath(`${dir_fn}/system/dev`);
    CreateFnPath(`${dir_fn}/system/qa`);
    CreateFnPath(`${dir_fn}/system/prd`);

    CreateFnPath(`${dir_fn}/public/dev`);
    CreateFnPath(`${dir_fn}/public/qa`);
    CreateFnPath(`${dir_fn}/public/prd`);

    getFunctionsFiles(dir_fn).forEach((data_js) => {
      this._appendFunctionsFiles(
        data_js.file,
        data_js.data.appName,
        data_js.data.environment
      );
    });
  }

  /**
   * @param {string} filePath
   * @param {string} _app_name
   * @param {string} environment
   */
  async _appendFunctionsFiles(file_app, _app_name, environment) {
    try {
      console.log("Load Module -> ", file_app);

      // Obtener la última parte
      const fname = file_app.split("/").pop();

      const stat_mod = fs.statSync(file_app);

      if (
        stat_mod.isFile() &&
        fname.endsWith(".js") &&
        fname.startsWith("fn")
      ) {
        console.log("Es un archivo:", fname);

        const taskModule = await import(file_app);

        console.log("Module: ", taskModule);

        if (taskModule && taskModule.default) {
          this._appendAppFunction(
            _app_name,
            environment,
            fname.replace(".js", ""),
            taskModule.default
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  _appendAppFunction(appname, environment, functionName, fn) {
		console.log(appname, environment, functionName);
		if (functionName.startsWith('fn')) {
			switch (environment) {
				case 'dev':
					if (this._fnDEV.has(appname)) {
						let fnList = this._fnDEV.get(appname);
						fnList[functionName] = fn;
						this._fnDEV.set(appname, fnList);
					} else {
						let f = {};
						// @ts-ignore
						f[functionName] = fn;
						this._fnDEV.set(appname, f);
					}
					break;

				case 'qa':
					if (this._fnQA.has(appname)) {
						let fnList = this._fnQA.get(appname);
						fnList[functionName] = fn;
						this._fnQA.set(appname, fnList);
					} else {
						let f = {};
						// @ts-ignore
						f[functionName] = fn;
						this._fnQA.set(appname, f);
					}
					break;

				case 'prd':
					if (this._fnPRD.has(appname)) {
						let fnList = this._fnPRD.get(appname);
						fnList[functionName] = fn;
						this._fnPRD.set(appname, fnList);
					} else {
						let f = {};
						// @ts-ignore
						f[functionName] = fn;
						this._fnPRD.set(appname, f);
					}

					break;
			}
		} else {
			throw `The function must start with "fn". appName: ${appname} - functionName: ${functionName}.`;
		}
	}

  // Función para buscar en las llaves
  _appExistsOnCache(app) {
    const keys_cache = Array.from(this._cacheEndpoint.keys());
    return keys_cache.some((k) => k.startsWith(`/api/${app}/`));
  }

  /**
   * @param {string} appName
   * @param {string} [environment]
   */
  _getFunctions(appName, environment) {
    let d;
    let p;

    switch (environment) {
      case "dev":
        d = this._fnDEV.get(appName);
        p = this._fnDEV.get("public");
        break;

      case "qa":
        d = this._fnQA.get(appName);
        p = this._fnQA.get("public");
        break;
      case "prd":
        d = this._fnPRD.get(appName);
        p = this._fnPRD.get("public");
        break;
    }

    return { ...d, ...p };
  }

  _getApiHandler(app_name, endpointData, appVarsEnv) {
    let returnHandler = {};
    returnHandler.params = endpointData;
    returnHandler.params.app = app_name;

    try {
      appVarsEnv =
        typeof appVarsEnv !== "object"
          ? JSON.parse(appVarsEnv)
          : appVarsEnv ?? {};

      let appVars = appVarsEnv[endpointData.environment];

      if (endpointData.enabled) {
        // @ts-ignore
        if (returnHandler.params.is_public) {
          returnHandler.authentication = async () => {
            //console.log('authentication, public: ', jw_token);
            return true;
          };
        } else {
          // @ts-ignore
          returnHandler.authentication = async (
            /** @type {string} */ jw_token
          ) => {
            return checkAPIToken(app_name, endpointData, jw_token);
          };
        }

        // @ts-ignore
        returnHandler.params.code = returnHandler.params.code || "";

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
        }
        returnHandler.message = "";
        returnHandler.status = 200;
      } else {
        returnHandler.message = `Method ${endpointData.method} Unabled`;
        returnHandler.status = 404;
        //console.log(endpointData);
      }
    } catch (error) {
      // @ts-ignore
      returnHandler.message = error.message;
      returnHandler.status = 505;
      console.trace(error);
    }

    return returnHandler;
  }

  /**
   * @param {any} app
   */
  async _loadEndpointsByAPPToCache(app) {
    try {
      // Carga los endpoints de una App a cache
      let appDataResult = await getAppWithEndpoints({ app: app }, false);

      if (appDataResult && appDataResult.length > 0) {
        const appDatas = appDataResult.map((result) => result.toJSON());

        const appData = appDatas[0];

        for (let i = 0; i < appData.apiserver_endpoints.length; i++) {
          let endpoint = appData.apiserver_endpoints[i];

          let url_app_endpoint = key_endpoint_method(
            appData.app,
            endpoint.resource,
            endpoint.environment,
            endpoint.method
          );

          this._cacheEndpoint.set(
            url_app_endpoint,
            this._getApiHandler(appData.app, endpoint, appData.vars)
          );
        }
      }
    } catch (error) {
      console.trace(error);
    }
  }

  /**
   * @param {boolean} buildDB
   */
  buildDB() {
    let buildDB = process.env.BUILD_DB ?? false;

    if (buildDB) {
      console.log("Crea la base de datos");

      (async () => {
        try {
          await dbAPIs.sync({ alter: true });
          await defaultUser();
          await defaultMethods();
          await defaultHandlers();
          await defaultApps();
          await defaultEndpoints();
        } catch (error) {
          console.log(error);
        }
      })();
    }
    return true;
  }
}
