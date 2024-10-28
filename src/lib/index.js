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

import { TelegramBot } from "./server/telegram/telegram.js";

import dbAPIs from "./db/sequelize.js";
import {
  defaultApps,
  getAppByName,
  getAppWithEndpoints,
  getApiHandler,
  //  createPathRequest,
} from "./db/app.js";
import { defaultEndpoints } from "./db/endpoint.js";
import { defaultUser, login } from "./db/user.js";
//import { defaultAPIUserMapping } from "./db/api_user mapping.js";
//import { defaultRoles } from "./db/role.js";
import { defaultMethods } from "./db/method.js";
import { defaultHandlers } from "./db/handler.js";
import { prefixTableName } from "./db/models.js";
import { runHandler } from "./handler/handler.js";
import { createFunction } from "./handler/jsFunction.js";
import { fnPublic, fnSystem } from "./server/functions/index.js";

import {
  checkToken,
  getUserPasswordTokenFromRequest,
  websocketUnauthorized,
  getIPFromRequest,
  getFunctionsFiles,
  md5,
  getUUID,
  sizeOfMapInKB,
} from "./server/utils.js";

import { schema_input_hooks } from "./server/schemas/index.js";

import {
  key_endpoint_method,
  struct_api_path,
  get_url_params,
  internal_url_post_hooks,
  default_port,
} from "./server/utils_path.js";

import fs from "fs";
import path from "path";

import Ajv from "ajv";
import { message } from "telegraf/filters";
const ajv = new Ajv();

