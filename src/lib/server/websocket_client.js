import { EventEmitter } from "node:events";
import WebSocket from "ws";
//import { WebSocketValidateFormatChannelName } from "./websocket_client.js";

// ─────────────────────────────────────────────────────────────
// Configuración
// ─────────────────────────────────────────────────────────────
//const WS_URL = 'wss://tu-servidor.example.com/socket'; // Cambia por tu URL
const BEARER_TOKEN = "tu-token-jwt-aqui"; // Token Bearer
const HEADERS = {
  // Headers personalizados
  Authorization: `Bearer ${BEARER_TOKEN}`,
  "X-Custom-Header": "mi-valor",
  // Origin: 'https://miapp.com', // Si el servidor lo valida
};

const HEARTBEAT_INTERVAL = 60 * 1000; // 1 minuto (ping)
const PONG_TIMEOUT = 10 * 1000; // 10s para considerar muerto si no hay pong
const MAX_RECONNECT_DELAY = 30 * 1000; // Máx backoff 30s

// ─────────────────────────────────────────────────────────────
// Cliente con reconexión y heartbeat
// ─────────────────────────────────────────────────────────────
export class OpenFusionWebsocketClient extends EventEmitter {
  constructor(url, headers = {}) {
    super();
    this.url = url;
    this.headers = headers;
    this.ws = null;
    this.retryCount = 0;
    this.heartbeatTimer = null;
    this.pongTimeoutTimer = null;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url, [], {
      // Subprotocols vacíos (agrega si necesitas, ej: ['json'])
      headers: this.headers,
      perMessageDeflate: false, // Desactiva compresión si no la usas
    });

    this.ws.on("open", () => {
      console.log("✅ Conectado al WebSocket");
      this.retryCount = 0; // Reset backoff
      this.startHeartbeat();
      // Opcional: Envía un mensaje inicial de "hello"
      //this.send({ type: "auth", token: BEARER_TOKEN });
      this.emit("open", {});
    });

    this.ws.on("message", (rawData) => {
      let data;
      try {
        // Asume que todo es JSON; si no, lo ignoras o manejas
        data = JSON.parse(rawData.toString());
     //   console.log("📩 Mensaje JSON recibido:", data);
        this.handleMessage(data); // Tu lógica de negocio aquí
      } catch (err) {
        console.warn("⚠️ Mensaje no JSON recibido:", rawData.toString());
      }
    });

    this.ws.on("pong", () => {
      // console.log('❤️ Pong recibido (heartbeat OK)');
      clearTimeout(this.pongTimeoutTimer);
      this.pongTimeoutTimer = null; // Reset timeout
    });

    this.ws.on("close", (code, reason) => {
      console.log(
        `🔌 Conexión cerrada ${this.url} (code=${code}, reason=${
          reason.toString() || "ninguna"
        })`
      );
      this.cleanupHeartbeat();
      this.reconnect();
    });

    this.ws.on("error", (err) => {
      console.error(`❌ Error en WebSocket: ${this.url}`, err.message);
      // 'close' se disparará después y manejará reconexión
    });
  }

  // ─── Heartbeat: ping cada 1 min ───
  startHeartbeat() {
    this.cleanupHeartbeat(); // Limpia timers previos
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        //console.log("📤 Enviando ping (heartbeat)");
        this.ws.ping(); // Envía ping

        // Si no hay pong en PONG_TIMEOUT, fuerza cierre
        this.pongTimeoutTimer = setTimeout(() => {
          console.warn("⏰ No se recibió pong a tiempo → Forzando desconexión");
          this.ws.terminate(); // Cierra abruptamente para forzar reconexión
        }, PONG_TIMEOUT);
      }
    }, HEARTBEAT_INTERVAL);
  }

  cleanupHeartbeat() {
    clearInterval(this.heartbeatTimer);
    clearTimeout(this.pongTimeoutTimer);
    this.heartbeatTimer = null;
    this.pongTimeoutTimer = null;
  }

  // ─── Enviar mensaje JSON ───
  send(message) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const json = JSON.stringify(message);
      this.ws.send(json);
      //console.log("📤 Mensaje JSON enviado:", message);
    } else {
      console.warn("⚠️ No se puede enviar: conexión no abierta", message);
    }
  }

  subscribe(channel) {
    this.send({
      payload: { channel: channel },
      channel: "/subscribe",
    });
  }

  // ─── Tu handler de mensajes (personalízalo) ───
  handleMessage(data) {
    // Ejemplo: responde a pings del servidor si usa su propio protocolo
    if (data.type === "pong") {
      // Maneja si el servidor envía pongs personalizados
    }
    // Aquí pon tu lógica real
  }

  // ─── Reconexión con backoff exponencial ───
  reconnect() {
    const delay = Math.min(1000 * 2 ** this.retryCount, MAX_RECONNECT_DELAY);
    this.retryCount++;
    console.log(
      `🔄 Reintentando conexión en ${delay}ms (intento #${this.retryCount})...`
    );
    setTimeout(() => this.connect(), delay);
  }

  // ─── Cerrar manualmente ───
  close() {
    this.cleanupHeartbeat();
    if (this.ws) this.ws.close(1000, "Cierre manual");
  }
}

// ─────────────────────────────────────────────────────────────
// Uso
// ─────────────────────────────────────────────────────────────
/*
const client = new OpenFusionWebsocketClient(WS_URL, HEADERS);

// Ejemplo de envío después de conectar (o en handleMessage)
setTimeout(() => {
  client.send({ type: 'subscribe', channel: 'notificaciones' });
}, 2000);

*/
