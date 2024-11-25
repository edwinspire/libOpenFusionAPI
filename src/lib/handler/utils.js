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