const { PATH_APP_FUNCTIONS, JWT_KEY, HOST } = process.env;
const PORT = process.env.PORT || default_port;

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

    this.telegram = new TelegramBot();

    this._fnEnvironment = {};
    this._EnvFuntionNames;

    this._cacheEndpoint = new Map();
    this._cacheURLResponse = new Map();
    //    this._wsClients = {};

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

    /*
    this.fastify.websocket({
      async upgrade(req, stream) {
        if (stream && stream.end) {
          console.log('Cliente se ha desconectado');
        } else {
          // El cliente se ha conectado
          stream.on('message', (message) => {
            // Maneja el mensaje del cliente
          });
        }
      },
    });
    */

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
          // TODO: Analizar si es conveniente cargar todos los endpoints
          await this._loadEndpointsByAPPToCache(request_path_params.app);
        } else if (!this._cacheEndpoint.has(path_endpoint_method)) {
          // Carga solo el endpoint que no está en cache
          await this._loadEndpointsByAPPToCache(
            request_path_params.app,
            path_endpoint_method
          );
        }

        //
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
    });

    // Hook para capturar cuando llega la petición
    this.fastify.addHook("onRequest", async (request, reply) => {
      request.startTime = process.hrtime(); // Capturamos el tiempo de inicio usando `process.hrtime()`
    });

    this.fastify.addHook("onResponse", async (request, reply) => {
      //  console.log('\n\n\n', request.openfusionapi);
      const diff = process.hrtime(request.startTime); // Calculamos la diferencia de tiempo
      const timeTaken = diff[0] * 1e3 + diff[1] * 1e-6; // Convertimos a milisegundos

      // reply.header('X-Response-Time', `${timeTaken.toFixed(2)}ms`); // Opcional: Agregarlo como un header en la respuesta

      this.fastify.log.info(`Request took ${timeTaken.toFixed(2)} ms`);

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

        // Setea la cache para futuros usos
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
              "\n\nSe elimina la cache de " +
                request.openfusionapi.handler.url +
                " luego de " +
                request.openfusionapi.handler.params.cache_time * 1000 +
                " segundos."
            );
          }
        }, request.openfusionapi.handler.params.cache_time * 1000);
      }
    });

    this.fastify.get("/ws/*", { websocket: true }, (connection, req) => {
      // Todos los clientes deben estar registrados para poder hacer broadcast o desconectarlos masivamente
      // Crea un idclient para poder enviar un mensaje solo para un socket especifico
      try {
        connection.socket.openfusionapi = req.openfusionapi
          ? req.openfusionapi
          : {};

        connection.socket.openfusionapi.idclient = getUUID();
      } catch (error) {
        console.log(error);
      }

      /*
      if (!this._wsClients[req.url]) {
        this._wsClients[req.url] = [];
      }

      this._wsClients[req.url].push(connection.socket);
*/

      connection.socket.on("open", (message) => {
        console.log("Abre");
      });
      connection.socket.on("close", (message) => {
        console.log("Cierra");
      });

      connection.socket.on("message", (message) => {
        // TODO: Validar acceso en cada mensaje
        // TODO: Validar si el usuario solo puede recibir mensajes
        // TODO: Validar si los usuarios pueden enviar un mensaje broadcast
        // TODO: Habilitar que se puededa realizar comunicación uno a uno entre clientes
        // TODO: Tomar en cuenta que si el endpoint se lo deshabilita inmediatamente se debe desconectar a todos los clientes y no permitir la reconexion

        // message.toString() === 'hi from client'
        // console.log(this.fastify.websocketServer.clients);
        //connection.socket.send("hi from server: " + message.toString());

        // Broadcast
        // TODO: Esto no me parece que se optimo porque hay que recorrer todos los clientes en busca de los que corresponden a ese path
        this.fastify.websocketServer.clients.forEach((client_ws) => {
          try {
            if (
              client_ws.openfusionapi.handler.url ==
                connection.socket.openfusionapi.handler.url &&
              client_ws.openfusionapi.idclient !=
                connection.socket.openfusionapi.idclient
            ) {
              //client_ws.send("Broadcast: " + message.toString());
              // TODO: Verificar si el mensaje va dirigido a un idcliente en particular o es para todos
              let msgObj = JSON.parse(message.toString());

              if (
                msgObj.recipients &&
                Array.isArray(msgObj.recipients) &&
                msgObj.recipients.find(
                  (recip) => recip == connection.socket.openfusionapi.idclient
                )
              ) {
                // Envia el mensaje solo a los remitentes que están en la lista
                client_ws.send(JSON.stringify(msgObj.payload));
              } else if (msgObj) {
                // Envia a todos los remitentes siempre y cuando el msgObj sea un objeto json
                client_ws.send(JSON.stringify(msgObj.payload));
              }
            }
          } catch (error) {
            // Devuelve un mensaje al cliente que originó el mensaje
            connection.socket.send(error);
          }
        });
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

              // TODO: Revisar el entorno no solo la app

              setTimeout(() => {
                // Espera 15 segundos para borrar la cache de las funciones del endpoint

                request.body.data.db.row.forEach((item) => {
                  if (item) {
                    this._deleteEndpointsByAppName(item.app);
                  }
                });
              }, 15000);

              /*
                request.body.data.db.row.forEach((row) => {
                  if (row) {
                    this._deleteEndpointsByAppName(row.app);
                  }
                });
                */
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
      let server_data = {};

      if (
        handlerEndpoint.params &&
        handlerEndpoint.params.app &&
        handlerEndpoint.params.app == "system"
      ) {
        server_data.env_function_names = this._EnvFuntionNames;
        server_data.cache_url_response = this._cacheURLResponse;
        server_data.telegram = this.telegram;
      }

      if (
        handlerEndpoint.params &&
        handlerEndpoint.params.cache_time &&
        handlerEndpoint.params.cache_time > 0
      ) {
        //        console.log("----- CACHE ------");

        let hash_request = md5({
          body: request.body,
          query: request.query,
          url: handlerEndpoint.url,
        });

        //let data_cache = this._cacheResponse.get(hash_request);
        let data_cache = this._cacheURLResponse.get(handlerEndpoint.url);

        if (data_cache && data_cache[hash_request]) {
          // Si se obtiene desde caché, se agrega el header 'X-Cache: HIT'
          reply.header("X-Cache", "HIT");

          // Envia los datos que están en cache
          reply.code(200).send(data_cache[hash_request]);
        } else {
          // Agregar el header 'X-Cache: MISS' si se obtiene un nuevo resultado
          reply.header("X-Cache", "MISS");

          reply.openfusionapi.lastResponse = {
            hash_request: hash_request,
            data: undefined,
          };

          /*
          server_data.app_functions = this._getFunctions(
            handlerEndpoint.params.app,
            handlerEndpoint.params.environment
          );
          */

          await runHandler(request, reply, handlerEndpoint.params, server_data);
        }
      } else {
        /*
        server_data.app_functions = this._getFunctions(
          handlerEndpoint.params.app,
          handlerEndpoint.params.environment
        );
        */

        await runHandler(request, reply, handlerEndpoint.params, server_data);
      }
    });

    const host = HOST || "localhost";

    console.log(
      `Listen on PORT ${PORT} and HOST ${host}`,
      __dirname,
      PORT,
      PATH_APP_FUNCTIONS,
      JWT_KEY,
      HOST
    );

    this.telegram.launch();

    await this.fastify.listen({ port: PORT, host: host });
  }

  xxx_checkCTRLAccessEndpoint(user, app) {
    // Recorrer las propiedades del objeto user
    if (user && app) {
      if (user.username == "superuser" && user.enabled) {
        return true;
      } else {
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
      handler.params.environment
        ? true
        : false;

    if (check) {
      let user = data_aut.Bearer.data;

      if (user.username == "superuser" && user.enabled) {
        return true;
      } else if (handler.params.app == "system" && !user.ctrl.as_admin) {
        return false;
      } else if (
        handler.params.ctrl &&
        handler.params.ctrl.users &&
        Array.isArray(handler.params.ctrl.users)
      ) {
        return handler.params.ctrl.users.includes(user.iduser);
      }
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

    let data_aut = getUserPasswordTokenFromRequest(request);

    if (handler.params.access > 0) {
      //
      if (handler.params.app == "system") {
        // Las APIs de system solo se pueden acceder con token de usuario
        // TODO: Validar los casos cuando no son admin pero si tiene las atribuciones para system
        if (this._check_auth_Bearer(handler, data_aut)) {
          request.openfusionapi.user = data_aut.Bearer.data;
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

  /*
  async _functions(
    req,
     res
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
  */

  /*
  _getNameFunctions(appName, environment) {
    let f = this._getFunctions(appName, environment);
    if (f) {
      return Object.keys(f);
    }

    return [];
  }
*/
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
          this._appendAppFunction("public", "prd", fName, fn);
        }
      }
    }
  }

  _deleteEndpointsByAppName(app_name) {
    let list_endpoints = Array.from(this._cacheEndpoint.keys());
    list_endpoints.forEach((lep) => {
      if (lep.includes("/api/" + app_name) || lep.includes("/ws/" + app_name)) {
        //  console.log("\n\n _deleteEndpointsByAppName = ", app_name, lep);
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
    //console.log(appname, environment, functionName);
    if (functionName.startsWith("fn")) {
      // Crea el environment vacío si no existe
      if (!this._fnEnvironment[environment]) {
        this._fnEnvironment[environment] = {};
      }

      if (!this._fnEnvironment[environment][appname]) {
        this._fnEnvironment[environment][appname] = {};
      }

      this._fnEnvironment[environment][appname][functionName] = fn;

      // Se asigna los nombres de las funciones a la lista de nombres
      if (!this._EnvFuntionNames) {
        this._EnvFuntionNames = {};
      }

      if (!this._EnvFuntionNames[environment]) {
        this._EnvFuntionNames[environment] = {};
      }

      if (!this._EnvFuntionNames[environment][appname]) {
        this._EnvFuntionNames[environment][appname] = [];
      }

      this._EnvFuntionNames[environment][appname].push(functionName);

      /*
      if (appname == "public") {
        // Debe agregarse a todas las app de este entorno, si la función ya existe será reemplazada por la publica
        console.log("ddd");

        for (const _env_ in this._fnEnvironment) {
          for (const _app_ in this._fnEnvironment[_env_]) {
            // Agrega la función a todas las apps de los entornos
            if (!this._fnEnvironment[_env_][_app_]) {
              this._fnEnvironment[_env_][_app_] = {};
            }

            this._fnEnvironment[_env_][_app_][functionName] = fn;
          }
        }
      } else {
        // No es público
        if (!this._fnEnvironment[environment][appname]) {
          this._fnEnvironment[environment][appname] = {};
        }

        this._fnEnvironment[environment][appname][functionName] = fn;
      }
      */

      //this._EnvFuntionNames

      /*
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
      */
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

    if (this._fnEnvironment[environment]) {
      d = this._fnEnvironment[environment][appName];
      p = this._fnEnvironment[environment]["public"];
    }

    console.log(d, p);
    /*
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
    */
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
        } else if (returnHandler.params.handler == "FUNCTION") {
          // Console obtiene la función
          if (
            this._fnEnvironment[returnHandler.params.environment] &&
            this._fnEnvironment[returnHandler.params.environment][
              returnHandler.params.app
            ] &&
            this._fnEnvironment[returnHandler.params.environment][
              returnHandler.params.app
            ][returnHandler.params.code]
          ) {
            // Busca en la lista de funciones de entorno para asignarla
            returnHandler.params.Fn =
              this._fnEnvironment[returnHandler.params.environment][
                returnHandler.params.app
              ][returnHandler.params.code];
          } else if (
            this._fnEnvironment[returnHandler.params.environment] &&
            this._fnEnvironment[returnHandler.params.environment]["public"] &&
            this._fnEnvironment[returnHandler.params.environment]["public"][
              returnHandler.params.code
            ]
          ) {
            // Si no existe la función dentro de la app, busca en la lista de la aplicaión publica
            returnHandler.params.Fn =
              this._fnEnvironment[returnHandler.params.environment]["public"][
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
