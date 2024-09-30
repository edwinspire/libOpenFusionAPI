import "dotenv/config";
import { EventEmitter } from "node:events";
import dns from "dns";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import multipart from "@fastify/multipart";

import websocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";

import { fileURLToPath } from "url";
import { dirname } from "path";

import dbAPIs from "./db/sequelize.js";
import { defaultApps, getAppByName, getAppWithEndpoints } from "./db/app.js";
import { defaultEndpoints } from "./db/endpoint.js";
import { defaultUser, login } from "./db/user.js";
//import { defaultAPIUserMapping } from "./db/api_user mapping.js";
//import { defaultRoles } from "./db/role.js";
import { createPathRequest } from "./db/path_request.js";
import { defaultMethods } from "./db/method.js";
import { defaultHandlers } from "./db/handler.js";
import { prefixTableName } from "./db/models.js";
import { runHandler } from "./handler/handler.js";
import { createFunction } from "./handler/jsFunction.js";
import { getApiHandler } from "./db/app.js";
import { fnPublic, fnSystem } from "./server/functions/index.js";
//import { defaultAPIUser, getAPIUser } from "./db/api_user.js";

import fs from "fs";
import path from "path";

import Ajv from "ajv";
const ajv = new Ajv();

import {
  checkToken,
  getUserPasswordTokenFromRequest,
  websocketUnauthorized,
  getIPFromRequest,
  getFunctionsFiles,
  md5,
  sizeOfMapInKB,
} from "./server/utils.js";

import { schema_input_hooks } from "./server/schemas/index.js";

import {
  key_endpoint_method,
  struct_api_path,
  get_url_params,
  internal_url_post_hooks,
  //	defaultSystemPath
} from "./server/utils_path.js";

const { PORT, PATH_APP_FUNCTIONS, JWT_KEY, HOST } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

