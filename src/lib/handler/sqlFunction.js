import { Sequelize, QueryTypes } from "sequelize";
import { mergeObjects } from "../server/utils.js";
import { setCacheReply, replyException } from "./utils.js";

const connections = new Map();
const MAX_CONNECTIONS = 50;

/**
 * Gestiona el ciclo de vida de las conexiones para evitar fugas de memoria.
 * Implementa una estrategia LRU (Least Recently Used).
 */
const getConnection = async (configHash, paramsSQL) => {
  // 1. Si existe, actualizamos timestamp y retornamos
  if (connections.has(configHash)) {
    const connData = connections.get(configHash);
    connData.lastUsed = Date.now();
    return connData.sequelize;
  }

  // 2. Si no existe, verificamos límite
  if (connections.size >= MAX_CONNECTIONS) {
    // Buscar la conexión más antigua (LRU)
    let oldestHash = null;
    let oldestTime = Infinity;

    for (const [hash, data] of connections.entries()) {
      if (data.lastUsed < oldestTime) {
        oldestTime = data.lastUsed;
        oldestHash = hash;
      }
    }

    if (oldestHash) {
      console.log(`Closing idle connection: ${oldestHash}`);
      const oldConn = connections.get(oldestHash);
      try {
        await oldConn.sequelize.close();
      } catch (err) {
        console.error("Error closing idle connection:", err);
      }
      connections.delete(oldestHash);
    }
  }

  // 3. Crear nueva conexión
  const sequelize = new Sequelize(
    paramsSQL.config.database,
    paramsSQL.config.username,
    paramsSQL.config.password,
    paramsSQL.config.options
  );

  // 4. Guardar en mapa
  connections.set(configHash, {
    sequelize: sequelize,
    lastUsed: Date.now(),
  });

  return sequelize;
};

export const sqlFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ reply,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let paramsSQL;
    try {
      paramsSQL = JSON.parse(method.code);
    } catch (e) {
      reply.code(400).send({ error: "Invalid JSON in method code" });
      return;
    }

    let data_bind = {};
    let data_request = {};
    let query_type = QueryTypes.SELECT;

    if (paramsSQL.query_type && QueryTypes[paramsSQL.query_type]) {
      query_type = QueryTypes[paramsSQL.query_type];
    }

    if (request.method == "GET") {
      // Obtiene los datos del query
      data_request.bind = request.query;
    } else if (request.method == "POST") {
      data_request = request.body || {}; // Se agrega un valor por default
    }

    if (data_request) {
      // Obtiene los parametros de conexión
      let connection_json;
      if (data_request?.connection) {
        try {
          connection_json =
            typeof data_request.connection == "object"
              ? data_request.connection
              : JSON.parse(data_request.connection);
        } catch (e) {
          reply.code(400).send({ error: "Invalid JSON in connection params" });
          return;
        }
      }

      paramsSQL.config = mergeObjects(paramsSQL.config, connection_json);
    }

    // Obtiene los valores para hacer el bind de datos
    let bind_json = undefined;
    let replacements = undefined;

    if (data_request.replacements) {
      replacements = data_request.replacements;
    }

    if (data_request.bind) {
      try {
        bind_json =
          typeof data_request.bind == "object"
            ? data_request.bind
            : JSON.parse(data_request.bind);
      } catch (e) {
        reply.code(400).send({ error: "Invalid JSON in bind params" });
        return;
      }
    }

    // Procesar y estandarizar los parámetros del bind
    if (bind_json) {
      if (Array.isArray(bind_json)) {
        data_bind = bind_json;
      } else {
        for (let param in bind_json) {
          // Limpiar prefijos (:, $, @) para estandarizar las keys
          const key = param.replace(/^[:$@]/, '');
          const valor = bind_json[param];
          data_bind[key] = (typeof valor === "object" && valor !== null)
            ? JSON.stringify(valor) : valor;
        }
      }
    }

    // Auto-detectar si la query usa :key (replacements) o $key (bind)
    // Según docs Sequelize: replacements usa ":" y bind usa "$"
    if (paramsSQL.query && !replacements && !Array.isArray(data_bind)
      && Object.keys(data_bind).length > 0) {
      const hasColonParams = /:[a-zA-Z_][a-zA-Z0-9_]*/.test(paramsSQL.query);
      if (hasColonParams) {
        replacements = data_bind;
        data_bind = {};
      }
    }

    if (paramsSQL.config.database) {
      //console.log("Config sqlFunction", paramsSQL, request.method, data_bind);

      // Verificar las configuraciones minimas
      if (paramsSQL && paramsSQL.config.options && paramsSQL.query) {
        const configHash = JSON.stringify({
          db: paramsSQL.config.database,
          user: paramsSQL.config.username,
          host: paramsSQL.config.options?.host,
          port: paramsSQL.config.options?.port,
        });

        let sequelize = await getConnection(configHash, paramsSQL);

        let result_query = undefined;

        const queryOptions = { type: query_type, logging: false };

        if (replacements) {
          queryOptions.replacements = replacements;
        } else if (data_bind && (Array.isArray(data_bind)
          ? data_bind.length > 0 : Object.keys(data_bind).length > 0)) {
          queryOptions.bind = data_bind;
        }

        result_query = await sequelize.query(paramsSQL.query, queryOptions);

        //  console.log('-------------> ', result_query.toSQL())

        setCacheReply(reply, result_query);
        reply.code(200).send(result_query);
      } else {
        let alt_resp = { error: "Params configuration is not complete" };
        setCacheReply(reply, alt_resp);

        reply.code(400).send(alt_resp);
      }
    } else {
      let alt_resp = { error: "Database Params configuration is not complete" };
      setCacheReply(reply, alt_resp);

      reply.code(400).send(alt_resp);
    }

  } catch (error) {
    replyException(request, reply, error);
  }
};
