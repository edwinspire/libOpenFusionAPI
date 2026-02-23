import { setCacheReply, replyException } from "./utils.js";

const VALID_DATA_TYPES = new Set(["object", "array", "boolean", "string", "number", "null"]);

/**
 * Validates that fnresult has the expected shape: { code: number, data: any }
 * Equivalent to the previous Zod schema — zero external dependencies.
 */
function validateFnResult(result) {
  if (result === null || typeof result !== "object") {
    return { success: false, error: "Function result must be an object" };
  }
  if (typeof result.code !== "number") {
    return { success: false, error: `'code' must be a number, got: ${typeof result.code}` };
  }
  const dataType = result.data === null ? "null" : Array.isArray(result.data) ? "array" : typeof result.data;
  if (!VALID_DATA_TYPES.has(dataType)) {
    return { success: false, error: `'data' has unsupported type: ${dataType}` };
  }
  return { success: true };
}

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

    // Validar salida
    const parsed = validateFnResult(fnresult);
    if (!parsed.success) {
      console.error("Response validation errors:", parsed.error);
      $_REPLY_.code(500).send({ error: parsed.error });
      return;
    }

    // Respuesta válida
    setCacheReply($_REPLY_, fnresult.data);
    $_REPLY_.code(fnresult.code || 200).send(fnresult.data);
  } catch (err) {
    replyException($_REQUEST_, $_REPLY_, err);

  }
};
