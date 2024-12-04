import { Sequelize, QueryTypes } from "sequelize";
import { mergeObjects } from "../server/utils.js";
import { setCacheReply } from "./utils.js";

export const sqlFunctionInsertBulk = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ reply,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let paramsSQL = JSON.parse(method.code);
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

      if (paramsSQL.config.database) {
        //console.log("Config sqlFunction", paramsSQL, request.method, data_bind);

        // Verificar las configuraciones minimas
        if (paramsSQL && paramsSQL.config.options && paramsSQL.table_name) {
          const sequelize = new Sequelize(
            paramsSQL.config.database,
            paramsSQL.config.username,
            paramsSQL.config.password,
            paramsSQL.config.options
          );

          let result_query = await bulkInsert(
            sequelize,
            paramsSQL.table_name,
            data_request.data
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
    //console.log(error);
    setCacheReply(reply, { error: error });
    // @ts-ignore
    reply.code(500).send(error);
  }
};

function bulkInsert(sequelize, tableName, data) {
  return new Promise(async (resolve, reject) => {
    if (!data && !Array.isArray(data) && !data.length) {
      console.log("No data to insert.");
      return reject({ error: "No data to insert." }); // Resolviendo con 0 registros insertados
    }

    const columns = Object.keys(data[0]);
    let insertedCount = 0;

    let transaction;

    try {
      transaction = await sequelize.transaction();

      for (const row of data) {
        //const values = columns.map((col) => row[col]).join(", ");
        const columns_bind = columns.map((col) => `$${col}`).join(", ");

        const query = `
          INSERT INTO ${tableName} (${columns.join(", ")})
          VALUES (${columns_bind});
        `;
        const result = await sequelize.query(query, {
          bind: row,
          transaction,
          type: QueryTypes.INSERT,
          raw: true,
        });

        if (result) {
          insertedCount++;
        }
      }

      await transaction.commit();
      //      console.log("Bulk insert completed successfully.");
      resolve({ inserted: insertedCount }); // Resolviendo con la cantidad de registros insertados
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
        console.error("Error during bulk insert:", error);
      }

      if (error.parent) {
        reject(error.parent); // Rechazando la promesa en caso de error
      } else {
        reject(error); // Rechazando la promesa en caso de error
      }
    }
  });
}