//------------------------
const validate_schema_input_hooks = ajv.compile(schema_input_hooks);

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
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
    //this._cacheResponse = new Map();
    this._cacheURLResponse = new Map();

    this.fastify = Fastify({
      logger: true,
    });

    this._build();
  }

  async _build() {
    await this.fastify.register(formbody);
    await this.fastify.register(multipart);

    this.fastify.register(cookie, {
      secret: JWT_KEY, // for cookies signature
      hook: "preValidation", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
      parseOptions: {}, // options for parsing cookies
    });

    await this.fastify.register(cors, {
      origin: "*",
    });
    await this.fastify.register(websocket);

    const www_dir = "www";
    const rutaDirectorio = path.join(process.cwd(), www_dir);

    // Verificar si el directorio existe
    if (!fs.existsSync(rutaDirectorio)) {
      // Crear el directorio si no existe
      fs.mkdirSync(rutaDirectorio);
    }

    await this.fastify.register(fastifyStatic, {
      root: rutaDirectorio,
      prefix: "/", // opcional: por defecto '/'
    });

    this.buildDB();
    this.loadFunctionFiles();
    this._addFunctions();

    this.fastify.addHook("preValidation", async (request, reply) => {
      let request_path_params = get_url_params(request.url);

      if (request_path_params && request_path_params.path) {
        let path_endpoint_method = key_endpoint_method(
          request_path_params.app,
          request_path_params.resource,
          request_path_params.environment,
          request.method,
          request.ws
        );

        //

        let _appExistsOnCache_var = this._appExistsOnCache(
          request_path_params.app
        );

        if (!_appExistsOnCache_var) {
          // Carga todos los endpoints en la cache
          await this._loadEndpointsByAPPToCache(request_path_params.app);
        } else if (!this._cacheEndpoint.has(path_endpoint_method)) {
          // Carga solo el endpoint que no está en cache
          await this._loadEndpointsByAPPToCache(
            request_path_params.app,
            path_endpoint_method
          );
        }

        
        if (request_path_params.path == "/api/system/functions/prd") {
          try {
            //	console.log('Functions >>>>>>>');
            // @ts-ignore
            await this._functions(request, reply);
          } catch (error) {
            // @ts-ignore
            reply.code(500).send({ error: error.message });
          }
        } else if (
          request_path_params.path == "/api/system/cache/response/size" &&
          request.method == "GET"
        ) {
          let filteredEntries = Array.from(this._cacheURLResponse).filter(
            ([key, value]) => {
              let u = get_url_params(key);

              return u.app == request.query.appName;
            }
          );

          let sizeList = filteredEntries.map(([key, value]) => {
            // Calcula el tamaño de la respuesta
            return {
              url: key,
              bytes: Number(
                (
                  Buffer.byteLength(JSON.stringify(value), "utf-8") /
                  1014 /
                  1000
                ).toFixed(4)
              ),
            };
          });

          reply.code(200).send(sizeList);
        } else if (
          request_path_params.path == "/api/system/cache/clear" &&
          request.method == "POST"
        ) {
          let data = request.body;
          let clear_cache = [];

          if (data && Array.isArray(data) && data.length > 0) {
            clear_cache = data.map((u) => {
              return { url: u, clear: this._cacheURLResponse.delete(u) };
            });
          }

          reply.code(200).send(clear_cache);
        } else {
          ///
          if (this._cacheEndpoint.has(path_endpoint_method)) {
            let handlerEndpoint = this._cacheEndpoint.get(path_endpoint_method);
            handlerEndpoint.url = request_path_params.path;

            if (handlerEndpoint.params.enabled) {
              request.openfusionapi = { handler: handlerEndpoint };
              await this._check_auth(handlerEndpoint, request, reply);
            } else {
              reply.code(200).send({ message: "Endpoint unabled." });
            }
          } else {
            reply
              .code(404)
              .send({ error: "Endpoint Not Found", url: path_endpoint_method });
          }
        }
      }
    });

    this.fastify.addHook("onResponse", async (request, reply) => {
      // Guardamos la respuesta en cache
      if (
        reply.openfusionapi &&
        reply.openfusionapi.lastResponse &&
        reply.openfusionapi.lastResponse.data &&
        request &&
        request.openfusionapi &&
        request.openfusionapi.handler &&
        request.openfusionapi.handler.params &&
        request.openfusionapi.handler.params.cache_time &&
        request.openfusionapi.handler.params.cache_time > 0
      ) {
        /*
        this._cacheResponse.set(
          reply.openfusionapi.lastResponse.hash_request,
          reply.openfusionapi.lastResponse.data
        );
        */

        let cacheResp =
          this._cacheURLResponse.get(request.openfusionapi.handler.url) || {};
        cacheResp[reply.openfusionapi.lastResponse.hash_request] =
          reply.openfusionapi.lastResponse.data;

        this._cacheURLResponse.set(
          request.openfusionapi.handler.url,
          cacheResp
        );

        setTimeout(() => {
          //this._cacheResponse.delete(hash_request);
          let objCache = this._cacheURLResponse.get(
            request.openfusionapi.handler.url
          );
          if (objCache) {
            delete objCache[reply.openfusionapi.lastResponse.hash_request];

            console.log(
              "Se elimina la cache de " +
                request.openfusionapi.handler.url +
                " luego de " +
                request.openfusionapi.handler.params.cache_time * 1000 +
                " segundos."
            );
          }
        }, request.openfusionapi.handler.params.cache_time * 1000);

        /*
        console.log(
          "SET CACHE >>>>>> ",

          request.openfusionapi.handler.url,
          this._cacheURLResponse.get(request.openfusionapi.handler.url)
        );
*/
      }
    });

    this.fastify.get("/ws/*", { websocket: true }, (connection, req) => {
      connection.socket.on("message", (message) => {
        // message.toString() === 'hi from client'
        connection.socket.send("hi from server");
      });
    });

    // Route to internal Hook
    this.fastify.post(internal_url_post_hooks, async (request, reply) => {
      // TODO: Evaluar si esta seccion requiere Token valido, ya que el acceso es solo interno

      //console.log("\n\n>>>>>++++>>>\n", request.body);

      // Valida que el origen sea solo local
      let ip_request = getIPFromRequest(request);

      if (
        ip_request === "127.0.0.1" ||
        ip_request === "::1" ||
        ip_request === "::ffff:127.0.0.1"
      ) {
        // TODO: Manejar un web hook por cada aplicación

        // TODO: Hacer mas pruebas y verificar que pasa con  validate_schema_input_hooks cuando hay varios hilos. Se pueden llegar a mesclar las respuesta?

        //console.log("\n\n>>>>>>>>\n", request.body);

        if (validate_schema_input_hooks(request.body)) {
          reply.send({ result: true });

          if (request.body.data && request.body.data.db.model) {
            //   console.log('YYYYYYYYY>>>>>>', request.body);

            if (
              request.body.data.db.model == prefixTableName("application") &&
              request.body.data.db.action &&
              request.body.data.db.action === "afterUpsert"
            ) {
              //  console.log('XXXXXXXXXXXXXXXX>', request.body);
              if (request.body.app) {
                // TODO: Revisar el entorno no solo la app

                setTimeout(() => {
                  // Espera 30 segundos para borrar la cache de las funciones del endpoint
                  this._deleteEndpointsByAppName(request.body.app);
                }, 30000);

                /*
                request.body.data.db.row.forEach((row) => {
                  if (row) {
                    this._deleteEndpointsByAppName(row.app);
                  }
                });
                */
              }
            }
          }
        } else {
          reply.code(400).send(validate_schema_input_hooks.errors);
        }
      } else {
        reply.code(404).send();
      }
    });

    // Declare a route
    this.fastify.all(struct_api_path, async (request, reply) => {
      // await this._preValidation(request, reply);

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

        //let data_cache = this._cacheResponse.get(hash_request);
        let data_cache = this._cacheURLResponse.get(handlerEndpoint.url);

        if (data_cache && data_cache[hash_request]) {
          // Envia los datos que están en cache
          reply.code(200).send(data_cache[hash_request]);
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
    const host = HOST || "localhost";
    console.log(
      `Listen on PORT ${port} and HOST ${host}`,
      __dirname,
      PORT,
      PATH_APP_FUNCTIONS,
      JWT_KEY,
      HOST
    );
    await this.fastify.listen({ port: port, host: host });
  }

  _checkCTRLAccessEndpoint(user, app) {
    // Recorrer las propiedades del objeto user
    if (user && app) {
      for (let key in user) {
        // Verificar si la propiedad actual existe en app
        if (!(key in app)) {
          return false;
        }
        // Verificar si el valor de la propiedad coincide
        if (user[key] !== app[key]) {
          return false;
        }
        // Si la propiedad es un objeto, llamar recursivamente a la función
        if (typeof user[key] === "object" && user[key] !== null) {
          if (!this._checkCTRLAccessEndpoint(user[key], app[key])) {
            return false;
          }
        }
      }
    } else {
      return false;
    }

    return true;
  }

  _check_auth_Bearer(handler, data_aut) {
    let check =
      data_aut.Bearer &&
      data_aut.Bearer.data &&
      data_aut.Bearer.data.enabled &&
      data_aut.Bearer.data.ctrl &&
      handler.params &&
      handler.params.environment &&
      data_aut.Bearer.data.ctrl[handler.params.environment];

    if (check) {
      let ctrl_user = data_aut.Bearer.data.ctrl[handler.params.environment];
      let ctrl_endpoint = handler.params.ctrl;

      return this._checkCTRLAccessEndpoint(ctrl_user, ctrl_endpoint);
    } else {
      return false;
    }
  }

  async _check_auth_Basic(handler, data_aut, request, reply) {
    try {
      let user = await login(data_aut.Basic.username, data_aut.Basic.password);

      if (user.login) {
        let data_user = checkToken(user.token);

        // Simulamos un Bearer para usar el mismo método
        data_aut.Bearer.data = data_user;

        if (this._check_auth_Bearer(handler, data_aut)) {
          request.openfusionapi.user = data_user;
        } else {
          reply.code(401).send({ error: "The API requires a valid Token." });
        }
      } else {
        reply.code(401).send({ error: "The API requires a valid Token." });
      }
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }

  async _check_auth(handler, request, reply) {
    // Validar si la API es publica o privada

    if (handler.params.access > 0) {
      let data_aut = getUserPasswordTokenFromRequest(request);

      //
      if (handler.params.app == "system") {
        // Las APIs de system solo se pueden acceder con token de usuario
        // TODO: Validar los casos cuando no son admin pero si tiene las atribuciones para system
        if (this._check_auth_Bearer(handler, data_aut)) {
          request.openfusionapi.user = data_aut.Bearer.data;
          // Agregar las funciones
          // TODO: Ver la forma de devolver las funciones de forma dinamica sin necesidad de usar un endpoint quemado en el código
          //request.openfusionapi.functions = this._getNameFunctions();
        } else {
          reply
            .code(401)
            .send({ error: "The System API requires a valid Token." });
        }
      } else {
        //

        switch (handler.params.access) {
          case 1: // Basic
            // Aqui el código para validar usuario y clave de API
            // Este paso puede ser pesado ya que se debe consultar a la base de datos. Es recomendable usarlo en lo minimo
            if (data_aut.Basic.username && data_aut.Basic.password) {
              await this._check_auth_Basic(handler, data_aut, request, reply);
            } else {
              reply
                .code(401)
                .send({ error: "The API requires a valid Token." });
            }

            break;

          case 2:
            if (this._check_auth_Bearer(handler, data_aut)) {
              request.openfusionapi.user = data_aut.Bearer.data;
            } else {
              reply
                .code(401)
                .send({ error: "The API requires a valid Token." });
            }

            break;
          case 3:
            if (this._check_auth_Bearer(handler, data_aut)) {
              request.openfusionapi.user = data_aut.Bearer.data;
            } else if (data_aut.Basic.username && data_aut.Basic.password) {
              await this._check_auth_Basic(handler, data_aut, request, reply);
              console.log(
                ">>>>>> this._check_auth_Basic(handler, data_aut, request, reply);"
              );
            } else {
              reply
                .code(401)
                .send({ error: "The API requires a valid Token." });
            }

            break;
          default:
            reply.code(401).send({ error: "Unknown authorization type." });
            break;
        }
      }
    }
  }

  async _functions(
    req,
    /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ res
  ) {
    try {
      if (req && req.query && req.query.appName && req.query.environment) {
        // @ts-ignore
        res
          .code(200)
          .send(
            this._getNameFunctions(req.query.appName, req.query.environment)
          );
      } else {
        res.code(400).send({ error: "appName and environment are required" });
      }
    } catch (error) {
      console.trace(error);
      // @ts-ignore
      res.code(500).send({ error: error.message });
    }
  }

  _getNameFunctions(appName, environment) {
    let f = this._getFunctions(appName, environment);
    if (f) {
      return Object.keys(f);
    }

    return [];
  }

  _addFunctions() {
    if (fnSystem) {
      if (fnSystem.fn_system_prd) {
        const entries = Object.entries(fnSystem.fn_system_prd);
        for (let [fName, fn] of entries) {
          console.log(":::::.> fnSystem >> ", fName, fn);
          this._appendAppFunction("system", "prd", fName, fn);
        }
      }

      if (fnSystem.fn_system_qa) {
        const entries = Object.entries(fnSystem.fn_system_qa);
        for (let [fName, fn] of entries) {
          console.log(":::::.> fnSystem >> ", fName, fn);
          this._appendAppFunction("system", "qa", fName, fn);
        }
      }

      if (fnSystem.fn_system_dev) {
        const entries = Object.entries(fnSystem.fn_system_dev);
        for (let [fName, fn] of entries) {
          console.log(":::::.> fnSystem >> ", fName, fn);
          this._appendAppFunction("system", "dev", fName, fn);
        }
      }
    }

    if (fnPublic) {
      if (fnPublic.fn_public_dev) {
        const entriesP = Object.entries(fnPublic.fn_public_dev);
        for (let [fName, fn] of entriesP) {
          //console.log(prop + ": " + fn);
          this._appendAppFunction("public", "dev", fName, fn);
        }
      }
      if (fnPublic.fn_public_qa) {
        const entriesP = Object.entries(fnPublic.fn_public_qa);
        for (let [fName, fn] of entriesP) {
          //console.log(prop + ": " + fn);
          this._appendAppFunction("public", "qa", fName, fn);
        }
      }
      if (fnPublic.fn_public_prd) {
        const entriesP = Object.entries(fnPublic.fn_public_prd);
        for (let [fName, fn] of entriesP) {
          //console.log(prop + ": " + fn);
          this._appendAppFunction("public", "dev", fName, fn);
        }
      }
    }
  }

  _deleteEndpointsByAppName(app_name) {
    let list_endpoints = Array.from(this._cacheEndpoint.keys());
    list_endpoints.forEach((lep) => {
      if (lep.includes("/api/" + app_name) || lep.includes("/ws/" + app_name)) {
        this._cacheEndpoint.delete(lep);
      }
    });
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
    if (functionName.startsWith("fn")) {
      switch (environment) {
        case "dev":
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

        case "qa":
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

        case "prd":
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
    return keys_cache.some(
      (k) => k.startsWith(`/api/${app}/`) || k.startsWith(`/ws/${app}/`)
    );
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
    // Si hay funciones publicas con el mismo nombre que la función de aplicación, la funcion de aplicación sobreescribe a la publica
    return { ...p, ...d };
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
      returnHandler.status = 500;
      console.trace(error);
    }

    return returnHandler;
  }

  /**
   * @param {any} app
   */
  async _loadEndpointsByAPPToCache(app, only_url_app_endpoint) {
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

            if (
              only_url_app_endpoint &&
              only_url_app_endpoint == url_app_endpoint
            ) {
              this._cacheEndpoint.set(
                url_app_endpoint,
                this._getApiHandler(appData.app, endpoint, appData.vars)
              );
              break;
            } else {
              this._cacheEndpoint.set(
                url_app_endpoint,
                this._getApiHandler(appData.app, endpoint, appData.vars)
              );
            }
          }
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
    let buildDB = process.env.BUILD_DB;

    if (buildDB && buildDB.toString().toUpperCase() == "TRUE") {
      console.log("Crea la base de datos");

      (async () => {
        try {
          await dbAPIs.sync({ alter: true });
          //  await defaultRoles();
          await defaultUser();
          await defaultMethods();
          await defaultHandlers();
          await defaultApps();
          await defaultEndpoints();
          //await defaultAPIUser();
          //  await defaultAPIUserMapping();
        } catch (error) {
          console.log(error);
        }
      })();
    }
    return true;
  }
}
