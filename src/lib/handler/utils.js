export const setCacheReply = (reply, data) => {
  if (reply) {
    if (!reply.openfusionapi) {
      reply.openfusionapi = { lastResponse: { data: data } };
    }

    if (reply.openfusionapi.lastResponse) {
      reply.openfusionapi.lastResponse.data = data;
    } else {
      reply.openfusionapi.lastResponse = { data: data };
    }
  }
  return reply;
};

export const getHandlerExecutionContext = (context) => {
  return {
    request: context?.request,
    reply: context?.reply,
    method: context?.method || context?.endpoint,
    endpoint: context?.endpoint || context?.method,
    server_data: context?.server_data,
  };
};

export const sendHandlerResponse = (
  reply,
  { statusCode = 200, data = null, cache = true, headers, contentType } = {},
) => {
  if (headers) {
    const isObjectLike = typeof headers === "object" && headers !== null;
    const isIterable =
      isObjectLike && typeof headers[Symbol.iterator] === "function";

    if (isIterable) {
      for (const [key, value] of headers) {
        reply.header(key, value);
      }
    } else if (isObjectLike) {
      for (const [key, value] of Object.entries(headers)) {
        reply.header(key, value);
      }
    } else {
      console.warn(
        "sendHandlerResponse: headers ignored because they are not iterable/object",
      );
    }
  }

  if (contentType) {
    reply.type(contentType);
  }

  if (cache) {
    setCacheReply(reply, data);
  }

  reply.code(statusCode).send(data);
};

export const sendHandlerError = (reply, statusCode, error, extra = {}) => {
  reply.code(statusCode).send({ error, ...extra });
};

export const isValidHttpStatusCode = (code) => {
  // Lista de rangos válidos para códigos de estado HTTP
  const validRanges = [
    [100, 199], // Informativos
    [200, 299], // Éxito
    [300, 399], // Redirección
    [400, 499], // Errores del cliente
    [500, 599], // Errores del servidor
  ];

  // Verifica si el número está dentro de alguno de los rangos válidos
  return validRanges.some(([min, max]) => code >= min && code <= max);
};

export const replyException = (request, reply, error) => {
  console.trace(error);
  let trace_id = request?.headers?.["ofapi-trace-id"] || "";

  if (reply.openfusionapi?.lastResponse) {
    reply.openfusionapi.lastResponse.exception = error;
  }

  const statusCode =
    typeof error === "object" && error?.statusCode != null
      ? error.statusCode
      : 500;

  const message =
    typeof error === "string"
      ? error
      : error?.message || "Internal Server Error";

  if (message == "" && typeof error === "object") {
    // Este se lo puso para el caso de errores de sequelize que a veces no tienen mensaje pero si un array de errores con mensajes adentro
    message =
      Array.isArray(error?.parent?.errors) && error.parent.errors.length > 0
        ? error.parent.errors.map((e) => e.message).join(", ")
        : "Internal Server Error.";
  }

  reply.code(statusCode).send({ error: message, trace_id });
  return;
};
