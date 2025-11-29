import {
  StreamableHTTPServerTransport,
} from "../server/mcp/server.js";


export const mcpFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ reply,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method
) => {
  try {
    const server = request.openfusionapi.handler.params.server_mcp(
      request.headers
    );

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    reply.raw.on("close", () => {
      console.log("Request closed");
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(request, reply.raw, request.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!reply.headersSent) {
      reply.status(500).send({
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
