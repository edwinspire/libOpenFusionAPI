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
import { TelegramBot } from "./server/telegram/telegram.js";

import { TasksInterval } from "./timer/tasks.js";
//import { version } from "./server/version.js";

import dbAPIs from "./db/sequelize.js";
import { defaultApps } from "./db/app.js";
import { defaultUser, login } from "./db/user.js";
import { defaultMethods } from "./db/method.js";
import { defaultHandlers } from "./db/handler.js";
import {
  prefixTableName,
  User,
  Method,
  Handler,
  Application,
  AppVars,
  Endpoint as EndpointBBDD,
  LogEntry,
  IntervalTask,
  tblDemo,
} from "./db/models.js";
import { runHandler } from "./handler/handler.js";
import { fnPublic, fnSystem } from "./server/functions/index.js";
import { OpenFusionWebsocketClient } from "./server/websocket_client.js";
import {
  getUserPasswordTokenFromRequest,
  getIPFromRequest,
  getFunctionsFiles,
  getUUID,
  CreateOpenFusionAPIToken,
} from "./server/utils.js";

import { validateSchemaMessageWebSocket } from "./server/schemas/index.js";

import {
  //key_endpoint_method,
  struct_api_path,
  get_url_params,
  urlSystemPath,
  default_port,
  internal_url_ws,
  WebSocketValidateFormatChannelName,
} from "./server/utils_path.js";

import fs from "fs";
import path from "path";
import { getSystemInfoDynamic } from "./server/systeminformation.js";

