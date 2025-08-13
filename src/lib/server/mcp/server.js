import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

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

  /*
  // Add an addition tool
  server.registerTool(
    "saludo",
    {
      title: "Saludo Tool",
      description: "Genera un saludo personalizado con nombre y edad, fecha de iniccio y fin del ultimo trabajo",
      inputSchema: {
        a: z.object({
          name: z.string(),
          age: z.number(),
          date: { start: z.string().describe("Fecha de inicio de trabajo"), end: z.string().describe("Fecha de fin trabajo") },
        }).describe("Datos del usuario")
      },
    },
    async ({ a }) => ({
      content: [
        { type: "text", text: `Hello, ${a.name}! You are ${a.age} years old.` },
        { type: "text", text: `Your work period was from ${a.date.start} to ${a.date.end}.` },
      ],
    })
  );
  */

  /*
  // Add a dynamic greeting resource
  server.registerResource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    {
      title: "Greeting Resource", // Display name for UI
      description: "Dynamic greeting generator",
    },
    async (uri, { name }) => ({
      contents: [
        {
          uri: uri.href,
          text: `Hello, ${name}!`,
        },
      ],
    })
  );
  */

  return server;
}

//console.log("Worker MCP Server iniciado");

// Start receiving messages on stdin and sending messages on stdout
//const transport = new StdioServerTransport();
//await server.connect(transport);
//export default server;
export {
  getServer,
  StdioServerTransport,
  ResourceTemplate,
  StreamableHTTPServerTransport,
};
