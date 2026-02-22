import { z } from "zod";
import { setCacheReply, replyException } from "./utils.js";

const schemaResult = z.object({
  code: z.number(),
  data: z.union([
    z.record(z.any()),      // object
    z.array(z.any()),       // array
    z.boolean(),
    z.string(),
    z.number(),
    z.null(),
  ]),
});

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
      return;
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
      // Verificar abort PRIMERO para que el timeout no quede enmascarado
      // por un error propio de la función que ocurra casi simultáneamente
      if (controller.signal.aborted) {
        throw new Error("Execution timeout (5 min exceeded)");
      }
      console.error("Function execution error:", err);
      throw err;
    } finally {
      clearTimeout(timer);
    }

    // Validar salida con Zod
    const parsed = schemaResult.safeParse(fnresult);
    if (!parsed.success) {
      const errors = parsed.error.flatten();
      console.error("Response validation errors:", errors);
      $_REPLY_.code(500).send(errors);
      return;
    }

    // Respuesta válida
    setCacheReply($_REPLY_, fnresult.data);
    $_REPLY_.code(fnresult.code || 200).send(fnresult.data);
  } catch (err) {
    replyException($_REQUEST_, $_REPLY_, err);

  }
};
