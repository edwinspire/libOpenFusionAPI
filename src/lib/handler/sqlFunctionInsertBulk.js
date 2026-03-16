import { Sequelize, QueryTypes } from "sequelize";
import { mergeObjects } from "../server/utils.js";
import { parseQualifiedName } from "../db/utils.js";
import {
  getHandlerExecutionContext,
  replyException,
  sendHandlerError,
  sendHandlerResponse,
} from "./utils.js";

import { Pool } from "./ConnectionPool.js";

export const sqlFunctionInsertBulk = async (context) => {
  const { request, reply, method } = getHandlerExecutionContext(context);
  try {
    // Parsear custom_data con validación null-safe
    const customData = typeof method.custom_data === "string"
      ? JSON.parse(method.custom_data)
      : method.custom_data;

    if (!customData) {
      sendHandlerError(reply, 400, "custom_data configuration is required");
      return;
    }

    let paramsSQL = { table_name: method.code, config: customData };

    // query_type viene de custom_data (no de code, que es la query SQL)
    let query_type = QueryTypes.INSERT;
    if (paramsSQL.config.query_type && QueryTypes[paramsSQL.config.query_type]) {
      query_type = QueryTypes[paramsSQL.config.query_type];
    }

    // Solo POST tiene sentido para bulk insert
    if (request.method !== "POST") {
      sendHandlerError(reply, 405, "Only POST method is allowed for bulk insert");
      return;
    }

    let data_request = request.body || {};

    // Merge de parámetros de conexión del request (override)
    if (data_request.config) {
      try {
        let connection_json =
          typeof data_request.config === "object"
            ? data_request.config
            : JSON.parse(data_request.config);
        paramsSQL.config = mergeObjects(paramsSQL.config, connection_json);
      } catch (e) {
        sendHandlerError(reply, 400, "Invalid JSON in config params");
        return;
      }
    }

    // Parsear nombre calificado de tabla
    try {
      let { database, schema, table } = parseQualifiedName(paramsSQL.table_name);
      if (database) paramsSQL.config.database = database;
      if (schema) paramsSQL.config.schema = schema;
      if (table) paramsSQL.table_name = table;
    } catch (error) {
      // Nombre no calificado, continuar con lo que hay
    }

    // Validaciones con early return
    if (!paramsSQL.config.database) {
      sendHandlerError(reply, 400, "Database is required");
      return;
    }

    if (!paramsSQL.table_name || paramsSQL.table_name.length === 0) {
      sendHandlerError(reply, 400, "Table name is required");
      return;
    }

    if (!paramsSQL.config.options) {
      sendHandlerError(reply, 400, "Params configuration is not complete");
      return;
    }

    // Desactiva el log por defecto si no está definido explícitamente
    if (paramsSQL.config.options.logging === undefined) {
      paramsSQL.config.options.logging = false;
    }

    const configHash = JSON.stringify({
      db: paramsSQL.config.database,
      user: paramsSQL.config.username,
      host: paramsSQL.config.options?.host,
      port: paramsSQL.config.options?.port,
      dialect: paramsSQL.config.options?.dialect,
    });

    const sequelize = await Pool.getConnection(configHash, paramsSQL);

    let result_query = await bulkInsertWithTransaction(
      sequelize,
      paramsSQL.config.schema,
      paramsSQL.table_name,
      data_request.data,
      paramsSQL.ignoreDuplicates
    );

    sendHandlerResponse(reply, {
      statusCode: 200,
      data: result_query,
    });
  } catch (error) {
    replyException(request, reply, error);
  }
};

async function bulkInsertWithTransaction(
  sequelize,
  schema,
  tableName,
  rows,
  ignoreDuplicates
) {
  const queryInterface = sequelize.getQueryInterface();
  const transaction = await sequelize.transaction();

  let opts = {
    transaction,
    ignoreDuplicates: ignoreDuplicates,
  };

  try {
    let result = await queryInterface.bulkInsert(
      { schema: schema, tableName: tableName },
      rows,
      opts
    );

    await transaction.commit();
    return { inserted: result };
  } catch (error) {
    await transaction.rollback();
    console.error(`❌ Error en bulk insert (${tableName}):`, error.message);
    throw error;
  }
}
