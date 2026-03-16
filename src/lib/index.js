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
import Endpoint from "./server/endpoint/index.js";

import { BackgroundTaskManager } from "./server/background_tasks.js";
import { getAllBots } from "./db/bot.js";
import { TasksInterval } from "./timer/tasks.js";
import { defaultApiClient } from "./db/apiclient.js";

import dbAPIs from "./db/sequelize.js";
import { defaultApps, getApplicationsTreeByFilters, getApplicationTreeByFilters } from "./db/app.js";
import { createLog } from "./db/log.js";
import { createFunctionVM } from "./server/createFunctionVM.js";
import { CreateMCPHandler } from "./server/endpoint/handlerBuild/mcp.js";
import { defaultUser, login } from "./db/user.js";
import { defaultMethods } from "./db/method.js";
//import { defaultHandlers } from "./db/handler.js";
import {
  prefixTableName,
  User,
  Method,
  Application,
  AppVars,
  Endpoint as EndpointBBDD,
  LogEntry,
  IntervalTask,
  tblDemo,
  modelHooks
} from "./db/models.js";
import { runHandler } from "./handler/handler.js";
import { fnPublic, fnSystem } from "./server/functions/index.js";
import { OpenFusionWebsocketClient } from "./server/websocket_client.js";
import { WebSocketManager } from "./server/websocket_manager.js";

import {
  getIPFromRequest,
  getFunctionsFiles,
  getUUID,
  getAppVarsObject,
} from "./server/utils.js";
import { CreateOpenFusionAPIToken } from "./server/auth.js";
import { AuthService } from "./server/auth_service.js";

import { validateSchemaMessageWebSocket } from "./server/schemas/index.js";

import {
  //key_endpoint_method,
  struct_api_path,
  get_url_params,
  urlSystemPath,
  default_port,
  internal_url_ws,
  WebSocketValidateFormatChannelName, url_key
} from "./server/utils_path.js";

import fs from "fs";
import path from "path";
import { getSystemInfoDynamic } from "./server/systeminformation.js";
import { registerCorePlugins } from "./server/runtime/registerCorePlugins.js";
import { registerRequestLifecycle } from "./server/runtime/registerRequestLifecycle.js";
import { EndpointRuntimeService } from "./server/runtime/EndpointRuntimeService.js";
import { FunctionRegistryService } from "./server/runtime/FunctionRegistryService.js";
import { defaultAuthPolicy, defaultCorsPolicy } from "./server/runtime/policies.js";

const DEFAULT_MAX_FILE_SIZE_UPLOAD = 100 * 1024 * 1024; // Default 100 MB
const {
  PATH_APP_FUNCTIONS,
  JWT_KEY,
  HOST,
  MAX_FILE_SIZE_UPLOAD, // Default 100 MB
} = process.env;

