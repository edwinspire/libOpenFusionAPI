import { Sequelize, QueryTypes } from "sequelize";
import { mergeObjects } from "../server/utils.js";
import {
  getHandlerExecutionContext,
  replyException,
  sendHandlerError,
  sendHandlerResponse,
} from "./utils.js";

import { Pool } from "./ConnectionPool.js";

export const sqlFunction = async (context) => {
  const { request, reply, method } = getHandlerExecutionContext(context);
  try {
    let paramsSQL = { query: method.code, config: typeof method.custom_data === 'string' ? JSON.parse(method.custom_data) : method.custom_data };

    /* 
  El config debería tener:
 
 // Option 3: Passing parameters separately (other dialects)
 const sequelize = new Sequelize('database', 'username', 'password', {
   host: 'localhost',
   dialect: 'postgres'
 });
 
  */

    /*
    try {
      paramsSQL = JSON.parse(method.code);
    } catch (e) {
      reply.code(400).send({ error: "Invalid JSON in method code" });
      return;
    }
    */

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
      if (data_request?.config) {
        try {
          connection_json =
            typeof data_request.config == "object"
              ? data_request.config
              : JSON.parse(data_request.config);
        } catch (e) {
          sendHandlerError(reply, 400, "Invalid JSON in connection params");
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
        sendHandlerError(reply, 400, "Invalid JSON in bind params");
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

        let sequelize = await Pool.getConnection(configHash, paramsSQL);

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

        sendHandlerResponse(reply, {
          statusCode: 200,
          data: result_query,
        });
      } else {
        sendHandlerError(reply, 400, "Params configuration is not complete");
      }
    } else {
      sendHandlerError(reply, 400, "Database Params configuration is not complete");
    }

  } catch (error) {
    replyException(request, reply, error);
  }
};
