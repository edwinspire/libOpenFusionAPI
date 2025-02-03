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

export const jsException = (message, data, http_statusCode = 500) => {
  let status = isValidHttpStatusCode(http_statusCode) ? http_statusCode : 500;
  throw { message, data, date: new Date(), statusCode: status };
};

export const createFunction = (
  /** @type {string} */ code,
  /** @type {string} */ app_vars
) => {
  let app_vars_string = "";

  let fn = new Function("$_VARS_", "throw new Error('No code to execute');");

  try {
    if (app_vars && typeof app_vars === "object") {
      app_vars_string = `const $_VARS_APP = ${JSON.stringify(
        app_vars,
        null,
        2
      )}`;
    }

    let codefunction = `
return async()=>{
  ${app_vars_string}  
  const {$_REQUEST_, $_UFETCH_, $_SECUENTIAL_PROMISES_, $_REPLY_, $_GEN_TOKEN_, $_GET_INTERNAL_URL_, $_FETCH_OFAPI_,  $_MONGOOSE_, $_EXCEPTION_, $_LUXON_, $_SEQUELIZE_} = $_VARS_;
  let $_RETURN_DATA_ = {};
  ${code}
  return $_RETURN_DATA_;  
}
`;

    fn = new Function("$_VARS_", codefunction);
  } catch (error) {
    fn = new Function("", "throw new Error('Error creating function');");
  }

  return fn;
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