if (!JWT_KEY) {
  console.warn(
    "WARNING: JWT_KEY is not defined. Cookies and Tokens may not be secure.",
  );
}

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

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// TODO: Poner en el header un ID request para crear una traza desde el origen de los request ya que hay endpoints que son llamados desde el localhost y se hace dificil saber quien originó la primera solicitud.
export default class ServerAPI extends EventEmitter {
  constructor({ buildDB = false } = {}) {
    super();
    this.endpoints = new Endpoint({
      dbFetcher: getApplicationTreeByFilters,
      vmFactory: createFunctionVM,
      mcpBuilder: CreateMCPHandler,
      createLog: createLog
    });
    this.functionRegistry = new FunctionRegistryService({
      endpoints: this.endpoints,
      dirFn: dir_fn,
      fs,
      getFunctionsFiles,
    });
    this.endpoints.on("log", (data) => {
      this.TasksInterval.pushLog(data);
      //      this.websocketClientEndpoint.send({ payload: data });
    });

    this.endpoints.cache.on("added", (data) => {
      this._emitEndpointEvent("cache_set", data);
    });

    this.endpoints.cache.on("expired", (data) => {
      this._emitEndpointEvent("cache_released", data);
    });

    this.SERVER_DATE_START;

    this.websocketClientEndpoint = new OpenFusionWebsocketClient(
      internal_url_ws(urlSystemPath.Websocket.EventServer),
      {},
      { autoConnect: false }, // connect only after fastify.listen() resolves
    );

    this.TasksInterval = new TasksInterval();

    modelHooks.on("hook", async (data) => {

      // Borrar la cache de funciones de la app cuando se actualiza la app
      if (
        data.model == prefixTableName("application") &&
        data.action === "afterUpsert"
      ) {
        // Cuando se modifica una app

        // TODO: Revisar el entorno no solo la app
        if (data.data?.app) {
          setTimeout(() => {
            // Espera 5 segundos para borrar la cache de las funciones del endpoint
            this._deleteEndpointsByAppName(data.data?.app);
          }, 5000);
        }
      } else if (
        data.model == prefixTableName("appvars") &&
        (data.action === "afterUpsert" ||
          data.action === "afterDestroy")
      ) {
        // Cuando se modifica / borra una variable de aplicación
        this.endpoints.deleteEndpointsByIdApp(
          data.data?.idapp,
          data.data?.environment,
        );
      } else if (
        data.model == prefixTableName("endpoint") &&
        data.action === "afterUpsert"
      ) {
        // Cuando hay cambios en un endpoint
        this.endpoints.deleteEndpointByidEndpoint(
          data?.data?.idendpoint,
          data?.data?.environment,
        );
      }
    });

    this.maxBodyBytes =
      (parseInt(MAX_FILE_SIZE_UPLOAD, 10) * 1024 * 1024) ||
      DEFAULT_MAX_FILE_SIZE_UPLOAD;

    this.fastify = Fastify({
      logger: false,
      bodyLimit: this.maxBodyBytes,
    });

    this._build();
  }

  async checkwebHookDB(request) {
    // Borrar la cache de funciones de la app cuando se actualiza la app
    if (
      request?.body?.model == prefixTableName("application") &&
      request?.body?.action === "afterUpsert"
    ) {
      // Cuando se modifica una app

      // TODO: Revisar el entorno no solo la app
      if (request?.body?.data?.app) {
        setTimeout(() => {
          // Espera 5 segundos para borrar la cache de las funciones del endpoint
          this._deleteEndpointsByAppName(request?.body?.data?.app);
        }, 5000);
      }
    } else if (
      request?.body?.model == prefixTableName("appvars") &&
      (request?.body?.action === "afterUpsert" ||
        request?.body?.action === "afterDestroy")
    ) {
      // Cuando se modifica / borra una variable de aplicación
      this.endpoints.deleteEndpointsByIdApp(
        request?.body?.data?.idapp,
        request?.body?.data?.environment,
      );
    } else if (
      request?.body?.model == prefixTableName("endpoint") &&
      request?.body?.action === "afterUpsert"
    ) {
      // Cuando hay cambios en un endpoint
      this.endpoints.deleteEndpointByidEndpoint(
        request?.body?.data?.idendpoint,
        request?.body?.data?.environment,
      );
    }
  }

