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
