import { replyException } from "./utils.js";

export const botTelegramFunction = async (context) => {
  const request = context?.request;
  const reply = context?.reply;
  const method = context?.method || context?.endpoint;
  try {
    let f;


    let result_fn = { bot: 'ok', data: null, headers: null };

    if (
      reply.openfusionapi.lastResponse &&
      reply.openfusionapi.lastResponse.hash_request
    ) {
      reply.openfusionapi.lastResponse.data = result_fn.data;
    }

    if (result_fn.headers && result_fn.headers.size > 0) {
      for (const [key, value] of result_fn.headers) {
        //console.log(`${key}: ${value}`);
        reply.header(key, value);
      }
    }

    reply.code(200).send(result_fn.data);
  } catch (error) {

    replyException(request, reply, error);

  }
};
