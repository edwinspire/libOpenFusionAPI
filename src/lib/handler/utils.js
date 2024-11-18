export const setCacheReply = (reply, data) => {
  if (
    reply.openfusionapi.lastResponse &&
    reply.openfusionapi.lastResponse.hash_request
  ) {
    reply.openfusionapi.lastResponse.data = data;
  }

  return reply;
};
