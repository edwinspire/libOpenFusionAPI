import { getUUID } from "./utils.js";
import { WebSocketValidateFormatChannelName } from "./utils_path.js";
import { validateSchemaMessageWebSocket } from "./schemas/index.js";

export class WebSocketManager {
  constructor(fastify) {
    this.fastify = fastify;
    // Map<String, Set<WebSocket>>
    // Key: `${idendpoint}::${channel}`
    this.wsSubscribers = new Map();

    this.commandHandlers = {
      "/subscribe": (connection, msgObj) => {
        this.handleSubscribe(connection, msgObj);
      },
      "/ping": (connection) => {
        this.handlePing(connection);
      },
    };
  }

  getWsKey(idendpoint, channel) {
    return `${idendpoint}::${channel}`;
  }

  addWsSubscriber(socket, idendpoint, channel) {
    const key = this.getWsKey(idendpoint, channel);
    if (!this.wsSubscribers.has(key)) {
      this.wsSubscribers.set(key, new Set());
    }
    this.wsSubscribers.get(key).add(socket);
  }

  removeWsSubscriber(socket) {
    if (
      socket.openfusionapi &&
      socket.openfusionapi.channel &&
      socket.openfusionapi.handler
    ) {
      const idendpoint = socket.openfusionapi.handler.params.idendpoint;
      const channel = socket.openfusionapi.channel;
      const key = this.getWsKey(idendpoint, channel);
      if (this.wsSubscribers.has(key)) {
        const set = this.wsSubscribers.get(key);
        set.delete(socket);
        if (set.size === 0) {
          this.wsSubscribers.delete(key);
        }
      }
    }
  }

  sendJson(connection, payload) {
    connection.send(JSON.stringify(payload));
  }

  handleSubscribe(connection, msgObj) {
    if (msgObj.payload.channel) {
      let validate_channel_subscribe = WebSocketValidateFormatChannelName(
        msgObj.payload.channel,
      );
      if (!validate_channel_subscribe.valid) {
        this.sendJson(connection, {
          subscribed: false,
          channel: msgObj.payload.channel,
          error: validate_channel_subscribe.error,
        });
        return;
      }

      connection.openfusionapi.channel = msgObj.payload.channel;
      connection.openfusionapi.idclient = getUUID();
      this.addWsSubscriber(
        connection,
        connection.openfusionapi.handler.params.idendpoint,
        msgObj.payload.channel,
      );

      this.sendJson(connection, {
        subscribed: true,
        channel: msgObj.payload.channel,
        message: `Subscribed to channel ${msgObj.payload.channel}`,
      });
      return;
    }

    this.sendJson(connection, {
      subscribed: false,
      channel: msgObj.payload.channel,
      message: "Channel name is required to subscribe",
    });
  }

  handlePing(connection) {
    this.sendJson(connection, {
      channel: "/pong",
      payload: {},
    });
  }

  handleBroadcast(connection, msgObj) {
    // Broadcast
    // TODO: Esto no me parece que se optimo porque hay que recorrer todos los clientes en busca de los que corresponden a ese path
    // TODO: Revisar un mecanismo para limitar que un cliente puede enviar mensajes y esté limitado solo a leer mensajes
    // Broadcast Optimization
    const idendpoint = connection.openfusionapi.handler.params.idendpoint;
    const channel = connection.openfusionapi.channel;
    const key = this.getWsKey(idendpoint, channel);

    if (this.wsSubscribers.has(key)) {
      const subscribers = this.wsSubscribers.get(key);
      subscribers.forEach((client_ws) => {
        try {
          if (
            client_ws.readyState === 1 &&
            client_ws.openfusionapi.idclient != connection.openfusionapi.idclient
          ) {
            client_ws.send(JSON.stringify(msgObj.payload));
          }
        } catch (error) {
          this.sendJson(connection, { error: error.message });
        }
      });
    }
  }

  dispatchCommand(connection, msgObj) {
    const commandHandler = this.commandHandlers[msgObj.channel];

    if (commandHandler) {
      commandHandler(connection, msgObj);
      return true;
    }

    return false;
  }

  registerRoutes() {
    this.fastify.get("/ws/*", { websocket: true }, (connection, req) => {
      // En @fastify/websocket v11, connection ES el WebSocket directamente (no connection.socket)
      try {
        connection.openfusionapi = req.openfusionapi
          ? req.openfusionapi
          : {};

        //connection.openfusionapi.idclient = getUUID();
      } catch (error) {
        console.log(error);
      }

      connection.on("open", (message) => {
        //  console.log("Abre");
      });
      connection.on("close", (message) => {
        //console.log("Cierra");
        this.removeWsSubscriber(connection);
      });

      connection.on("message", (message) => {
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
            msgObj.channel,
          );
          if (validate_channel.valid) {
            let isValid = validateSchemaMessageWebSocket(msgObj);

            if (isValid) {
              //console.log("✅ Válido");

              if (!connection.openfusionapi.idclient && msgObj.channel !== "/subscribe") {
                this.sendJson(connection, { error: "Invalid client. Bye." });
                connection.close();
              } else if (this.dispatchCommand(connection, msgObj)) {
                return;
              } else if (connection.openfusionapi.idclient) {
                this.handleBroadcast(connection, msgObj);
              } else {
                this.sendJson(connection, { error: "Invalid client. Bye." });
                connection.close();
              }
            } else {
              //    console.log("❌ Inválido. Errores detectados:");
              // ¡Aquí está la magia! `validate.errors` es un array con los detalles.
              this.sendJson(connection, {
                error: validateSchemaMessageWebSocket.errors,
              });
              connection.close();
            }
          } else {
            // Devuelve un mensaje al cliente que originó el mensaje
            this.sendJson(connection, {
              error: "Invalid channel name format",
              message: msgString,
            });
            connection.close();
          }
        } catch (error) {
          this.sendJson(connection, { error: error.message, message: msgString });
          connection.close();
        }
      });
    });
  }
}
