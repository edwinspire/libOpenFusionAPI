import {
  StreamableHTTPServerTransport,
} from "../server/mcp/server.js";


export const mcpFunction = async (context) => {
  const request = context?.request;
  const reply = context?.reply;
  const trace_id = request.headers["ofapi-trace-id"];

  try {
    const serverFactory = request.openfusionapi?.handler?.params?.server_mcp;

    if (typeof serverFactory !== "function") {
      throw new Error(
        "MCP Server factory (server_mcp) is not properly defined in handler params."
      );
    }

    const server = serverFactory(request.headers);

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    reply.raw.on("close", () => {
      transport?.close?.();
      server?.close?.();
    });
    await server.connect(transport);
    await transport.handleRequest(request.raw, reply.raw, request.body);
  } catch (error) {
    const errorMessage = `MCP Server initialization failed: ${error.message}`;
    console.error(`[MCP_ERROR] [TraceID: ${trace_id}] ${errorMessage}`, error);

    // Ensure the error is captured by the system logger
    if (reply.openfusionapi) {
      if (!reply.openfusionapi.lastResponse) reply.openfusionapi.lastResponse = {};
      reply.openfusionapi.lastResponse.exception = error.message;
      reply.openfusionapi.lastResponse.data = { error: errorMessage, trace_id };
    }

    if (!reply.sent) {
      reply.code(500).send({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: errorMessage,
          data: {
            trace_id: trace_id,
            suggestion: "Please provide this trace_id to the administrator for further analysis.",
          },
        },
        id: null,
      });
    }
  }
};
