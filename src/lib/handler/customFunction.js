import { schema_return_customFunction } from "./json_schemas.js";
import { setCacheReply, replyException } from "./utils.js";

import Ajv from "ajv";
const ajv = new Ajv({ removeAdditional: true, allErrors: true });
const validateSchema = ajv.compile(schema_return_customFunction);

export const customFunction = async (
  $_REQUEST_,
  $_REPLY_,
  method,
  $_SERVER_DATA_
) => {
  try {
    // Validación de función
    if (typeof method.Fn !== "function") {
      const msg = `URL: ${$_REQUEST_.url} - Function '${method.code}' not found.`;
      console.error(msg);
      $_REPLY_.code(500).send({ error: msg });
    }

    // Obtener datos seguros del request
    const body =
      typeof $_REQUEST_.body === "object" && $_REQUEST_.body !== null
        ? { ...$_REQUEST_.body }
        : null;

    const query =
      typeof $_REQUEST_.query === "object" && $_REQUEST_.query !== null
        ? { ...$_REQUEST_.query }
        : null;

    const user_data = body && Object.keys(body).length > 0 ? body : query || {};

    // Ejecutar función con timeout seguro
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1000 * 60 * 5); // 5 minutos maximo

    let fnresult;
    try {
      fnresult = await method.Fn({
        request: $_REQUEST_,
        user_data,
        reply: $_REPLY_,
        server_data: $_SERVER_DATA_,
        signal: controller.signal,
      });
    } catch (err) {
      console.error("Function execution error:", err);
      if (controller.signal.aborted) {
        throw new Error("Execution timeout");
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    // Validar salida
    if (!validateSchema(fnresult)) {
      const errors = validateSchema.errors || [{ message: "Invalid response" }];
      //     setCacheReply($_REPLY_, { errors });
      console.error("Response validation errors:", errors);
      $_REPLY_.code(500).send(errors);
    }

    // Respuesta válida
    setCacheReply($_REPLY_, fnresult.data);
    $_REPLY_.code(fnresult.code || 200).send(fnresult.data);
  } catch (err) {
    replyException($_REQUEST_, $_REPLY_, error);

  }
};
