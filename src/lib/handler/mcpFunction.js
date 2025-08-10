//import  {MCPServer, StreamableHTTPServerTransport}  from "./server/mcp/server.js";
import {
  getServer,
  StreamableHTTPServerTransport,
} from "../server/mcp/server.js";
import { z } from "zod";
import { getAppByName } from "../../lib/db/app.js"; // Import to ensure the database is initialized
import { URLAutoEnvironment, getParseMethod } from "../server/utils.js";
import { internal_url_endpoint } from "../server/utils_path.js"; // Import the internal_url_endpoint function

export const mcpFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ reply,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method
) => {
  try {
    //    console.log(request.openfusionapi.handler.params.app);

    let apps = await getAppByName(request.openfusionapi.handler.params.app);

    const server = getServer();

    for (let index = 0; index < apps.length; index++) {
      const app = apps[index];
      // console.log("App:", app);

      for (let index2 = 0; index2 < app.endpoints.length; index2++) {
        const endpoint = app.endpoints[index2];
        //  console.log("Endpoint:", endpoint);

        if (
          endpoint.enabled &&
          endpoint.environment == request.openfusionapi.handler.params.environment &&
          endpoint.method != "WS" &&
          endpoint.handler != "MCP" &&
          endpoint?.mcp?.enabled
        ) {
          let url_internal = internal_url_endpoint(
            app.app,
            endpoint.resource,
            endpoint.environment,
            false
          );

          server.registerTool(
            endpoint?.mcp?.name || `${url_internal} [${endpoint.method}]`,
            {
              title: endpoint?.mcp?.title || endpoint.description,
              description: `${
                endpoint.access == 0 ? "Public" : "Private"
              } Method: ${endpoint.method} Handler: ${endpoint.handler} ${
                endpoint.description
              }`,
              inputSchema: {
                data: z.any().describe("Data to send to the endpoint."),
              },
            },

            async (data) => {
              let auto_env = new URLAutoEnvironment();
              let uF = auto_env.create(url_internal, false);

              let request_endpoint = await uF[endpoint.method.toUpperCase()]({
                data: data.data,
                headers: request.headers,
              });
              const mimeType = request_endpoint.headers.get("content-type");
              let data_out = undefined;
              let parse_method = getParseMethod(mimeType);

              /*
              if (parse_method === "json") {
                // Do something with the custom header
                data_out = await request_endpoint.json();
                data_out = JSON.stringify(data_out, null, 2);
                console.log("Response from endpoint:", data_out);
              } else if (parse_method === "text") {
                data_out = await request_endpoint.text();
                console.log("Response from endpoint:", data_out);
              } else if (parse_method === "blob") {
                data_out = await request_endpoint.blob();
                // TODO: Es posible devolver la imagen en base 64
                console.log("Response from endpoint:", data_out);
              } else {
                data_out = await request_endpoint.text();
                console.log("Response from endpoint:", data_out);
              }
              */

              data_out = await request_endpoint.text();

              return {
                content: [
                  {
                    type: "text",
                    mimeType: mimeType,
                    text: data_out
                  },
                ],
              };
            }
          );
        }
      }
    }

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