const DEFAULT_MAX_FILE_SIZE_UPLOAD = 100 * 1024 * 1024; // Default 100 MB
const {
  PATH_APP_FUNCTIONS,
  JWT_KEY,
  HOST,
  TELEGRAM_SERVER_CHATID,
  TELEGRAM_SERVER_MSG_THREAD_ID,
  MAX_FILE_SIZE_UPLOAD, // Default 100 MB
} = process.env;
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
    this.endpoints = new Endpoint();
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
      {}
    );

    this.telegram = new TelegramBot();

    this.TasksInterval = new TasksInterval();

    this.fastify = Fastify({
      logger: false,
      bodyLimit:
        parseInt(MAX_FILE_SIZE_UPLOAD, 10) * 1024 * 1024 ||
        DEFAULT_MAX_FILE_SIZE_UPLOAD, // For multipart forms, the max file size in bytes
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
        request?.body?.data?.environment
      );
    } else if (
      request?.body?.model == prefixTableName("endpoint") &&
      request?.body?.action === "afterUpsert"
    ) {
      // Cuando hay cambios en un endpoint
      this.endpoints.deleteEndpointByidEndpoint(
        request?.body?.data?.idendpoint,
        request?.body?.data?.environment
      );
    }
  }

  async _build() {
    await this.fastify.register(formbody, {
      bodyLimit:
        parseInt(MAX_FILE_SIZE_UPLOAD, 10) * 1024 * 1024 ||
        DEFAULT_MAX_FILE_SIZE_UPLOAD, // For multipart forms, the max file size in bytes
    });
    await this.fastify.register(multipart, {
      //attachFieldsToBody: "keyValues", // Consume memoria porque los archivos se guardan en memoria, los archivos se guardan en un buffer pero se pierde los detalles del archivo.
      attachFieldsToBody: true, // Se guardan los archivos en memoria pero de forma detallada, puede ser prblema con archivos grandes.
      limits: {
        //fieldNameSize: 100, // Max field name size in bytes
        //fieldSize: 100, // Max field value size in bytes
        //fields: 10, // Max number of non-file fields
        fileSize:
          parseInt(MAX_FILE_SIZE_UPLOAD, 10) * 1024 * 1024 ||
          DEFAULT_MAX_FILE_SIZE_UPLOAD, // For multipart forms, the max file size in bytes
        //files: 1, // Max number of file fields
        //headerPairs: 2000, // Max number of header key=>value pairs
        //parts: 1000, // For multipart forms, the max number of parts (fields + files)
      },
      /*
      async onFile(part) {
        // read buffer completo del archivo
        const buffer = await part.toBuffer();

        // adjuntar al body un objeto con todo:
        // filename, mimetype y buffer del archivo
        this.request.body[part.fieldname] = {
          filename: part.filename,
          mimetype: part.mimetype,
          buffer,
        };
      },
      */
      async onFile(part) {
        const buffer = await part.toBuffer();
/*
        if (!this.body[part.fieldname]) {
          this.body[part.fieldname] = [];
        }

        this.body[part.fieldname].push({
          filename: part.filename,
          mimetype: part.mimetype,
          buffer,
        });
*/

      },
    });

    this.fastify.register(cookie, {
      secret: JWT_KEY, // for cookies signature
      hook: "preValidation", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
      parseOptions: {}, // options for parsing cookies
    });

    await this.fastify.register(cors, {
      origin: "*",
      credentials: true, // 🚨 OBLIGATORIO para que el navegador envíe las cookies
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
      const user_agent = request.headers["user-agent"];

      if (!request.ws && (!user_agent || user_agent.length === 0)) {
        // Por seguridad no se permite request sin user-agent
        reply.code(403).send({ error: "Fail" });
        return;
      }

      let request_path_params = get_url_params(request.url, request.method);

      if (request_path_params && request_path_params.url_key) {
        let cache_endpoint = await this.endpoints.getEndpoint(
          request_path_params
        );

        //
        if (cache_endpoint && cache_endpoint.handler) {
          let handlerEndpoint = cache_endpoint.handler;

          if (handlerEndpoint?.params?.enabled) {
            request.openfusionapi = { handler: handlerEndpoint };
            // TODO:  Aqui deberí validar si las cedenciales son validas antes de consultar a la base de datos. es decir antes de hacer getEndpoint. Analizalo.
            await this._check_auth(handlerEndpoint, request, reply);
          } else {
            reply
              .code(410)
              .send({ message: "Endpoint unabled.", url: request.url });
          }
        } else {
          reply
            .code(404)
            .send({ error: "Endpoint Not Found", url: request.url });
        }
      }
    });

    // Hook para capturar cuando llega la petición
    this.fastify.addHook("onRequest", async (request, reply) => {
      request.startTime = process.hrtime(); // Capturamos el tiempo de inicio usando `process.hrtime()`
    });

    this.fastify.addHook("onResponse", async (request, reply) => {
      //  console.log('\n\n\n', request.openfusionapi);
      // TODO: verificar si hay problemas al omitir esta parte de codigo para este tipo de método
      if (request.method !== "OPTIONS") {
        const diff = process.hrtime(request.startTime); // Calculamos la diferencia de tiempo
        const timeTaken = Math.round(diff[0] * 1e3 + diff[1] * 1e-6); // Convertimos a milisegundos

        if (!reply.openfusionapi) {
          reply.openfusionapi = { lastResponse: { responseTime: timeTaken } };
        }

        if (!reply.openfusionapi.lastResponse) {
          reply.openfusionapi.lastResponse = { responseTime: timeTaken };
        }

        if (!reply.openfusionapi.lastResponse.responseTime) {
          reply.openfusionapi.lastResponse.responseTime = timeTaken;
        }

        this.endpoints.saveLog(request, reply);

        ///////////
        let handler_param = request?.openfusionapi?.handler?.params || {};
        if (handler_param?.idendpoint) {
          // Solo aqui debe guardar en cache la respuesta
          this.endpoints.setCache(handler_param?.url_key, request, reply);
        }
        handler_param.statusCode = reply.statusCode;
        this._emitEndpointEvent("request_completed", handler_param);
      }
    });

    this.fastify.get("/ws/*", { websocket: true }, (connection, req) => {
      // Todos los clientes deben estar registrados para poder hacer broadcast o desconectarlos masivamente
      // Crea un idclient para poder enviar un mensaje solo para un socket especifico
      try {
        connection.socket.openfusionapi = req.openfusionapi
          ? req.openfusionapi
          : {};

        //connection.socket.openfusionapi.idclient = getUUID();
      } catch (error) {
        console.log(error);
      }

      connection.socket.on("open", (message) => {
        //  console.log("Abre");
      });
      connection.socket.on("close", (message) => {
        //console.log("Cierra");
      });

      connection.socket.on("message", (message) => {
        // TODO: Validar acceso en cada mensaje
        // TODO: Validar si el usuario solo puede recibir mensajes
        // TODO: Validar si los usuarios pueden enviar un mensaje broadcast
        // TODO: Habilitar que se pueda realizar comunicación uno a uno entre clientes
        // TODO: Tomar en cuenta que si el endpoint se lo deshabilita inmediatamente se debe desconectar a todos los clientes y no permitir la reconexion

        // TODO: Crear canales a los cuales se puede subscribir un cliente para recibir mensajes solo de ese canal, esto facilita la comunicación entre clientes sin necesidad de hacer broadcast a todos los clientes conectados
        let msgString = message.toString();
        let msgObj;
        try {
          msgObj = JSON.parse(msgString);
          let validate_channel = WebSocketValidateFormatChannelName(
            msgObj.channel
          );
          if (validate_channel.valid) {
            let isValid = validateSchemaMessageWebSocket(msgObj);

            if (isValid) {
              //console.log("✅ Válido");

              // valida si el mensaje es para subscribir a un canal
              if (msgObj.channel == "/subscribe") {
                if (msgObj.payload.channel) {
                  let validate_channel_subscribe =
                    WebSocketValidateFormatChannelName(msgObj.payload.channel);
                  if (!validate_channel_subscribe.valid) {
                    connection.socket.send(
                      JSON.stringify({
                        subscribed: false,
                        channel: msgObj.payload.channel,
                        error: validate_channel_subscribe.error,
                      })
                    );
                  } else {
                    connection.socket.openfusionapi.channel =
                      msgObj.payload.channel;
                    connection.socket.openfusionapi.idclient = getUUID();
                    connection.socket.send(
                      JSON.stringify({
                        subscribed: true,
                        channel: msgObj.payload.channel,
                        message: `Subscribed to channel ${msgObj.payload.channel}`,
                      })
                    );
                  }
                } else {
                  connection.socket.send(
                    JSON.stringify({
                      subscribed: false,
                      channel: msgObj.payload.channel,
                      message: `Channel name is required to subscribe`,
                    })
                  );
                }
              } else if (
                connection.socket.openfusionapi.idclient &&
                msgObj.channel == "/ping"
              ) {
                connection.socket.send(
                  JSON.stringify({
                    channel: "/pong",
                    payload: {},
                  })
                );
              } else if (connection.socket.openfusionapi.idclient) {
                // Broadcast
                // TODO: Esto no me parece que se optimo porque hay que recorrer todos los clientes en busca de los que corresponden a ese path
                // TODO: Revisar un mecanismo para limitar que un cliente puede enviar mensajes y esté limitado solo a leer mensajes
                this.fastify.websocketServer.clients.forEach((client_ws) => {
                  // console.log("Envia mensaje a los clientes conectados");
                  try {
                    if (
                      client_ws.openfusionapi.handler.params.idendpoint ==
                        connection.socket.openfusionapi.handler.params
                          .idendpoint &&
                      client_ws.openfusionapi.idclient !=
                        connection.socket.openfusionapi.idclient &&
                      connection.socket.openfusionapi.channel ==
                        client_ws.openfusionapi.channel
                    ) {
                      // Envia el mensaje a los clientes conectados en el mismo endpoint y canal, funciona modo broadcast
                      // TODO: Ver la forma de que se puede enviar el mensaje solo a un cliente en especifico, puede ser que se cree un canal con un id especifico para comunicacion entre dos clientes, como una sala privada
                      client_ws.send(JSON.stringify(msgObj.payload));
                    }
                  } catch (error) {
                    // Devuelve un mensaje al cliente que originó el mensaje
                    connection.socket.send(
                      JSON.stringify({ error: error.message })
                    );
                  }
                });
              } else {
                connection.socket.send(
                  JSON.stringify({ error: "Invalid client. Bye." })
                );
                connection.socket.close();
              }
            } else {
              //    console.log("❌ Inválido. Errores detectados:");
              // ¡Aquí está la magia! `validate.errors` es un array con los detalles.
              connection.socket.send(
                JSON.stringify({
                  error: validateSchemaMessageWebSocket.errors,
                })
              );
              connection.socket.close();
            }
          } else {
            // Devuelve un mensaje al cliente que originó el mensaje
            connection.socket.send(
              JSON.stringify({
                error: "Invalid channel name format",
                message: msgString,
              })
            );
            connection.socket.close();
          }
        } catch (error) {
          connection.socket.send(
            JSON.stringify({ error: error.message, message: msgString })
          );
          connection.socket.close();
        }
      });
    });

    // Declare a route
    this.fastify.all(struct_api_path, async (request, reply) => {
      let handlerEndpoint = request.openfusionapi.handler;
      request.openfusionapi.ip_request = getIPFromRequest(request);

      if (!reply.openfusionapi) {
        reply.openfusionapi = {};
      }

      if (handlerEndpoint.params.handler == "JS") {
        reply.openfusionapi.telegram = this.telegram;
        reply.openfusionapi.server = this;
      }

      let server_data = {};

      reply.openfusionapi.lastResponse = {
        hash_request: "0A0",
        data: undefined,
      };

      if (
        handlerEndpoint.params &&
        handlerEndpoint.params.app &&
        handlerEndpoint.params.app == "system"
      ) {
        //server_data.telegram = this.telegram;
        if (handlerEndpoint.params.handler == "FUNCTION") {
          reply.openfusionapi.telegram = this.telegram;
          server_data.endpoint_class = this.endpoints;
        }
      }

      this._emitEndpointEvent("request_start", {
        idendpoint: handlerEndpoint.params?.idendpoint,
        idapp: handlerEndpoint.params?.idapp,
        url: request.url,
        method: request.method,
        app: handlerEndpoint.params?.app,
        environment: handlerEndpoint.params?.environment,
        endpoint: handlerEndpoint.params?.url_method,
        //responseTime: timeTaken,
        //statusCode: reply.statusCode,
      });

      if (
        handlerEndpoint.params &&
        handlerEndpoint.params.cache_time &&
        handlerEndpoint.params.cache_time > 0
      ) {
        let hash_request = this.endpoints.hash_request(
          request,
          handlerEndpoint.params.url_key
        );

        reply.openfusionapi.lastResponse.hash_request = hash_request;
        request.openfusionapi.hash_request = hash_request;

        let data_cache = this.endpoints.cache.getPayload({
          app: handlerEndpoint.params.app,
          resource: handlerEndpoint.params.resource,
          env: handlerEndpoint.params.environment,
          method: request.method,
          hash: hash_request,
        });

        if (data_cache && data_cache.data) {
          // Si se obtiene desde caché, se agrega el header 'X-Cache: HIT'
          reply.header("X-Cache", "HIT");

          reply.openfusionapi.lastResponse[hash_request] = data_cache.data;

          // Envia los datos que están en cache
          reply.code(200).send(data_cache.data);
        } else {
          // Agregar el header 'X-Cache: MISS' si se obtiene un nuevo resultado
          reply.header("X-Cache", "MISS");

          await runHandler(request, reply, handlerEndpoint.params, server_data);
        }
      } else {
        await runHandler(request, reply, handlerEndpoint.params, server_data);
      }
    });

    this.SERVER_DATE_START = Date.now();

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
    this.websocketClientEndpoint.on("open", () => {
      this.websocketClientEndpoint.subscribe("/server/events");
    });

    this.TasksInterval.run();
    if (TELEGRAM_SERVER_CHATID) {
      try {
        let data = {
          chatId: TELEGRAM_SERVER_CHATID,
          message: "*OPEN FUSION API*\nThe server has started",
          extra: {
            message_thread_id: TELEGRAM_SERVER_MSG_THREAD_ID,
            parse_mode: "MarkdownV2",
          },
        };

        await this.telegram.sendMessage(data.chatId, data.message, data.extra);
      } catch (error) {
        console.error(error);
      }
    }

    setInterval(async () => {
      if (this.fastify.websocketServer.clients.size > 1) {
        this._emitEndpointEvent(
          "system_information",
          await getSystemInfoDynamic()
        );

        for (const client_ws of this.fastify.websocketServer.clients) {
          //  console.log("Procesando:", valor);

          if (
            client_ws.openfusionapi?.channel == "/server/events" &&
            client_ws?.openfusionapi?.handler?.params?.url_key?.startsWith(
              urlSystemPath.Websocket.EventServer
            )
          ) {
            //   console.log("---");
            this._emitEndpointEvent(
              "system_information",
              await getSystemInfoDynamic()
            );
            return;
          }

          console.log("Continuando con el siguiente valor...");
        }
      }
    }, 3000);
  }
  _check_auth_Bearer(handler, data_aut) {
    // En este metodo se debe validar de que clase de usuario es, si es del sistema o si es usuario externo
    let check = false;

    if (data_aut?.Bearer?.data?.api && handler.params) {
      check = true; // De momento usuarios de API tiene acceso libre
    } else if (data_aut?.Bearer?.data?.admin && handler.params) {
      let user = data_aut.Bearer.data.admin;

      if (user.username == "superuser" && user.enabled) {
        check = true;
      } else if (handler.params.app == "system" && user.ctrl.as_admin) {
        check = true;
      } else if (handler.params.app == "system" && !user.ctrl.as_admin) {
        check = false;
      }
    }

    return check;
  }

  async _check_auth_Basic(handler, data_aut) {
    let user = await login(data_aut.Basic.username, data_aut.Basic.password);

    if (user.login) {
      // Simulamos un Bearer para usar el mismo método
      data_aut.Bearer.data = user;
      return this._check_auth_Bearer(handler, data_aut) ? data_user : null;
    } else {
      return false;
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
        } else {
          reply.code(401).send({
            error: "The System API requires a valid Token.",
            url: request.url,
          });
        }
      } else {
        //
        // TODO: Implementar correctamente el control de acceso
        switch (handler.params.access) {
          case 1: // Basic
            // Aqui el código para validar usuario y clave de API
            // Este paso puede ser pesado ya que se debe consultar a la base de datos. Es recomendable usarlo en lo minimo
            if (data_aut.Basic.username && data_aut.Basic.password) {
              let checkbasic = await this._check_auth_Basic(handler, data_aut);
              if (checkbasic) {
                request.openfusionapi.user = data_aut.Bearer.checkbasic;
              }
            } else {
              reply.code(401).send({
                error: "The API requires a valid Username y Password",
                url: request.url,
              });
            }

            break;

          case 3:
            if (this._check_auth_Bearer(handler, data_aut)) {
              request.openfusionapi.user = data_aut.Bearer.data;
            } else if (data_aut.Basic.username && data_aut.Basic.password) {
              let checkbasic = await this._check_auth_Basic(handler, data_aut);
              if (checkbasic) {
                request.openfusionapi.user = data_aut.Bearer.checkbasic;
              }
            } else {
              reply.code(401).send({
                error: "The API requires a Token or Username and Password",
                url: request.url,
              });
            }

            break;
          default:
            // Por default use BEARER
            if (this._check_auth_Bearer(handler, data_aut)) {
              request.openfusionapi.user = data_aut.Bearer.data;
            } else {
              reply.code(401).send({
                error: "The API requires a valid Token.",
                url: request.url,
              });
            }
            break;
        }
      }
    }
  }

  _addFunctions() {
    if (fnSystem) {
      if (fnSystem.fn_system_prd) {
        const entries = Object.entries(fnSystem.fn_system_prd);
        for (let [fName, fn] of entries) {
          // console.log(":::::.> fnSystem >> ", fName, fn);
          this._appendAppFunction("system", "prd", fName, fn);
        }
      }

      if (fnSystem.fn_system_qa) {
        const entries = Object.entries(fnSystem.fn_system_qa);
        for (let [fName, fn] of entries) {
          // console.log(":::::.> fnSystem >> ", fName, fn);
          this._appendAppFunction("system", "qa", fName, fn);
        }
      }

      if (fnSystem.fn_system_dev) {
        const entries = Object.entries(fnSystem.fn_system_dev);
        for (let [fName, fn] of entries) {
          // console.log(":::::.> fnSystem >> ", fName, fn);
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
    this.endpoints.deleteApp(app_name);
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
    //console.log(`::> Add Function ${functionName} on ${environment}`);
    if (functionName.startsWith("fn")) {
      // Crea el environment vacío si no existe
      if (!this.endpoints.fnLocal[environment]) {
        this.endpoints.fnLocal[environment] = {};
      }

      if (!this.endpoints.fnLocal[environment][appname]) {
        this.endpoints.fnLocal[environment][appname] = {};
      }

      this.endpoints.fnLocal[environment][appname][functionName] = fn;
      // this._fnLocalNames = this.endpoints.getFnNames();
    } else {
      throw `The function must start with "fn". appName: ${appname} - functionName: ${functionName}.`;
    }
  }

  /**
   * @param {string} appName
   * @param {string} [environment]
   */
  _getFunctions(appName, environment) {
    let d;
    let p;

    if (this.endpoints.fnLocal[environment]) {
      d = this.endpoints.fnLocal[environment][appName];
      p = this.endpoints.fnLocal[environment]["public"];
    }

    //    console.log(d, p);

    // Si hay funciones publicas con el mismo nombre que la función de aplicación, la funcion de aplicación sobreescribe a la publica
    return { ...p, ...d };
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

      try {
        await defaultHandlers();
      } catch (error) {
        console.log(error);
      }

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
