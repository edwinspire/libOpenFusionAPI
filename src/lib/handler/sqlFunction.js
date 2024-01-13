import { Sequelize, QueryTypes } from "sequelize";

export const sqlFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let paramsSQL = JSON.parse(method.code);
    let data_bind = {};
    let data_request;

    if (request.method == "GET") {
      // Obtiene los datos del query
      data_request = request.query;
    } else if (request.method == "POST") {
      data_request = request.body;
    }

    if (data_request) {
      // Obtiene los parametros de conexión
      if (data_request.connection) {
        let connection_json =
          typeof data_request.connection == "object"
            ? data_request.connection
            : JSON.parse(data_request.connection);

        paramsSQL.config.database =
          connection_json.database ?? paramsSQL.config.database;
        paramsSQL.config.username =
          connection_json.username ?? paramsSQL.config.username;
        paramsSQL.config.password =
          connection_json.password ?? paramsSQL.config.password;
        paramsSQL.config.options =
          connection_json.options ?? paramsSQL.config.options;
      }

      // Obtiene los valoes para hacer el bind de datos
      let bind_json = {};

      if (data_request.bind) {
        bind_json =
          typeof data_request.bind == "object"
            ? data_request.bind
            : JSON.parse(data_request.bind);
      }

      for (let param in bind_json) {
        // eslint-disable-next-line no-prototype-builtins
        if (bind_json.hasOwnProperty(param)) {
          // @ts-ignore
          const valor = bind_json[param];
          console.log(`Clave: ${param}, Valor: ${valor}`);

          // @ts-ignore
          data_bind[param] = valor;
        }
      }

      if (paramsSQL.config.database) {
        console.log("Config sqlFunction", paramsSQL, request.method);

        // Verificar las configuraciones minimas
        if (paramsSQL && paramsSQL.config.options && paramsSQL.query) {
          const sequelize = new Sequelize(
            paramsSQL.config.database,
            paramsSQL.config.username,
            paramsSQL.config.password,
            paramsSQL.config.options
          );

          //      console.log(config);

          let result_query = await sequelize.query(paramsSQL.query, {
            // @ts-ignore
            bind: data_bind,
            // @ts-ignore
            type: QueryTypes.SELECT,
          });

          if (
            response.openfusionapi.lastResponse &&
            response.openfusionapi.lastResponse.hash_request
          ) {
            response.openfusionapi.lastResponse.data = result_query;
          }
		  
          response.code(200).send(result_query);
        } else {
          response
            .code(400)
            .send({ error: "Params configuration is not complete" });
        }
      } else {
        response.code(400).send({ error: "Database is required." });
      }
    } else {
      response.code(400).send({ error: "Not data" });
    }
  } catch (error) {
    //console.log(error);
    // @ts-ignore
    response.code(500).send(error);
  }
};
