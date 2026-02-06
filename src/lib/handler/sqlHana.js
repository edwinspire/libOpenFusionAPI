import { mergeObjects } from "../server/utils.js";
import { setCacheReply } from "./utils.js";
import hana from "@sap/hana-client";

const connections = new Map();
const MAX_CONNECTIONS = 50;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Obtiene un pool de conexiones HANA del caché o crea uno nuevo.
 * Implementa LRU (Least Recently Used) y TTL.
 */
const getConnection = async (configHash, paramsSQL) => {
  const now = Date.now();

  // 1. Verificar Caché
  if (connections.has(configHash)) {
    const entry = connections.get(configHash);

    // Verificar TTL
    if (now - entry.created > CACHE_TTL) {
      console.log(`HANA Pool expired: ${configHash}`);
      try {
        entry.pool.disconnect();
      } catch (e) {
        console.error("Error disconnecting expired pool", e);
      }
      connections.delete(configHash);
    } else {
      // Actualizar uso y retornar
      entry.lastUsed = now;
      return entry.pool;
    }
  }

  // 2. Limpieza LRU si está lleno
  if (connections.size >= MAX_CONNECTIONS) {
    let oldestHash = null;
    let oldestTime = Infinity;

    for (const [hash, entry] of connections.entries()) {
      if (entry.lastUsed < oldestTime) {
        oldestTime = entry.lastUsed;
        oldestHash = hash;
      }
    }

    if (oldestHash) {
      console.log(`Closing idle HANA pool: ${oldestHash}`);
      const oldEntry = connections.get(oldestHash);
      try {
        oldEntry.pool.disconnect();
      } catch (err) {
        console.error("Error closing idle HANA pool:", err);
      }
      connections.delete(oldestHash);
    }
  }

  // 3. Crear nuevo Pool
  // @ts-ignore
  const pool = hana.createPool(paramsSQL.config, {
    max: 10,
    min: 0,
    maxIdleTime: 20000, // 20 segundos idle
    checkInterval: 5000,
  });

  // 4. Guardar en caché
  connections.set(configHash, {
    pool,
    created: now,
    lastUsed: now,
  });

  return pool;
};

export const sqlHana = async (
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
    let data_request = {};


    if (request.method == "GET") {
      // Obtiene los datos del query
      data_request.params = request.query;
      //      console.log(data_request.params);
    } else if (request.method == "POST") {
      data_request = request.body || {}; // Se agrega un valor por default
    }

    if (data_request) {
      // Obtiene los parametros de conexión
      if (data_request.connection) {
        let connection_json;
        try {
          connection_json =
            typeof data_request.connection == "object"
              ? data_request.connection
              : JSON.parse(data_request.connection);
        } catch (e) {
          reply.code(400).send({ error: "Invalid JSON in connection params" });
          return;
        }

        paramsSQL.config = mergeObjects(paramsSQL.conexion, connection_json);
      }

      //      console.log(paramsSQL);

      if (paramsSQL.config) {
        const configHash = JSON.stringify(paramsSQL.config);
        const pool = await getConnection(configHash, paramsSQL);

        let result = await executeQuery(
          pool,
          paramsSQL.query,
          data_request.params,
          paramsSQL.options
        );

        setCacheReply(reply, result);
        reply.code(200).send(result);
        /*
        var conn_params_qa = {
          "serverNode": "192.169.178.123:10349",
          "uid": "USER",
          "pwd": "PASS123",
        };
        */

        //  console.log('-------------> ', result_query.toSQL())
      } else {
        let alt_resp = { error: "Params configuration is not complete" };
        setCacheReply(reply, alt_resp);

        reply.code(400).send(alt_resp);
      }
    } else {
      let alt_resp = { error: "Not data" };
      setCacheReply(reply, alt_resp);
      reply.code(400).send(alt_resp);
    }
  } catch (error) {
    console.trace(error);
    // setCacheReply(reply, error);
    // @ts-ignore
    // @ts-ignore
    reply.code(500).send({ error: "Internal Server Error" });
  }
};

function executeQuery(pool, command, params_bind, options) {
  return new Promise((resolve, reject) => {
    // 1. Parsing Single-Pass para robustez (ignora quotes)
    let new_command = "";
    let params = [];
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let i = 0;

    try {
      while (i < command.length) {
        const char = command[i];

        // Manejo de comillas
        if (char === "'" && !inDoubleQuote) {
          inSingleQuote = !inSingleQuote;
          new_command += char;
          i++;
          continue;
        }
        if (char === '"' && !inSingleQuote) {
          inDoubleQuote = !inDoubleQuote;
          new_command += char;
          i++;
          continue;
        }

        // Detección de Placeholders fuera de comillas
        if (
          !inSingleQuote &&
          !inDoubleQuote &&
          (char === "$" || char === ":")
        ) {
          // Extraer nombre del placeholder
          let j = i + 1;
          while (j < command.length && /[a-zA-Z0-9_]/.test(command[j])) {
            j++;
          }
          const placeholder = command.slice(i, j);
          const bindName = placeholder.replace(/[:$]/g, "");

          if (j > i + 1) {
            // Placeholder válido encontrado
            // Verificar existencia en bind params
            if (
              params_bind &&
              Object.prototype.hasOwnProperty.call(params_bind, bindName)
            ) {
              const value = params_bind[bindName];

              if (Array.isArray(value)) {
                // Expansión de Arrays: IN (?) -> IN (?,?,?)
                if (value.length === 0) {
                  throw new Error(
                    `Empty array provided for parameter ${placeholder}`
                  );
                }
                const placeholders = value.map(() => "?").join(", ");
                new_command += placeholders;
                params.push(...value);
              } else {
                // Valor simple
                new_command += "?";
                params.push(value);
              }
            } else {
              throw new Error(`Missing parameter value for ${placeholder}`);
            }

            i = j; // Saltar placeholder
            continue;
          }
        }

        // Caracter normal
        new_command += char;
        i++;
      }
    } catch (err) {
      return reject(err);
    }

    // 2. Ejecución con Pool
    const conn = pool.getConnection(); // Obtener conexión del pool


    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }

      connection.exec(new_command, params, options, (err, result) => {
        connection.close(); // Liberar conexión al pool
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });
}

/*

Manual Verification
Multiple Requests: Verify process handle count stays stable.
Complex Query: Verify $param used multiple times works correctly.

*/