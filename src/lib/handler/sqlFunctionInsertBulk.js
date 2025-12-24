import { Sequelize, QueryTypes } from "sequelize";
import { mergeObjects } from "../server/utils.js";
import { setCacheReply } from "./utils.js";
import { parseQualifiedName } from "../db/utils.js";

export const sqlFunctionInsertBulk = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ reply,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    //    console.log('CODE: ', method.code);
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

        try {
          let { database, schema, table } = parseQualifiedName(
            paramsSQL.table_name
          );

          paramsSQL.config.database = database;
          paramsSQL.config.schema = schema;
          paramsSQL.table_name = table;
        } catch (error) {
          console.error("Error al analizar el nombre calificado:", error);
        }

        if (paramsSQL.table_name && paramsSQL.table_name.length > 0) {
          // Verificar las configuraciones minimas
          if (paramsSQL && paramsSQL.config.options) {
            const sequelize = new Sequelize(
              paramsSQL.config.database,
              paramsSQL.config.username,
              paramsSQL.config.password,
              paramsSQL.config.options
            );

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
    console.log(error);

   // setCacheReply(reply, { error: error });
    reply.code(500).send(error);
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


function bulkInsert(sequelize, tableName, data) {
  //console.log('bulkInsert >>>>>>>>>>>> ', sequelize, tableName, data);

  return new Promise(async (resolve, reject) => {
    if (!data || !Array.isArray(data) || data.length < 1) {
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
        console.error("Error during bulk insert:", error);
        try {
          await transaction.rollback();
        } catch (error) {
          reject(error);
        }
      }

      if (error.parent) {
        reject(error.parent); // Rechazando la promesa en caso de error
      } else {
        reject(error); // Rechazando la promesa en caso de error
      }
    }
  });
}
