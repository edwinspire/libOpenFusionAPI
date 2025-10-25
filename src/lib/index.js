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
import Endpoint from "./server/endpoint.js";
import { TelegramBot } from "./server/telegram/telegram.js";

import { TasksInterval } from "./timer/tasks.js";
//import  {MCPServer, StreamableHTTPServerTransport}  from "./server/mcp/server.js";
import { version } from "./server/version.js";

import dbAPIs from "./db/sequelize.js";
import {
  defaultApps,
  //getAppByName,
  //  getAppWithEndpoints,
} from "./db/app.js";
//import { defaultEndpoints } from "./db/endpoint.js";
import { defaultUser, login } from "./db/user.js";
import { defaultMethods } from "./db/method.js";
import { defaultHandlers } from "./db/handler.js";
import {
  prefixTableName,
  User,
  Method,
  Handler,
  Application,
  ApplicationBackup,
  Endpoint as EndpointBBDD,
  LogEntry,
  IntervalTask,
  tblDemo,
} from "./db/models.js";
import { runHandler } from "./handler/handler.js";
// import { createFunction } from "./handler/jsFunction.js";
import { fnPublic, fnSystem } from "./server/functions/index.js";
import { OpenFusionWebsocketClient } from "./server/websocket_client.js";
import {
  checkToken,
  getUserPasswordTokenFromRequest,
  //websocketUnauthorized,
  getIPFromRequest,
  getFunctionsFiles,
  getUUID,
  //  webhookSchema,
} from "./server/utils.js";

import {
  schema_input_hooks,
  ajv,
  validateSchemaMessageWebSocket,
} from "./server/schemas/index.js";

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

