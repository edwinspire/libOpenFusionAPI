import {
  StreamableHTTPServerTransport,
} from "../server/mcp/server.js";


export const mcpFunction = async (context) => {
  const request = context?.request;
  const reply = context?.reply;
  const method = context?.method || context?.endpoint;
  const server_data = context?.server_data;
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
      console.log("Request closed");
      transport?.close?.();
      server?.close?.();
    });
    await server.connect(transport);
    await transport.handleRequest(request.raw, reply.raw, request.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!reply.sent) {
      reply.code(500).send({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "MCP: Internal server error",
        },
        id: null,
      });
    }
  }
};
