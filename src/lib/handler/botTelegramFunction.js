import {
  getHandlerExecutionContext,
  replyException,
  sendHandlerResponse,
} from "./utils.js";

export const botTelegramFunction = async (context) => {
  const { request, reply } = getHandlerExecutionContext(context);
  try {
    let result_fn = { bot: 'ok', data: null, headers: null };

    const headers =
      result_fn.headers && result_fn.headers.size > 0
        ? Object.fromEntries(result_fn.headers)
        : undefined;

    sendHandlerResponse(reply, {
      statusCode: 200,
      data: result_fn.data,
      headers,
    });
  } catch (error) {
    replyException(request, reply, error);
  }
};
