import { Sequelize, QueryTypes } from "sequelize";
import { mergeObjects } from "../server/utils.js";
import { setCacheReply } from "./utils.js";

export const sqlFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ reply,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let paramsSQL = JSON.parse(method.code);
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
      if (data_request.connection) {
        let connection_json =
          typeof data_request.connection == "object"
            ? data_request.connection
            : JSON.parse(data_request.connection);

        paramsSQL.config = mergeObjects(paramsSQL.config, connection_json);
      }

      // Obtiene los valores para hacer el bind de datos
      let bind_json = undefined;
      let replacements = undefined;

      if (data_request.replacements) {
        replacements = data_request.replacements;
      }

      if (data_request.bind) {
        bind_json =
          typeof data_request.bind == "object"
            ? data_request.bind
            : JSON.parse(data_request.bind);
      }

      for (let param in bind_json) {
        //if (bind_json && bind_json.hasOwnProperty(param)) {

        const valor = bind_json[param];
        //          console.log(`Clave: ${param}, Valor: ${valor}`);
        // data_bind[param] = valor;

        try {
          data_bind[param] =
            typeof valor === "object"
              ? JSON.stringify(valor)
              : valor.toString();
        } catch (error) {
          data_bind[param] = valor.toString();
        }

        //}
      }

      // console.warn(bind_json, data_bind);

      if (paramsSQL.config.database) {
        //console.log("Config sqlFunction", paramsSQL, request.method, data_bind);

        // Verificar las configuraciones minimas
        if (paramsSQL && paramsSQL.config.options && paramsSQL.query) {
          const sequelize = new Sequelize(
            paramsSQL.config.database,
            paramsSQL.config.username,
            paramsSQL.config.password,
            paramsSQL.config.options
          );

          let result_query = undefined;

          if (replacements) {
            result_query = await sequelize.query(paramsSQL.query, {
              replacements: replacements,

              type: query_type,
              //           logging: console.log, // Imprime el SQL en consola
              logging: false, // Imprime el SQL en consola
            });
          } else {
            result_query = await sequelize.query(paramsSQL.query, {
              bind: bind_json,
              type: query_type,
              //         logging: console.log, // Imprime el SQL en consola
              logging: false, // Imprime el SQL en consola
            });
          }

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
    } else {
      let alt_resp = { error: "Not data" };
      setCacheReply(reply, alt_resp);
      reply.code(400).send(alt_resp);
    }
  } catch (error) {
    //console.log(error);
    console.trace(error);
   // setCacheReply(reply, { error: error });

    if (error.name == "SequelizeDatabaseError") {
      reply.code(500).send({ error: error?.original.message });
    } else {
      reply.code(500).send({ error: error.message });
    }
  }
};