//------------------------
const validate_schema_input_hooks = ajv.compile(schema_input_hooks);

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

    this.endpoints.on("cache_set", (data) => {
      this._emitEndpointEvent("cache_set", data);
    });

    this.endpoints.on("cache_released", (data) => {
      this._emitEndpointEvent("cache_released", data);
    });

    this.SERVER_DATE_START;

    this.websocketClientEndpoint = new OpenFusionWebsocketClient(
      internal_url_ws(urlSystemPath.Websocket.AppInfo),
      {}
    );

    this.telegram = new TelegramBot();
    //this._fnLocalNames;
    //this._cacheURLResponse = new Map();

    this.TasksInterval = new TasksInterval();
    //this.MCPServer = new MCPServer();

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
      //  console.log('XXXXXXXXXXXXXXXX>', request.body);

      // TODO: Revisar el entorno no solo la app
      if (request?.body?.data?.app) {
        setTimeout(() => {
          // Espera 5 segundos para borrar la cache de las funciones del endpoint
          this._deleteEndpointsByAppName(request?.body?.data?.app);
        }, 5000);
      }
    }

    /*
    const validated = webhookSchema.parse(request.body);

    if (validated) {
      // Borrar la cache de funciones de la app cuando se actualiza la app
      if (
        request?.body?.model == prefixTableName("application") &&
        request?.body?.action === "afterUpsert"
      ) {
        //  console.log('XXXXXXXXXXXXXXXX>', request.body);

        // TODO: Revisar el entorno no solo la app
        if (request?.body?.data?.app) {
          setTimeout(() => {
            // Espera 5 segundos para borrar la cache de las funciones del endpoint
            this._deleteEndpointsByAppName(request?.body?.data?.app);
          }, 5000);
        }
      }
    } else {
      console.error("Error validating webhook data", validated.errors);
      return { error: "Error validating webhook data", data: validated.errors };
    }
    */
  }

  async _build() {
    await this.fastify.register(formbody, {
      bodyLimit:
        parseInt(MAX_FILE_SIZE_UPLOAD, 10) * 1024 * 1024 ||
        DEFAULT_MAX_FILE_SIZE_UPLOAD, // For multipart forms, the max file size in bytes
    });
    await this.fastify.register(multipart, {
      attachFieldsToBody: "keyValues",
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
    });

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
      let request_path_params = get_url_params(request.url, request.method);

      if (request_path_params && request_path_params.url_key) {
        let cache_endpoint = await this.endpoints.getEndpoint(
          request_path_params.app,
          request_path_params.url_key
        );

        //
        if (cache_endpoint && cache_endpoint.handler) {
          let handlerEndpoint = cache_endpoint.handler;

          if (handlerEndpoint?.params?.enabled) {
            request.openfusionapi = { handler: handlerEndpoint };
            await this._check_auth(handlerEndpoint, request, reply);
          } else {
            reply.code(200).send({ message: "Endpoint unabled." });
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
        let handler_param = request?.openfusionapi?.handler?.params;

        if (!reply.openfusionapi) {
          reply.openfusionapi = { lastResponse: { responseTime: timeTaken } };
        }

        if (!reply.openfusionapi.lastResponse) {
          reply.openfusionapi.lastResponse = { responseTime: timeTaken };
        }

        if (!reply.openfusionapi.lastResponse.responseTime) {
          reply.openfusionapi.lastResponse.responseTime = timeTaken;
        }

        this._emitEndpointEvent("request_completed", {
          idendpoint: handler_param?.idendpoint,
          idapp: handler_param?.idapp,
          url: request.url,
          method: request.method,
          app: handler_param?.app,
          environment: handler_param?.environment,
          endpoint: handler_param?.url_method,
          responseTime: timeTaken,
          statusCode: reply.statusCode,
        });

        this.endpoints.saveLog(request, reply);

        if (handler_param?.idendpoint) {
          this.endpoints.setCache(handler_param?.url_key, request, reply);
        }
      }
    });

    /*
this.fastify.post("/mcp", async (request, reply) => {
  // Aquí puedes manejar las peticiones POST a /mcp

    try {
    const server = MCPServer; 
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    reply.raw.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(request, reply.raw, request.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!reply.headersSent) {
      reply.status(500).send({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }

  
  
});
*/

    this.fastify.get("/ws/*", { websocket: true }, (connection, req) => {
      // Todos los clientes deben estar registra<zdos para poder hacer broadcast o desconectarlos masivamente
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
                    //return;
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

                      this._emitEndpointEvent("request_start", {
                        idendpoint:
                          client_ws.openfusionapi.handler.params.idendpoint,
                        idapp: client_ws?.openfusionapi?.handler?.params?.idapp,
                        url: client_ws?.openfusionapi?.handler?.params?.url_key,
                        method: "WS",
                        app: client_ws?.openfusionapi?.handler?.params?.app,
                        environment:
                          client_ws?.openfusionapi?.handler?.params
                            ?.environment,
                        endpoint:
                          client_ws?.openfusionapi?.handler?.params?.url_key,
                        //responseTime: timeTaken,
                        //statusCode: reply.statusCode,
                      });
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

        // message.toString() === 'hi from client'
        // console.log(this.fastify.websocketServer.clients);
        //connection.socket.send("hi from server: " + message.toString());
      });
    });

    this.fastify.get("/server/version", async (request, reply) => {
      // Aquí puedes manejar las peticiones GET a /server/version
      reply.send({ version: version });
    });

    // Route to internal Hook - TODO: Ruta ya no utilizada, se puede eliminar
    this.fastify.post("/internal_url_post_hooks", async (request, reply) => {
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
                // Espera 5 segundos para borrar la cache de las funciones del endpoint
                request.body.data.db.row.forEach((item) => {
                  if (item) {
                    this._deleteEndpointsByAppName(item.app);
                  }
                });
              }, 5000);
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
        //        console.log("----- CACHE ------");

        let hash_request = this.endpoints.hash_request(
          request,
          handlerEndpoint.params.url_key
        );

        reply.openfusionapi.lastResponse.hash_request = hash_request;

        let data_cache = this.endpoints.getCache(
          handlerEndpoint.params.url_key,
          hash_request
        );

        if (data_cache) {
          // Si se obtiene desde caché, se agrega el header 'X-Cache: HIT'
          reply.header("X-Cache", "HIT");

          reply.openfusionapi.lastResponse[hash_request] = data_cache;

          // Envia los datos que están en cache
          reply.code(200).send(data_cache);
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

    //this.TasksInterval.run();
    //this.MCPServer.run();

    this.telegram.launch();

    await this.fastify.listen({ port: PORT, host: host });

    this._runOnReady();
  }

  _emitEndpointEvent(event_name, data) {
    this.websocketClientEndpoint.send({
      channel: "/endpoint/events",
      payload: {
        event_name: event_name,
        data: data,
      },
    });
  }

  async _runOnReady() {
    this.websocketClientEndpoint.on("open", () => {
      this.websocketClientEndpoint.subscribe("/endpoint/events");
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
    //console.log(appname, environment, functionName);
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
    })();

    return true;
  }
}
