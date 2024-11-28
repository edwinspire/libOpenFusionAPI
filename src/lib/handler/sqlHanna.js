import { mergeObjects } from "../server/utils.js";
import { setCacheReply } from "./utils.js";
import hana from "@sap/hana-client";

export const sqlHanna = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ reply,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let paramsSQL = JSON.parse(method.code);
    let data_bind = {};
    let data_request = {};

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

        paramsSQL.conexion = mergeObjects(paramsSQL.conexion, connection_json);
      }

      if (paramsSQL.conexion) {
        var conn = hana.createConnection();
        /*
        var conn_params_qa = {
          serverNode: "192.168.178.123:10341",
          uid: "USER",
          pwd: "PASS123",
        };
        */

        conn.connect(paramsSQL.conexion, function (err) {
          if (err) {
            setCacheReply(reply, { error: err });
            // @ts-ignore
            reply.code(500).send(err);
          } else {
            conn.exec(
              "SELECT * FROM SAPABAP1.LFA1 LIMIT 40000",
              [],
              function (err, result) {
                if (err) {
                  setCacheReply(reply, { error: err });
                  // @ts-ignore
                  reply.code(500).send(err);
                } else {
                  setCacheReply(reply, result);
                  reply.code(200).send(result);
                }

                conn.disconnect();
              }
            );
          }
        });

        //  console.log('-------------> ', result_query.toSQL())
      } else {
        let alt_resp = { error: "Params configuration is not complete" };
        setCacheReply(reply, alt_resp);

        response.code(400).send(alt_resp);
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
