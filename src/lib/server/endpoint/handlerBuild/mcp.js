import { getServer, jsonSchemaToZod, ResourceTemplate } from "../../mcp/server.js";
import { getApplicationTreeByFilters } from "../../../db/app.js";
import { internal_url_endpoint } from "../../utils_path.js";
import * as z from "zod";
//import uFetch from "@edwinspire/universal-fetch";
import { URLAutoEnvironment } from "../../functionVars.js";

export const CreateMCPHandler = async (app_name, environment) => {

  let app = await getApplicationTreeByFilters({
    app: app_name,
    enabled: true,
    endpoint: {
      enabled: true,
      environment: environment,
    },
  });

  // FIX CRITICO: El server se crea UNA SOLA VEZ aquí, fuera de la factory (headers) =>.
  // Antes estaba dentro, lo que creaba un nuevo McpServer en cada request HTTP,
  // perdiendo las tools registradas en requests anteriores → respuesta vacía al llamar tools.
  const server = getServer();

  // Objeto mutable compartido: cada request HTTP actualiza los headers aquí,
  // y las tool callbacks los leen en tiempo de ejecución (closure por referencia).
  const requestContext = { headers: {} };

  // Bug fix #1: Validar que app y app.endpoints existan antes de filtrar
  if (!app || !Array.isArray(app?.endpoints)) {
    console.warn("[MCP] No se encontraron endpoints para la aplicación:", app_name);
    // Retorna la factory aunque no haya tools, para no romper el flujo
    return (_headers) => {
      requestContext.headers = _headers ?? {};
      return server;
    };
  }

  let mcp_endpoint_tools = app.endpoints.filter((endpoint) => {
    return (
      endpoint.method != "WS" &&
      endpoint.handler != "MCP" &&
      endpoint?.mcp?.enabled
    );
  });

  let markdown_api_docs = [];

  for (let index2 = 0; index2 < mcp_endpoint_tools.length; index2++) {
    const endpoint = mcp_endpoint_tools[index2];

    let url_internal = internal_url_endpoint(
      app.app,
      endpoint.resource,
      endpoint.environment,
      false
    );

    // Bug fix #4: toolName único por URL+METHOD para evitar colisiones
    let toolName = url_internal.replace(/[^a-zA-Z0-9]/g, "_");
    toolName = `${toolName}_${endpoint.method}`;

    // Bug fix #5: Uso de optional chaining para evitar TypeError si mcp.title/description no existen
    markdown_api_docs.push(`##
## Endpoint
**${endpoint?.mcp?.name && endpoint?.mcp?.name.length > 0
        ? endpoint?.mcp?.name
        : toolName}** 

### Description
${endpoint?.mcp?.description && endpoint?.mcp?.description.length > 0
        ? endpoint?.mcp?.description
        : endpoint.description}

  

This endpoint is designed as a simple arithmetic demonstration for

development and testing purposes.

  

------------------------------------------------------------------------

## Environment
 ${endpoint.environment}

------------------------------------------------------------------------
## HTTP Request

**Method**
${endpoint.method}

**URL**
${url_internal}

------------------------------------------------------------------------

## Access Level
${endpoint.access == 0 ? "Public" : "Private (require authentication)"}

------------------------------------------------------------------------

  
# Input Parameters

### JSON Schema

\`\`\` json

${JSON.stringify( endpoint?.json_schema?.in?.schema, null, 2)}

\`\`\`

------------------------------------------------------------------------
  

# Example Request

  

------------------------------------------------------------------------

  

# Response  

### JSON Schema

\`\`\` json

${JSON.stringify(endpoint?.json_schema?.out?.schema, null, 2)}

      \`\`\`
------------------------------------------------------------------------

  

# Example Response



      \`\`\` json



        \`\`\`

  

------------------------------------------------------------------------

  

# Behavior Notes(for AI Agents)

      - This endpoint performs a ** deterministic operation **.
`);

    let zod_inputSchema = z.object({}).describe("Data to send to the endpoint.");

    if (
      endpoint?.json_schema?.in?.enabled &&
      endpoint?.json_schema?.in?.schema
    ) {
      try {
        const zodSchema = jsonSchemaToZod(endpoint.json_schema.in.schema);
        if (zodSchema instanceof z.ZodObject) {
          zod_inputSchema = zodSchema;
        } else {
          zod_inputSchema = z.object({ value: zodSchema });
        }
      } catch (error) {
        console.warn(
          `[MCP] Schema no soportado para ${endpoint.method} ${endpoint.resource}. Se usa schema flexible.`,
          error?.message || error,
        );
        zod_inputSchema = z.record(z.unknown()).describe(
          "Flexible input due to unsupported JSON Schema features.",
        );
      }
    }

    server.registerTool(
      endpoint?.mcp?.name && endpoint?.mcp?.name.length > 0
        ? endpoint?.mcp?.name
        : toolName,
      {
        title:
          endpoint?.mcp?.title && endpoint?.mcp?.title.length > 0
            ? endpoint?.mcp?.title
            : endpoint.description,
        description: `${endpoint.access == 0 ? "Public" : "Private"}  ${endpoint?.mcp?.description && endpoint?.mcp?.description.length > 0
            ? endpoint?.mcp?.description
            : endpoint.description
          } `,

        inputSchema: zod_inputSchema,
      },

      async (data, _context) => {
        // Los headers se leen del contexto compartido actualizado en cada request HTTP
        const currentHeaders = requestContext.headers;

        try {
          let AutoURL = new URLAutoEnvironment({
            environment: endpoint.environment,
          });

          let uF = AutoURL.auto(url_internal, true);

          // Bug fix #6: El método podría no existir en uF; se captura en el catch
          let request_endpoint = await uF[endpoint.method.toUpperCase()]({
            data: data,
            headers: currentHeaders,
          });

          // Bug fix #2: mimeType puede ser null si el header no está presente
          const mimeType = request_endpoint.headers.get("content-type") ?? "text/plain";

          // Bug fix #3: data_out se obtiene dentro del try para capturar errores
          const data_out = await request_endpoint.text();

          return {
            content: [
              {
                type: "text",
                mimeType: mimeType,
                text: data_out,
                statusCode: request_endpoint.status,
              },
            ],
          };
        } catch (error) {
          console.error(`[MCP] Error al llamar al endpoint ${url_internal}: `, error);
          return {
            content: [
              {
                type: "text",
                mimeType: "text/plain",
                text: `Error: ${error?.message || "Error desconocido al llamar al endpoint."} `,
                statusCode: 500,
              },
            ],
          };
        }
      }
    );

  }

  // URI con path explícito: new URL("api://docs/demo").toString() === "api://docs/demo"
  // Si el URI no tiene path (ej: "api://docs-demo"), new URL() añade "/" final → no coincide con la clave registrada
  const resourceURI = "api://docs/" + app_name;
  const md_resource = `
# API Documentation for ${app_name} on ${environment} environment

${markdown_api_docs.join("\n")}

    `;

  server.registerResource(
    "api-docs-" + app_name,
    resourceURI,
    {
      description: "API Documentation for " + app_name + " on " + environment + " environment",
      mimeType: "text/markdown",
    },
    async (_uri, _extra) => {

      return {
        contents: [
          {
            uri: resourceURI,
            mimeType: "text/markdown",
            text: md_resource
          }
        ]
      }
    }
  )

server.registerTool(
  "list_api_endpoints_" + app_name,
  {
    title: "List API endpoints for " + app_name + " on " + environment + " environment",
    description: "Return documentation for all API endpoints for application '" + app_name + "' on '" + environment + "' environment.",
    inputSchema: z.object({}).shape,
    annotations: { readOnlyHint: true },
  },
  async () => ({
    content: [
      {
        type: "text",
        text: md_resource,
      },
    ],
  })
);

  // La factory devuelta solo actualiza los headers por request — el server ya tiene las tools registradas
  return (headers) => {
    requestContext.headers = headers ?? {};
    return server;
  };
};
