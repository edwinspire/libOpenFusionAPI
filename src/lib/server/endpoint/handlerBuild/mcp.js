import { getServer, jsonSchemaToZod } from "../../mcp/server.js";
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

  const getAccessLevelLabel = (access) => {
    switch (access) {
      case 0:
        return "Public (no authentication)";
      case 1:
        return "Basic authentication";
      case 2:
        return "Token authentication";
      case 3:
        return "Basic + Token authentication";
      case 4:
        return "Local only";
      default:
        return "Unknown";
    }
  };

  const stringifySafe = (value, fallback = "{}") => {
    if (value === undefined || value === null) return fallback;
    try {
      return JSON.stringify(value, null, 2);
    } catch (_error) {
      return fallback;
    }
  };

  const isEmptyObject = (value) => {
    return (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    );
  };

  const isSchemaTooGeneric = (schema) => {
    if (!schema || typeof schema !== "object") return true;
    if (isEmptyObject(schema)) return true;

    const schemaKeys = Object.keys(schema);
    if (schemaKeys.length === 1 && schema.additionalProperties === true) return true;

    return (
      schema.type === "object" &&
      isEmptyObject(schema.properties) &&
      schema.additionalProperties === true
    );
  };

  const inferSchemaFromExample = (value) => {
    if (value === null) return { type: "null" };

    if (Array.isArray(value)) {
      if (value.length === 0) return { type: "array", items: {} };
      return {
        type: "array",
        items: inferSchemaFromExample(value[0]),
      };
    }

    const valueType = typeof value;
    if (valueType === "string") return { type: "string" };
    if (valueType === "number") return Number.isInteger(value) ? { type: "integer" } : { type: "number" };
    if (valueType === "boolean") return { type: "boolean" };

    if (valueType === "object") {
      const properties = {};
      const required = [];
      for (const [key, nestedValue] of Object.entries(value)) {
        properties[key] = inferSchemaFromExample(nestedValue);
        required.push(key);
      }
      return {
        type: "object",
        properties,
        additionalProperties: false,
        ...(required.length > 0 ? { required } : {}),
      };
    }

    return {};
  };

  const buildExampleFromSchema = (schema, depth = 0) => {
    if (!schema || typeof schema !== "object") return null;
    if (depth > 5) return null;

    const explicitExample = schema.example ?? schema.default;
    if (explicitExample !== undefined) return explicitExample;

    if (Array.isArray(schema.enum) && schema.enum.length > 0) {
      return schema.enum[0];
    }

    const schemaType = Array.isArray(schema.type) ? schema.type.find((t) => t !== "null") : schema.type;

    switch (schemaType) {
      case "string": {
        if (schema.format === "uuid") return "00000000-0000-0000-0000-000000000000";
        if (schema.format === "date-time") return "2026-01-01T00:00:00.000Z";
        if (schema.pattern && schema.pattern.includes("a-zA-Z0-9_~.\\-")) return "example_value";
        return "string";
      }
      case "integer":
      case "number":
        return 0;
      case "boolean":
        return false;
      case "array": {
        const itemExample = buildExampleFromSchema(schema.items, depth + 1);
        return itemExample === null || itemExample === undefined ? [] : [itemExample];
      }
      case "object": {
        const out = {};
        const properties = schema.properties && typeof schema.properties === "object"
          ? schema.properties
          : {};
        const required = Array.isArray(schema.required) ? schema.required : [];
        const selectedKeys = required.length > 0 ? required : Object.keys(properties).slice(0, 4);

        for (const key of selectedKeys) {
          if (!properties[key]) continue;
          const child = buildExampleFromSchema(properties[key], depth + 1);
          if (child !== undefined) out[key] = child;
        }

        return out;
      }
      default:
        return null;
    }
  };

  const normalizeToolKey = (name) => {
    return sanitizeToolName(name ?? "", "").toLowerCase();
  };

  const TOOL_DOC_OVERRIDES = {
    get_endpoint_data: {
      description:
        "Returns detailed data for a specific endpoint, including its configuration, metadata and runtime-relevant fields. Use this tool to inspect endpoint settings before updating or debugging.",
      notes: [
        "Send the application identifier in `idapp` exactly as defined in the input schema.",
        "Use this response as a read-before-write step prior to endpoint_upsert changes.",
      ],
    },
    app_vars: {
      description:
        "Obtains the list of application variables for the given `idapp`.",
      notes: [
        "The parameter name is `idapp` (not `iadpp`).",
        "Values may be serialized depending on each variable `type`.",
      ],
    },
    availables_functions_modules: {
      description:
        "Retrieves all available internal functions and modules that can be referenced by endpoints using the `JS` handler.",
      notes: [
        "Useful to validate allowed imports/helpers before publishing JS endpoints.",
        "Some legacy deployments may expose the internal path with historical typos; the MCP tool name remains stable.",
      ],
    },
    app_endpoints: {
      description:
        "Retrieves all endpoints associated with one application (`idapp`) with their key metadata.",
    },
    apps_list: {
      description:
        "Retrieves all applications with their application variables and related endpoints.",
    },
    endpoint_change_history: {
      description:
        "Returns the ordered change history of an endpoint, useful for audits and rollback analysis.",
      notes: [
        "Entries are typically ordered by newest-first unless the backend configuration defines otherwise.",
      ],
    },
    get_app_list_filters: {
      description:
        "Returns applications and nested endpoint data using the provided filters.",
      notes: [
        "When multiple filters are sent, backends commonly evaluate them as AND conditions.",
      ],
    },
    appvar_upsert: {
      description:
        "Creates or updates an application variable for a target `idapp` and `environment`.",
      notes: [
        "`value` is sent as string in this contract; serialize JSON when storing structured data.",
      ],
    },
    upsert_sql_endpoint_handler: {
      description:
        "Creates or updates SQL-based endpoints (CRUD/query) with Sequelize-compatible database configuration.",
      notes: [
        "Prefer this specialized tool for SQL handler setup; use endpoint_upsert for generic multi-handler updates.",
      ],
    },
  };

  const getToolDocOverride = (safeToolName) => {
    if (!safeToolName) return null;
    return TOOL_DOC_OVERRIDES[normalizeToolKey(safeToolName)] ?? null;
  };

  const toPrettyText = (value, fallback = "No example available.") => {
    if (value === undefined || value === null) return fallback;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length === 0) return fallback;
      try {
        return JSON.stringify(JSON.parse(trimmed), null, 2);
      } catch (_error) {
        return trimmed;
      }
    }
    if (typeof value === "object") {
      if (Array.isArray(value) && value.length === 0) return fallback;
      if (!Array.isArray(value) && Object.keys(value).length === 0) return fallback;
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const sanitizeToolName = (name, fallback = "tool") => {
    const raw = (name ?? fallback).toString().trim();
    const cleaned = raw
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_.-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^[_\-.]+|[_\-.]+$/g, "");
    return cleaned.length > 0 ? cleaned : fallback;
  };

  const normalizeSchemaForZod = (schema) => {
    if (!schema || typeof schema !== "object") return schema;

    const UNSUPPORTED_KEYS = new Set([
      "if",
      "then",
      "else",
      "anyOf",
      "allOf",
      "oneOf",
      "not",
      "dependentSchemas",
      "unevaluatedProperties",
      "patternProperties",
      "prefixItems",
      "contains",
      "$defs",
      "definitions",
    ]);

    const visit = (node) => {
      if (Array.isArray(node)) return node.map(visit);
      if (!node || typeof node !== "object") return node;

      const out = {};
      for (const [key, value] of Object.entries(node)) {
        if (UNSUPPORTED_KEYS.has(key)) continue;
        out[key] = visit(value);
      }

      if (out.type === "object") {
        if (!out.properties || typeof out.properties !== "object") {
          out.properties = {};
        }

        if (Array.isArray(out.required) && out.required.length > 0) {
          out.required = out.required.filter((k) => out.properties?.[k]);
          if (out.required.length === 0) delete out.required;
        }
      }

      return out;
    };

    return visit(schema);
  };

  const isEndpointUpsertEndpoint = (endpoint) => {
    const mcpName = (endpoint?.mcp?.name ?? "").toString().trim().toLowerCase();
    return (
      mcpName === "endpoint_upsert" ||
      (
        endpoint?.resource === "/api/endpoint" &&
        endpoint?.method === "POST" &&
        endpoint?.code === "fnEndpointUpsert"
      )
    );
  };

  const getEndpointUpsertHandlerGuide = (endpoint) => {
    if (!isEndpointUpsertEndpoint(endpoint)) return "";

    return `
## How to use endpoint_upsert (Agent Guide)

### INSERT vs UPDATE
- **INSERT**: omit \`idendpoint\` — the server generates a new UUID automatically.
- **UPDATE**: include a valid \`idendpoint\` UUID. Use \`get_endpoint_data\` first to read the current state before modifying.

### Minimum Required Fields (all handlers)
\`idapp\`, \`environment\` (dev|qa|prd), \`resource\` (e.g. \`/mypath\`), \`method\` (GET|POST|PUT|DELETE|PATCH), \`handler\`, \`access\`, \`title\`, \`description\`, \`code\`, \`timeout\` (default 30), \`cache_time\` (default 0).

### access levels
- \`0\` = Public (no authentication required)
- \`1\` = Basic Auth
- \`2\` = Bearer Token (default — recommended for private endpoints)
- \`3\` = Basic + Token
- \`4\` = Local only

### Handler → code convention

| handler | What to put in \`code\` |
|---------|----------------------|
| \`JS\` | JavaScript source (see JS rules below) |
| \`FUNCTION\` | Internal function name, e.g. \`fnMyFunction\` |
| \`FETCH\` | Target URL string to proxy, e.g. \`https://api.example.com/data\` |
| \`TEXT\` | JSON string: \`{"content":"hello","mime":"text/plain"}\` |
| \`SQL\` | Standard String SQL query (\`SELECT * FROM table\`). Connection config goes in \`custom_data\` (JSON string) |
| \`SQL_BULK_I\` | JSON with \`table_name\`, \`config\`, optionally \`ignoreDuplicates\` |
| \`SOAP\` | JSON with \`wsdl\`, \`functionName\`, \`RequestArgs\` |
| \`HANA\` | JSON with HANA connection + SQL query |
| \`MONGODB\` | JSON with Mongo config + VM logic |

### ⚠️ SQL handler Binds
For parametrized SQL, use named bindings prefixed with a colon (e.g. \`SELECT * FROM tbl WHERE id = :id\`). For GET, query params match automatically. For POST, send a JSON body with a \`bind\` object: \`{"bind": {"id": 1}}\`.

### ⚠️ CRITICAL: JS handler — do NOT use \`return\`

The JS handler runs inside a Node.js VM sandbox. To return data you MUST assign **\`$_RETURN_DATA_\`**.
Using \`return\` compiles silently but the endpoint always responds with \`{}\` (empty object).

**✅ Correct JS code example:**
\`\`\`javascript
// Returns current ISO datetime
$_RETURN_DATA_ = {
  datetime: new Date().toISOString(),
  timestamp: Date.now()
};
\`\`\`

**❌ Wrong (produces empty {} response):**
\`\`\`javascript
return { datetime: new Date().toISOString() };
\`\`\`

**Reading request data in JS:**
\`\`\`javascript
const body    = request.body && request.body.json ? request.body.json : request.body; // POST/PUT body
const query   = request.query;   // URL query params
const headers = request.headers; // Request headers
\`\`\`

**Returning custom headers in JS:**
\`\`\`javascript
let h = new Map();
h.set("X-My-Header", "value");
$_RETURN_DATA_ = { result: 42 };
$_CUSTOM_HEADERS_ = h;
\`\`\`

### Recommended workflow

1. Call \`handler_documentation\` with the chosen handler for extended docs.
2. Build the \`code\` field following the table above.
3. Run \`endpoint_upsert\` with all required fields.
4. Call \`get_endpoint_data\` to verify the persisted structure.
5. Test the endpoint via its HTTP URL before exposing it as an MCP tool.
`;
  };

  const getEndpointUpsertDescriptionAddon = (endpoint) => {
    if (!isEndpointUpsertEndpoint(endpoint)) return "";

    return " Handler-Specific Guide (endpoint_upsert): `handler` defines the shape of `code` and related fields. FUNCTION => `code` is function identifier/string. JS => `code` is JavaScript source. SQL/FETCH/SOAP/HANA/MONGODB/TEXT/SQL_BULK_I => `code` is handler config object. MCP/TELEGRAM_BOT/AGENT_IA/NA => use only for those specialized integrations. Recommended agent workflow: choose handler first, then build payload structure for that handler.";
  };

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
    toolName = sanitizeToolName(toolName, "endpoint_tool");

    const mcpNameRaw = endpoint?.mcp?.name && endpoint?.mcp?.name.length > 0
      ? endpoint.mcp.name
      : toolName;
    const safeToolName = sanitizeToolName(mcpNameRaw, toolName);

    const inputSchema = endpoint?.json_schema?.in?.schema ?? {};
    const outputSchema = endpoint?.json_schema?.out?.schema ?? {};
    const inputSchemaNormalized = normalizeSchemaForZod(inputSchema);
    const schemaWasNormalized = stringifySafe(inputSchemaNormalized) !== stringifySafe(inputSchema);
    const override = getToolDocOverride(safeToolName);
    const rawExampleRequest = endpoint?.data_test?.body?.json?.code;
    const rawExampleResponse = endpoint?.data_test?.last_response?.data;
    const generatedRequestExample = buildExampleFromSchema(inputSchema);
    const generatedResponseExample = buildExampleFromSchema(outputSchema);
    const exampleRequest = rawExampleRequest ?? generatedRequestExample;
    const exampleResponse = rawExampleResponse ?? generatedResponseExample;
    const inferredOutputSchemaFromExample =
      (rawExampleResponse !== undefined && rawExampleResponse !== null)
        ? inferSchemaFromExample(rawExampleResponse)
        : null;
    const effectiveOutputSchema = isSchemaTooGeneric(outputSchema)
      ? (inferredOutputSchemaFromExample ?? outputSchema)
      : outputSchema;
    const outputSchemaWasInferred =
      isSchemaTooGeneric(outputSchema) &&
      inferredOutputSchemaFromExample &&
      !isSchemaTooGeneric(inferredOutputSchemaFromExample);
    const varsDeprecated =
      endpoint?.json_schema?.in?.schema?.properties?.vars?.deprecated === true;
    const endpointUpsertHandlerGuide = getEndpointUpsertHandlerGuide(endpoint);
    const endpointUpsertDescriptionAddon = getEndpointUpsertDescriptionAddon(endpoint);
    const baseDescription = endpoint?.mcp?.description && endpoint?.mcp?.description.length > 0
      ? endpoint?.mcp?.description
      : endpoint.description;
    const effectiveDescription = override?.description ?? baseDescription;

    // Bug fix #5: Uso de optional chaining para evitar TypeError si mcp.title/description no existen
    markdown_api_docs.push(`##
## Endpoint
**${endpoint?.mcp?.name && endpoint?.mcp?.name.length > 0
        ? endpoint?.mcp?.name
        : toolName}** 

**MCP Tool Name (safe)**
${safeToolName}

### Description
${effectiveDescription}

  

This endpoint belongs to application **${app_name}** and is exposed to MCP agents.

  

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
${getAccessLevelLabel(endpoint.access)}

------------------------------------------------------------------------

  
# Input Parameters

### JSON Schema

\`\`\` json

${stringifySafe(inputSchema)}

\`\`\`

------------------------------------------------------------------------
  

# Example Request

\`\`\` json

${toPrettyText(exampleRequest)}

\`\`\`

  

------------------------------------------------------------------------

  

# Response  

### JSON Schema

\`\`\` json

${stringifySafe(effectiveOutputSchema)}

      \`\`\`
------------------------------------------------------------------------

  

# Example Response


  \`\`\` json

${toPrettyText(exampleResponse)}

    \`\`\`

  

------------------------------------------------------------------------

  

# Behavior Notes(for AI Agents)

  - Use this tool only with fields defined in the input schema.
  - If schema marks a field as deprecated, avoid it for new integrations.
  - Access level above indicates if credentials are required.
  ${schemaWasNormalized ? "- Internal runtime validation schema was normalized for MCP compatibility (unsupported JSON Schema keywords removed)." : "- Runtime validation uses the published JSON schema directly."}
  ${outputSchemaWasInferred ? "- Output schema was inferred from a real example response because the declared output schema is too generic." : "- Output schema is documented as declared by the endpoint contract."}
  ${varsDeprecated ? "- Field `vars` is deprecated (compatibility only). Use appvar_upsert for new app variables." : "- Validate required fields before sending the request."}
  ${(override?.notes ?? []).map((note) => `- ${note}`).join("\n  ")}

${endpointUpsertHandlerGuide}
`);

    let zod_inputSchema = z.object({}).describe("Data to send to the endpoint.");

    if (
      endpoint?.json_schema?.in?.enabled &&
      endpoint?.json_schema?.in?.schema
    ) {
      try {
        const zodSchema = jsonSchemaToZod(inputSchemaNormalized);
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
        zod_inputSchema = z.object({}).passthrough().describe(
          "Flexible input due to unsupported JSON Schema features.",
        );
      }
    }

    server.registerTool(
      safeToolName,
      {
        title:
          endpoint?.mcp?.title && endpoint?.mcp?.title.length > 0
            ? endpoint?.mcp?.title
            : endpoint.description,
        description: `${endpoint.access == 0 ? "Public" : "Private"}  ${endpoint?.mcp?.description && endpoint?.mcp?.description.length > 0
            ? (override?.description ?? endpoint?.mcp?.description)
            : (override?.description ?? endpoint.description)
          }${endpointUpsertDescriptionAddon} `,

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
  sanitizeToolName("list_api_endpoints_" + app_name, "list_api_endpoints"),
  {
    title: "List API endpoints for " + app_name + " on " + environment + " environment",
    description: "Return documentation for all API endpoints for application '" + app_name + "' on '" + environment + "' environment.",
    inputSchema: z.object({}),
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
