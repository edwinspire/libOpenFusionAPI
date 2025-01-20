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


export const createFunction = (
  /** @type {string} */ code,
  /** @type {string} */ app_vars
) => {
  let app_vars_string = "";

  if (app_vars && typeof app_vars === "object") {
    app_vars_string = `const $_VARS_APP = ${JSON.stringify(app_vars, null, 2)}`;
  }

  let codefunction = `
return async()=>{
  ${app_vars_string}  
  const {$_REQUEST_, $_UFETCH_, $_SECUENTIAL_PROMISES_, $_REPLY_, $_GEN_TOKEN_, $_GET_INTERNAL_URL_, $_FETCH_OFAPI_,  $_MONGODB_} = $_VARS_;
  let $_RETURN_DATA_ = {};
  ${code}
  return $_RETURN_DATA_;  
}
`;

  return new Function("$_VARS_", codefunction);
};