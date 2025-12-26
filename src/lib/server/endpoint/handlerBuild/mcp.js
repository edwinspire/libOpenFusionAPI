import { getServer, jsonSchemaToZod } from "../../mcp/server.js";
import { getApplicationTreeByFilters } from "../../../db/app.js";
import { internal_url_endpoint } from "../../utils_path.js";
import * as z from "zod";
import uFetch from "@edwinspire/universal-fetch";

export const CreateMCPHandler = async (app_name, environment) => {
  let app = await getApplicationTreeByFilters({
    app: app_name,
    enabled: true,
    endpoint: {
      enabled: true,
      environment: environment,
    },
  });

  return (headers) => {
    const server = getServer();

    // TODO: Es posible que se pueda mejorar esta parte del código para que no sea necesario ejecutarlo en cada llamada.
    let mcp_endpoint_tools = app.endpoints.filter((endpoint) => {
      return (
        endpoint.method != "WS" &&
        endpoint.handler != "MCP" &&
        endpoint?.mcp?.enabled
      );
    });

    for (let index2 = 0; index2 < mcp_endpoint_tools.length; index2++) {
      const endpoint = mcp_endpoint_tools[index2];

      let url_internal = internal_url_endpoint(
        app.app,
        endpoint.resource,
        endpoint.environment,
        false
      );

      let zod_inputSchema = z.any().describe("Data to send to the endpoint.");

      if (
        endpoint?.json_schema?.in?.enabled &&
        endpoint?.json_schema?.in?.schema
      ) {
        // Convertir
        zod_inputSchema = jsonSchemaToZod(endpoint.json_schema.in.schema);
      }

      server.registerTool(
        endpoint?.mcp?.name && endpoint?.mcp?.name.length > 0
          ? endpoint?.mcp?.name
          : `${url_internal}[${endpoint.method}]`,
        {
          title:
            endpoint?.mcp?.title && endpoint?.mcp?.title.length > 0
              ? endpoint?.mcp?.title
              : endpoint.description,
          description: `${endpoint.access == 0 ? "Public" : "Private"}  ${
            endpoint?.mcp?.description && endpoint?.mcp?.description.length > 0
              ? endpoint?.mcp?.description
              : endpoint.description
          }`,

          inputSchema: zod_inputSchema,
        },

        async (data) => {
          //let auto_env = new URLAutoEnvironment();
          //let uF = auto_env.create(url_internal, false);
          let uF = new uFetch(url_internal);

          let request_endpoint = await uF[endpoint.method.toUpperCase()]({
            data: data,
            headers: headers,
          });
          const mimeType = request_endpoint.headers.get("content-type");
          let data_out = undefined;

          // TODO: los datos de salida siempre deben ser como texto aunque sea un objeto json.
          data_out = await request_endpoint.text();

          return {
            content: [
              {
                type: "text",
                mimeType: mimeType,
                text: data_out,
              },
            ],
          };
        }
      );
    }

    return server;
  };
};
