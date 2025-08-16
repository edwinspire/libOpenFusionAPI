import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

function getServer(app) {
  // Create an MCP server
  const server = new McpServer({
    name: "OpenFusionAPI MCP Server",
    version: "1.0.0",
  });

  /*
  // Add an addition tool
  server.registerTool(
    "add",
    {
      title: "Addition Tool",
      description: "Add two numbers",
      inputSchema: {
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
      },
    },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }],
    })
  );
  */


  return server;
}


export {
  getServer,
  StdioServerTransport,
  ResourceTemplate,
  StreamableHTTPServerTransport,
};
