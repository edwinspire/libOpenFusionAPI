import { functionsVars, listFunctionsVars } from "../server/functionVars.js";
import mongoose from "mongoose";
import {
  getAppVarContext,
  parseJsonConfig,
  replyException,
  sendHandlerError,
  setCacheReply,
  resolveAppVarPlaceholder,
} from "./utils.js";

// TODO: No probado completamente, revisar antes de producción

export const getMongoDBParams = (custom_data) => {
  let paramsMongo;
  if (
    custom_data !== undefined &&
    custom_data !== null &&
    !(typeof custom_data === "string" && custom_data.trim().length === 0)
  ) {
    paramsMongo = parseJsonConfig(custom_data);
  }

  if (!paramsMongo) {
    paramsMongo = {
      host: "localhost",
      port: 27017,
      dbName: "my_db",
      user: "",
      pass: "",
    };
  }

  if (!paramsMongo.options) {
    paramsMongo.options = {};
  }

  return paramsMongo;
};

/* ============================================================
   CACHE DE CONEXIONES POR CONFIGURACIÓN
   Cada combinación única de host/port/dbName/user tiene su propio
   pool de conexiones (mongoose.createConnection).
   ============================================================ */
const connectionCache = new Map();

/**
 * Genera una clave única para la configuración de conexión
 */
function getConnectionKey(params) {
  return JSON.stringify({
    host: params.host,
    port: params.port,
    dbName: params.dbName,
    user: params.user,
  });
}

/**
 * Obtiene o crea una conexión de mongoose para la configuración dada.
 * Si ya existe una conexión activa para esta config, la reutiliza.
 */
async function getOrCreateConnection(paramsMongo) {
  const key = getConnectionKey(paramsMongo);

  if (connectionCache.has(key)) {
    const conn = connectionCache.get(key);
    // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    if (conn.readyState === 1 || conn.readyState === 2) {
      return conn;
    }
    // Conexión muerta, limpiar
    connectionCache.delete(key);
  }

  const conn = mongoose.createConnection(
    `mongodb://${paramsMongo.host}:${paramsMongo.port}`,
    {
      dbName: paramsMongo.dbName,
      user: paramsMongo.user || undefined,
      pass: paramsMongo.pass || undefined,
      ...paramsMongo.options,
    }
  );

  // Limpiar cache si la conexión se cierra o hay error
  conn.on("disconnected", () => {
    connectionCache.delete(key);
  });
  conn.on("error", (err) => {
    console.error(`MongoDB connection error (${paramsMongo.host}:${paramsMongo.port}/${paramsMongo.dbName}):`, err.message);
    connectionCache.delete(key);
  });

  connectionCache.set(key, conn);

  // Esperar a que la conexión esté lista
  await conn.asPromise();

  return conn;
}

export const mongodbFunction = async (context) => {
  const request = context?.request;
  const reply = context?.reply;
  const method = context?.method || context?.endpoint;
  const endpoint = context?.endpoint || context?.method;
  const server_data = context?.server_data;
  try {
    if (!method.jsFn) {
      throw new Error("Function 'jsFn' is not defined in the method configuration.");
    }

    const { appVars, environment } = getAppVarContext(endpoint, method);
    const custom_data = resolveAppVarPlaceholder(
      method.custom_data,
      appVars,
      environment,
    );

    let paramsMongo;
    try {
      paramsMongo = getMongoDBParams(custom_data);
    } catch (error) {
      sendHandlerError(reply, 400, error?.message || "Invalid MongoDB configuration");
      return;
    }

    const conn = await getOrCreateConnection(paramsMongo);

    let fnVars = functionsVars(request, reply, method.environment);
    fnVars.mongooseInstance = conn; // Conexión específica para esta config

    let fnresult = await method.jsFn(fnVars);

    setCacheReply(reply, fnresult.data);

    reply.code(200).send(fnresult.data);

  } catch (error) {
    replyException(request, reply, error);
  }
};