  async _build() {
    const www_dir = "www";
    const rutaDirectorio = path.join(process.cwd(), www_dir);

    await registerCorePlugins({
      fastify: this.fastify,
      maxBodyBytes: this.maxBodyBytes,
      jwtKey: JWT_KEY,
      wwwDirPath: rutaDirectorio,
      plugins: {
        formbody,
        multipart,
        cookie,
        cors,
        websocket,
        fastifyStatic,
        fs,
      },
      corsConfig: {
        // TODO: Replace wildcard origin with an explicit allowlist when credentials=true.
        // Browser credentialed requests with origin='*' are not CORS-compliant.
        origin: "*",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
      corsPolicy: defaultCorsPolicy,
    });

    this.webSocketManager = new WebSocketManager(this.fastify);

    this.buildDB();
    this.loadFunctionFiles();
    this._addFunctions();

    const endpointRuntimeService = new EndpointRuntimeService({
      serverApi: this,
      endpoints: this.endpoints,
      getUUID,
      getURLParams: get_url_params,
      authService: AuthService,
      runHandler,
      getIPFromRequest,
      emitEndpointEvent: (event_name, data) => {
        this._emitEndpointEvent(event_name, data);
      },
      authPolicy: defaultAuthPolicy,
    });

    registerRequestLifecycle({
      fastify: this.fastify,
      structApiPath: struct_api_path,
      endpointRuntimeService,
    });

    this.webSocketManager.registerRoutes();

    this.SERVER_DATE_START = Date.now();

    const host = HOST || "localhost";

    console.log(
      `Listen on PORT ${PORT} and HOST ${host}`,
      __dirname,
      PORT,
      PATH_APP_FUNCTIONS,
      JWT_KEY,
      HOST,
    );

    await this.fastify.listen({ port: PORT, host: host });

    this._runOnReady();
  }

  _emitEndpointEvent(event_name, data) {
    this.websocketClientEndpoint.send({
      channel: "/server/events",
      payload: {
        event_name: event_name,
        timestamp: new Date(),
        data: data,
      },
    });
  }

  async _runOnReady() {
    // Fastify is now listening — safe to open the internal WebSocket connection.
    this.websocketClientEndpoint.on("open", () => {
      this.websocketClientEndpoint.subscribe("/server/events");
    });
    this.websocketClientEndpoint.connect();

    this.TasksInterval.run();

    const backgroundTasks = new BackgroundTaskManager(this);
    backgroundTasks.startAll();
  }


  _addFunctions() {
    this.functionRegistry.addBuiltInFunctions(fnSystem, fnPublic);
  }

  _deleteEndpointsByAppName(app_name) {
    this.endpoints.deleteApp(app_name);
  }

  loadFunctionFiles() {
    this.functionRegistry.loadFunctionFiles();
  }

  /**
   * @param {string} filePath
   * @param {string} _app_name
   * @param {string} environment
   */
  async _appendFunctionsFiles(file_app, _app_name, environment) {
    return this.functionRegistry.appendFunctionsFile(
      file_app,
      _app_name,
      environment,
    );
  }

  _appendAppFunction(appname, environment, functionName, fn) {
    this.functionRegistry.appendAppFunction(appname, environment, functionName, fn);
  }

  /**
   * @param {string} appName
   * @param {string} [environment]
   */
  _getFunctions(appName, environment) {
    return this.functionRegistry.getFunctions(appName, environment);
  }

  /**
   * @param {boolean} buildDB
   */
  buildDB() {
    let buildDBEnv = process.env.BUILD_DB;
    let buildDB =
      buildDBEnv && buildDBEnv.toString().toUpperCase() == "TRUE"
        ? true
        : false;

    (async () => {
      if (buildDB) {
        console.log("Crea la base de datos");

        try {
          await dbAPIs.sync({ alter: true });
          console.log("Database created or updated successfully.");
        } catch (error) {
          // Con sqlite es posible que haya errores al recrear las tablas
          console.log(error);
        }
      }

      /*
      try {
        await defaultHandlers();
      } catch (error) {
        console.log(error);
      }
      */

      try {
        await defaultMethods();
      } catch (error) {
        console.log(error);
      }

      try {
        await defaultUser();
      } catch (error) {
        console.log(error);
      }

      try {
        await defaultApiClient();
      } catch (error) {
        console.log(error);
      }

      try {
        await defaultApps();
      } catch (error) {
        console.log(error);
      }

      // Crea un token para tener acceso a los endpoints protegidos
      CreateOpenFusionAPIToken();
    })();

    return true;
  }
}
