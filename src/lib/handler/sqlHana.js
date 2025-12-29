import { mergeObjects } from "../server/utils.js";
import { setCacheReply } from "./utils.js";
import hana from "@sap/hana-client";

export const sqlHana = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ reply,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let paramsSQL = JSON.parse(method.code);
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
        let connection_json =
          typeof data_request.connection == "object"
            ? data_request.connection
            : JSON.parse(data_request.connection);

        paramsSQL.config = mergeObjects(paramsSQL.conexion, connection_json);
      }

      //      console.log(paramsSQL);

      if (paramsSQL.config) {
        let result = await executeQuery(
          paramsSQL.config,
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
    reply.code(500).send(error);
  }
};

function executeQuery(conection, command, params_bind, options) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();

    let place_holder = extractPlaceholders(command);
    let checkBind = checkPlaceHoldersBind(params_bind, place_holder);

    //console.log(checkBind);

    /*
  var options = {
      nestTables: TRUE
    };

 */
    if (checkBind.valid) {
      let params = [];
      let new_command = command;

      for (let index = 0; index < place_holder.length; index++) {
        const element = place_holder[index];
        const element_bind_name = element.replace(":", "").replace("$", "");
        if (element.startsWith("$")) {
          new_command = new_command.replace(element, "?");
          params.push(params_bind[element_bind_name]);
        } else {
          // Hace un bind a una lista

          if (Array.isArray(params_bind[element_bind_name])) {
            let varsplaceholders = params_bind[element_bind_name]
              .map(() => "?")
              .join(", "); // Crea un string "?, ?, ?"
            new_command = new_command.replace(element, varsplaceholders);
            params.push(...params_bind[element_bind_name]);
          } else {
            throw { error: `${element_bind_name} is not array.` };
          }
        }
      }

      conn.connect(conection, (err) => {
        if (err) {
          reject(err);
        } else {
          conn.exec(new_command, params, options, (err, result) => {
            conn.disconnect(); // Asegura desconexión de la base de datos
            if (err) {
              reject(err);
            } else {
              resolve(result); // Devuelve el resultado
            }
          });
        }
      });
    } else {
      reject({ error: checkBind });
    }
  });
}

function checkPlaceHoldersBind(data_bind, place_holders) {
  let bind_lost_names = { valid: false, parameters: [], error: undefined };

  if (typeof data_bind == "object") {
    if (Array.isArray(place_holders)) {
      for (let index = 0; index < place_holders.length; index++) {
        const element = place_holders[index].replace(":", "").replace("$", "");
        if (!data_bind[element]) {
          bind_lost_names.parameters.push(element);
        }
      }
      bind_lost_names.valid = bind_lost_names.parameters.length == 0;
      if (!bind_lost_names.valid) {
        bind_lost_names.error = "There are missing parameters.";
      }
    } else {
      bind_lost_names.error = "place_holder is not array";
    }
  } else {
    bind_lost_names.error = "bind not is object";
  }
  return bind_lost_names;
}

function extractPlaceholders(query) {
  const placeholders = [];
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < query.length; i++) {
    const char = query[i];

    // Alternar estado si encontramos comillas
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    }

    // Si encontramos un placeholder fuera de comillas, lo extraemos
    if (!inSingleQuote && !inDoubleQuote && (char === '$' || char === ':')) {
      let j = i + 1;
      while (j < query.length && /[a-zA-Z0-9_]/.test(query[j])) {
        j++;
      }
      placeholders.push(query.slice(i, j));
      i = j - 1; // Avanzar el índice al final del placeholder
    }
  }

  return placeholders;
}
