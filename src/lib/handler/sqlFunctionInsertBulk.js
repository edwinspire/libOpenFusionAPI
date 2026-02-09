import { Sequelize, QueryTypes } from "sequelize";
import { mergeObjects } from "../server/utils.js";
import { setCacheReply } from "./utils.js";
import { parseQualifiedName } from "../db/utils.js";
import { replyException } from "./utils.js";

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

export const sqlFunctionInsertBulk = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ reply,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    //    console.log('CODE: ', method.code);
    let paramsSQL;
    try {
      paramsSQL = JSON.parse(method.code);
    } catch (e) {
      reply.code(400).send({ error: "Invalid JSON in method code" });
      return;
    }
    let data_request = {};
    let query_type = QueryTypes.INSERT;

    if (paramsSQL.query_type && QueryTypes[paramsSQL.query_type]) {
      query_type = QueryTypes[paramsSQL.query_type];
    }

    if (request.method == "GET") {
      // Obtiene los datos del query
      data_request.data = request.query;
    } else if (request.method == "POST") {
      data_request = request.body || {}; // Se agrega un valor por default
    }

    if (data_request) {
      // Obtiene los parametros de conexión
      if (data_request.connection) {
        let connection_json =
          typeof data_request.connection == "object"
            ? data_request.connection
            : JSON.parse(data_request.connection);

        paramsSQL.config = mergeObjects(paramsSQL.config, connection_json);
      }

      try {
        let { database, schema, table } = parseQualifiedName(
          paramsSQL.table_name
        );

        if (database) paramsSQL.config.database = database;
        if (schema) paramsSQL.config.schema = schema;
        if (table) paramsSQL.table_name = table;
      } catch (error) {
        // console.error("Error al analizar el nombre calificado:", error);
      }

      if (paramsSQL.config.database) {
        //console.log("Config sqlFunction", paramsSQL, request.method, data_bind);

        if (paramsSQL.table_name && paramsSQL.table_name.length > 0) {
          // Verificar las configuraciones minimas
          if (paramsSQL && paramsSQL.config.options) {
            const configHash = JSON.stringify({
              db: paramsSQL.config.database,
              user: paramsSQL.config.username,
              host: paramsSQL.config.options?.host,
              port: paramsSQL.config.options?.port,
            });

            const sequelize = await getConnection(configHash, paramsSQL);

            let result_query = await bulkInsertWithTransaction(
              sequelize,
              paramsSQL.config.schema,
              paramsSQL.table_name,
              data_request.data,
              paramsSQL.ignoreDuplicates
            );

            //  console.log('-------------> ', result_query.toSQL())

            setCacheReply(reply, result_query);
            reply.code(200).send(result_query);
          } else {
            let alt_resp = { error: "Params configuration is not complete" };
            setCacheReply(reply, alt_resp);

            reply.code(400).send(alt_resp);
          }
        } else {
          let alt_resp = { error: "Table name is required" };
          setCacheReply(reply, alt_resp);
          reply.code(400).send(alt_resp);
        }
      } else {
        let alt_resp = { error: "Database is required" };
        setCacheReply(reply, alt_resp);

        reply.code(400).send(alt_resp);
      }
    } else {
      let alt_resp = { error: "Not data" };
      setCacheReply(reply, alt_resp);
      reply.code(400).send(alt_resp);
    }
  } catch (error) {
    replyException($_REQUEST_, reply, error);
  }
};

async function bulkInsertWithTransaction(
  sequelize,
  schema,
  tableName,
  rows,
  ignoreDuplicates
) {
  // Obtiene el queryInterface
  const queryInterface = sequelize.getQueryInterface();

  // Inicia la transacción
  const transaction = await sequelize.transaction();

  let opts = {
    transaction,
    //updateOnDuplicate: updateOnDuplicate,
    ignoreDuplicates: ignoreDuplicates,
  };

  //console.log("Bulk insert options:", opts);

  try {
    // Ejecuta el bulkInsert dentro de la transacción
    let result = await queryInterface.bulkInsert(
      { schema: schema, tableName: tableName },
      rows,
      opts
    );

    // Si todo salió bien, hace commit
    await transaction.commit();
    console.log(`✅ Bulk insert exitoso en ${tableName}`);
    return { inserted: result }; // Devuelve la cantidad de registros insertados
  } catch (error) {
    // Si algo falla, hace rollback
    await transaction.rollback();
    console.error(`❌ Error en bulk insert:`, error);
    throw error;
  }
}


/*
TODO:
Manual Verification
Load Test: Verify that calling the bulk insert endpoint multiple times does not increase the number of active DB connections indefinitely.
Error Handling: Send invalid JSON to code or connection parameters and verify 400 Bad Request response.
*/
