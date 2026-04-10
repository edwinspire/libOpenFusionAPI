import { getServer, jsonSchemaToZod } from "../../mcp/server.js";
import { getApplicationTreeByFilters } from "../../../db/app.js";
import { internal_url_endpoint } from "../../utils_path.js";
import * as z from "zod";
//import uFetch from "@edwinspire/universal-fetch";
import { URLAutoEnvironment } from "../../functionVars.js";

export const CreateMCPHandler = async (app_name, environment) => {

  const UNSUPPORTED_JSON_SCHEMA_KEYS = new Set([
    "if",
    "then",
    "else",
    "dependentSchemas",
    "unevaluatedProperties",
    "patternProperties",
    "prefixItems",
    "contains",
  ]);

  let app = await getApplicationTreeByFilters({
    app: app_name,
    enabled: true,
    endpoint: {
      enabled: true,
      environment: environment,
    },
  });

  // Fix 6: Las tools y los recursos se registran en variables locales y se añaden a un
  // nuevo McpServer en la función factory devuelta. De esta forma, cada request HTTP tiene
  // su propia instancia desconectada de transport permitiendo concurrencia, sin usar
  // cierres que sobrescriban variables globales como en requestContext.headers.
  const _mcpConfig = {
    tools: [],
    resources: []
  };

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

  const toCompactText = (value, fallback = "") => {
    if (value === undefined || value === null) return fallback;
    return String(value);
  };

  const isEmptyObject = (value) => {
    return (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    );
  };

  const collectUnsupportedKeywordPaths = (schema, currentPath = "$", results = []) => {
    if (Array.isArray(schema)) {
      schema.forEach((item, index) => {
        collectUnsupportedKeywordPaths(item, `${currentPath}[${index}]`, results);
      });
      return results;
    }

    if (!schema || typeof schema !== "object") {
      return results;
    }

    for (const [key, value] of Object.entries(schema)) {
      const nextPath = `${currentPath}.${key}`;
      if (UNSUPPORTED_JSON_SCHEMA_KEYS.has(key)) {
        results.push(nextPath);
      }
      collectUnsupportedKeywordPaths(value, nextPath, results);
    }

    return results;
  };

  const summarizeSerializedSchema = (schema) => {
    if (!schema || typeof schema !== "object") {
      return {
        rootKind: "unknown",
        topLevelFields: [],
      };
    }

    const topLevelFields = schema.properties && typeof schema.properties === "object"
      ? Object.keys(schema.properties)
      : [];

    return {
      rootKind:
        schema.type
        ?? (Array.isArray(schema.allOf) ? "allOf" : null)
        ?? (Array.isArray(schema.anyOf) ? "anyOf" : null)
        ?? (Array.isArray(schema.oneOf) ? "oneOf" : null)
        ?? "unknown",
      topLevelFields,
    };
  };

  const buildJsonSchemaOperationalReport = (input = {}) => {
    const report = {
      valid: false,
      compatible: false,
      summary: "Schema is not compatible with OpenFusionAPI MCP.",
      stages: {
        parseInput: false,
        normalize: false,
        zodConversion: false,
        mcpSerialization: false,
      },
      errors: [],
      warnings: [],
      details: {
        parsedFromString: false,
        normalizationChanged: false,
        removedUnsupportedKeywords: [],
        zodSchemaType: null,
        serializedRootKind: null,
        serializedTopLevelFields: [],
      },
      recommendation: "Call this tool again after adjusting the schema until compatible=true.",
    };

    let candidateSchema = input?.schema;

    if (candidateSchema === undefined && typeof input?.schema_text === "string") {
      candidateSchema = input.schema_text;
    }

    if (typeof candidateSchema === "string") {
      try {
        candidateSchema = JSON.parse(candidateSchema);
        report.details.parsedFromString = true;
      } catch (error) {
        report.errors.push(`schema_text is not valid JSON: ${error?.message || error}`);
        return report;
      }
    }

    if (!candidateSchema || typeof candidateSchema !== "object" || Array.isArray(candidateSchema)) {
      report.errors.push("Input field `schema` must be a JSON Schema object.");
      return report;
    }

    report.stages.parseInput = true;

    const removedUnsupportedKeywords = collectUnsupportedKeywordPaths(candidateSchema);
    const normalizedSchema = normalizeSchemaForZod(candidateSchema);
    report.stages.normalize = true;
    report.details.removedUnsupportedKeywords = removedUnsupportedKeywords;
    report.details.normalizationChanged = stringifySafe(candidateSchema) !== stringifySafe(normalizedSchema);

    if (removedUnsupportedKeywords.length > 0) {
      report.warnings.push(
        `OpenFusionAPI normalization removes unsupported JSON Schema keywords at: ${removedUnsupportedKeywords.join(", ")}.`,
      );
    }

    if (
      Array.isArray(candidateSchema.required) &&
      candidateSchema.required.length > 0 &&
      (!candidateSchema.properties || typeof candidateSchema.properties !== "object")
    ) {
      report.warnings.push(
        "The schema declares required fields without top-level properties. MCP agents may lose parameter guidance.",
      );
    }

    if (isSchemaTooGeneric(normalizedSchema)) {
      report.warnings.push(
        "The schema is very generic after normalization. MCP agents may not get useful field-level guidance.",
      );
    }

    let zodSchema;
    try {
      zodSchema = jsonSchemaToZod(normalizedSchema);
      report.stages.zodConversion = true;
      report.details.zodSchemaType = zodSchema?.constructor?.name ?? typeof zodSchema;
    } catch (error) {
      report.errors.push(`jsonSchemaToZod failed: ${error?.message || error}`);
      return finalizeJsonSchemaOperationalReport(report, input, normalizedSchema, null);
    }

    let serializedSchema = null;
    try {
      serializedSchema = z.toJSONSchema(zodSchema);
      report.stages.mcpSerialization = true;
      const serializedSummary = summarizeSerializedSchema(serializedSchema);
      report.details.serializedRootKind = serializedSummary.rootKind;
      report.details.serializedTopLevelFields = serializedSummary.topLevelFields;
    } catch (error) {
      report.errors.push(`MCP serialization failed: ${error?.message || error}`);
      return finalizeJsonSchemaOperationalReport(report, input, normalizedSchema, null);
    }

    report.valid = true;
    report.compatible = true;
    report.recommendation = report.warnings.length > 0
      ? "Review the warnings before using this schema in endpoint_upsert or any OpenFusionAPI endpoint json_schema field."
      : "The schema is compatible with OpenFusionAPI MCP and is ready to be used in endpoint json_schema fields.";

    return finalizeJsonSchemaOperationalReport(report, input, normalizedSchema, serializedSchema);
  };

  const finalizeJsonSchemaOperationalReport = (report, input, normalizedSchema, serializedSchema) => {
    report.summary = report.compatible
      ? (report.warnings.length > 0
        ? "Schema is compatible with OpenFusionAPI MCP, but warnings should be reviewed."
        : "Schema is compatible with OpenFusionAPI MCP.")
      : "Schema is not compatible with OpenFusionAPI MCP.";

    if (input?.include_normalized_schema === true) {
      report.normalizedSchema = normalizedSchema;
    }

    if (input?.include_serialized_schema === true) {
      report.serializedSchema = serializedSchema;
    }

    return report;
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

  const tryParseStructuredString = (value) => {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();
    if (!trimmed) return value;
    if (!["{", "[", '"'].includes(trimmed[0])) return value;

    try {
      return JSON.parse(trimmed);
    } catch (_error) {
      return value;
    }
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

  const isZodSchemaLike = (value) => {
    return Boolean(value && typeof value === "object" && value._zod);
  };

  const ensureSerializableToolSchema = (schema, { endpoint, toolName }) => {
    try {
      z.toJSONSchema(schema);
      return schema;
    } catch (error) {
      console.warn(
        `[MCP] Tool schema serialization failed for ${toolName} (${endpoint.method} ${endpoint.resource}). Se usa schema flexible.`,
        error?.message || error,
      );
      return z.object({}).passthrough().describe(
        "Flexible input because the generated schema could not be serialized for MCP tool listing.",
      );
    }
  };

  const isObjectLikeSerializedSchema = (schema) => {
    try {
      const jsonSchema = z.toJSONSchema(schema);
      if (jsonSchema?.type === "object") {
        return true;
      }

      return [jsonSchema?.allOf, jsonSchema?.anyOf, jsonSchema?.oneOf].some(
        (collection) => Array.isArray(collection) && collection.length > 0,
      );
    } catch (_error) {
      return false;
    }
  };

  const getTopLevelProperties = (schema) => {
    if (!schema || typeof schema !== "object") return [];
    if (!schema.properties || typeof schema.properties !== "object") return [];
    return Object.keys(schema.properties);
  };

  const getRequiredFields = (schema) => {
    if (!schema || typeof schema !== "object") return [];
    return Array.isArray(schema.required) ? schema.required : [];
  };

  const isStrictObjectSchema = (schema) => {
    return schema?.type === "object" && schema?.additionalProperties === false;
  };

  const schemaHasNoDeclaredTopLevelFields = (schema) => {
    return getTopLevelProperties(schema).length === 0;
  };

  const schemaAllowsAdditionalProperties = (schema) => {
    return schema?.type === "object" && schema?.additionalProperties === true;
  };

  const hasStructuredRuntimeSpecificPayload = (handler) => {
    return ["SOAP", "HANA", "MONGODB", "MCP", "TELEGRAM_BOT", "SQL_BULK_I"].includes(handler);
  };

  const buildAgentToolDescription = ({
    endpoint,
    safeToolName,
    effectiveDescription,
    inputSchema,
    exampleRequest,
    endpointUpsertDescriptionAddon,
  }) => {
    const topLevelProperties = getTopLevelProperties(inputSchema);
    const requiredFields = getRequiredFields(inputSchema);
    const fallbackDescription = `Calls ${endpoint.method} ${endpoint.resource} for application ${app_name} in ${endpoint.environment}.`;
    const purpose = (effectiveDescription && effectiveDescription.trim().length > 0)
      ? effectiveDescription.trim()
      : fallbackDescription;
    const accessLabel = endpoint.access == 0 ? "public" : "private";
    const strictSchema = isStrictObjectSchema(inputSchema);
    const minimalPayload = toPrettyText(exampleRequest, "No example available.");

    const lines = [
      `Purpose: ${purpose}`,
      `Tool name: ${safeToolName}`,
      `Access: ${accessLabel}`,
      `HTTP target: ${endpoint.method} ${endpoint.resource}`,
      `Environment: ${endpoint.environment}`,
      `Required fields: ${requiredFields.length > 0 ? requiredFields.join(", ") : "none"}`,
      `Top-level input fields: ${topLevelProperties.length > 0 ? topLevelProperties.join(", ") : "none declared"}`,
      `Additional properties: ${strictSchema ? "not allowed" : "allowed or unspecified"}`,
      `Minimal example payload: ${minimalPayload}`,
      "Agent guidance: send only fields defined by the input schema unless the schema explicitly allows additional properties.",
    ];

    if (hasStructuredRuntimeSpecificPayload(endpoint.handler)) {
      lines.push(`Agent guidance: this handler uses runtime-specific payload structure; call handler_documentation with handler=${endpoint.handler} before composing complex payloads.`);
    }

    if (normalizeToolKey(safeToolName) === "endpoint_upsert") {
      lines.push("Agent guidance: call read_endpoint_data before updating an existing endpoint, and verify the saved structure after endpoint_upsert.");
    }

    if (endpoint.access != 0) {
      lines.push("Agent guidance: this tool requires MCP server credentials; do not assume anonymous access.");
    }

    if (endpointUpsertDescriptionAddon && endpointUpsertDescriptionAddon.trim().length > 0) {
      lines.push(endpointUpsertDescriptionAddon.trim());
    }

    return lines.join("\n");
  };

  const TOOL_DOC_OVERRIDES = {
    app_data: {
      description:
        "Returns the main Application record for the provided `idapp`.",
      exampleRequest: {
        idapp: "00000000-0000-0000-0000-000000000001",
      },
      outputSchema: {
        type: "object",
        additionalProperties: true,
      },
    },
    app_create_update: {
      exampleRequest: {
        app: "my_new_app",
        enabled: true,
        description: "Example application",
      },
      outputSchema: {
        type: "object",
        additionalProperties: true,
      },
    },
    read_endpoint_data: {
      description:
        "Returns detailed data for a specific endpoint by `idendpoint`, including its configuration, metadata and runtime-relevant fields. Use this tool to inspect endpoint settings before updating or debugging.",
      exampleRequest: {
        idendpoint: "00000000-0000-0000-0000-000000000002",
      },
      notes: [
        "Send the endpoint identifier in `idendpoint` exactly as defined in the input schema.",
        "Use this response as a read-before-write step prior to endpoint_upsert changes.",
      ],
      outputSchema: {
        type: "object",
        additionalProperties: true,
      },
    },
    endpoint_source_summary: {
      description:
        "Returns a compact source summary for one endpoint, including code length, line count, and a preview without the full endpoint payload.",
      exampleRequest: {
        idendpoint: "00000000-0000-0000-0000-000000000002",
        preview_lines: 40,
      },
      notes: [
        "Prefer this over `read_endpoint_data` when the agent only needs a quick code preview or wants to estimate source size before requesting the full endpoint configuration.",
      ],
      outputSchema: {
        type: "object",
        additionalProperties: true,
      },
    },
    app_vars: {
      description:
        "Obtains the list of application variables for the given `idapp`.",
      exampleRequest: {
        idapp: "00000000-0000-0000-0000-000000000001",
      },
      notes: [
        "The parameter name is `idapp` (not `iadpp`).",
        "Values may be serialized depending on each variable `type`.",
      ],
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    available_functions_modules: {
      description:
        "Retrieves all available internal functions and modules that can be referenced by endpoints using the `JS` handler.",
      exampleRequest: {},
      exampleResponse: {
        "$_RETURN_DATA_": {
          description: "Assign endpoint output payload in JS handlers.",
        },
        "$_EXCEPTION_": {
          description: "Raise controlled errors with status and details from JS handlers.",
        },
      },
      notes: [
        "Useful to validate allowed imports/helpers before publishing JS endpoints.",
        "The response is metadata-oriented and may include helper globals, modules, or example snippets rather than a rigid fixed schema.",
      ],
      outputSchema: {
        type: "object",
        additionalProperties: true,
      },
    },
    app_endpoints: {
      description:
        "Retrieves all endpoints associated with one application (`idapp`) with their key metadata.",
      exampleRequest: {
        idapp: "00000000-0000-0000-0000-000000000001",
      },
      notes: [
        "Use this for lightweight endpoint discovery; call `read_endpoint_data` when you need the full configuration of one endpoint.",
      ],
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    app_endpoints_catalog: {
      description:
        "Retrieves a lightweight catalog of endpoints for one application. By default it excludes endpoint source code.",
      exampleRequest: {
        idapp: "00000000-0000-0000-0000-000000000001",
        environment: "prd",
        include_code: false,
      },
      notes: [
        "Prefer this over `app_endpoints` for discovery workflows because it avoids large `code` payloads unless explicitly requested.",
      ],
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    app_vars_catalog: {
      description:
        "Returns a lightweight catalog of application variables for one app. Values are excluded unless explicitly requested.",
      exampleRequest: {
        idapp: "00000000-0000-0000-0000-000000000001",
        environment: "prd",
        include_values: false,
      },
      notes: [
        "Prefer this over `app_vars` for discovery workflows because it avoids returning variable values unless explicitly requested.",
      ],
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    apps_list: {
      description:
        "Retrieves all applications with their application variables and related endpoints.",
      exampleRequest: {},
      notes: [
        "This can be a large payload because it expands nested app variables and endpoints for every application.",
      ],
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    apps_catalog: {
      description:
        "Retrieves a lightweight catalog of applications without nested endpoints or application variables.",
      exampleRequest: {
        enabled: true,
        limit: 50,
        offset: 0,
      },
      notes: [
        "Prefer this over `apps_list` for initial discovery because the payload is smaller and excludes nested endpoint trees.",
      ],
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    endpoint_change_history: {
      description:
        "Returns the ordered change history of an endpoint, useful for audits and rollback analysis.",
      exampleRequest: {
        idendpoint: "00000000-0000-0000-0000-000000000002",
      },
      notes: [
        "Entries are typically ordered by newest-first unless the backend configuration defines otherwise.",
        "History rows are snapshots for inspection; restoring a version still requires an explicit write operation.",
      ],
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    get_app_list_filters: {
      description:
        "Returns applications and nested endpoint data using the provided filters.",
      exampleRequest: {
        app: "my_app",
        endpoint: {
          environment: "prd",
          enabled: true,
        },
      },
      exampleResponse: [
        {
          idapp: "00000000-0000-0000-0000-000000000001",
          app: "my_app",
          enabled: true,
          description: "Example application",
          vrs: [
            {
              name: "MY_CONFIG",
              type: "string",
              environment: "prd",
              value: "example-value",
            },
          ],
          endpoints: [
            {
              idendpoint: "00000000-0000-0000-0000-000000000002",
              resource: "/api/data",
              method: "GET",
              handler: "JS",
              environment: "prd",
              enabled: true,
            },
          ],
        },
      ],
      notes: [
        "When multiple filters are sent, backends commonly evaluate them as AND conditions.",
        "The response is usually app-centric: each matched application may include nested variables and matched endpoints.",
      ],
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    get_system_logs: {
      exampleRequest: {
        trace_id: "trace-id-example",
        limit: 50,
        orderDirection: "DESC",
      },
      notes: [
        "Prefer `trace_id` as the first filter when investigating one failing execution path.",
        "When using date windows, send `start_date` and `end_date` together to keep the range explicit.",
        "Use `last_hours` for quick recent searches and reserve broad unfiltered scans for exceptional cases because log volume can be high.",
      ],
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    appvar_upsert: {
      description:
        "Creates or updates a reusable application variable for a target `idapp` and `environment`. Use this after creating the application and before creating endpoints when configuration must be shared across multiple endpoints. Supported environments commonly used by agents are `dev`, `qa`, and `prd`.",
      exampleRequest: {
        idapp: "00000000-0000-0000-0000-000000000001",
        name: "MY_CONFIG_VALUE",
        type: "string",
        environment: "prd",
        value: "example-value",
      },
      notes: [
        "`value` is sent as string in this contract; serialize JSON when storing structured data.",
        "Recommended workflow: create the application first, store shared configuration with appvar_upsert, and then create endpoints that reuse those variables.",
        "When an endpoint JSON payload needs to reference an AppVar placeholder, embed it as a string such as `\"$_VAR_NAME\"`.",
      ],
      outputSchema: {
        type: "object",
        additionalProperties: true,
      },
    },
    endpoint_upsert: {
      outputSchema: {
        type: "object",
        additionalProperties: true,
      },
    },
    handler_documentation: {
      exampleRequest: {
        handler: "JS",
      },
      exampleResponse: {
        label: "JavaScript",
        description: "Executes JavaScript in a Node.js VM sandbox.",
        markdown: "Canonical handler guide in markdown format.",
        manifest: {
          handler: "JS",
          label: "JavaScript",
          status: "active",
          summary: "Executes JavaScript in a Node.js VM sandbox.",
        },
        generated: [
          {
            file: "api.generated.md",
            markdown: "Generated API reference for helper functions available in the JS handler runtime.",
          },
        ],
        examples: [],
        files: {
          main: "README.md",
          manifest: "manifest.json",
          generated: ["api.generated.md"],
          examples: [],
          existing: ["README.md", "manifest.json", "api.generated.md"],
        },
      },
      notes: [
        "Use this tool before composing payloads for handlers with runtime-specific JSON structure.",
        "The response may include canonical markdown, structured manifest metadata, generated reference files, and example files when available.",
      ],
      outputSchema: {
        type: "object",
        properties: {
          label: { type: "string" },
          description: { type: "string" },
          markdown: { type: "string" },
          manifest: {
            type: "object",
            additionalProperties: true,
          },
          generated: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
          examples: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
          files: {
            type: "object",
            additionalProperties: true,
          },
        },
        required: ["label", "description"],
        additionalProperties: true,
      },
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

  const toPrettyExampleText = (value, { allowEmptyObject = false } = {}) => {
    if (allowEmptyObject && value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
      return "{}";
    }
    return toPrettyText(value);
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

    const visit = (node) => {
      if (Array.isArray(node)) return node.map(visit);
      if (!node || typeof node !== "object") return node;

      const out = {};
      for (const [key, value] of Object.entries(node)) {
        if (UNSUPPORTED_JSON_SCHEMA_KEYS.has(key)) continue;
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
- **UPDATE**: include a valid \`idendpoint\` UUID. Use \`read_endpoint_data\` first to read the current state before modifying.

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
| \`TEXT\` | Raw text content. Put the MIME type in \`custom_data.mimeType\`. |
| \`SQL\` | Standard SQL query string. Connection config goes in \`custom_data\` |
| \`SQL_BULK_I\` | JSON with \`table_name\`, \`config\`, optionally \`ignoreDuplicates\` |
| \`SOAP\` | Handler-specific SOAP configuration payload |
| \`HANA\` | Handler-specific SAP HANA configuration payload |
| \`MONGODB\` | Handler-specific MongoDB configuration payload |
| \`MCP\` | Handler-specific MCP configuration payload |
| \`TELEGRAM_BOT\` | JavaScript source that configures the injected \`$BOT\` grammY instance; token usually goes in \`custom_data.token\`, and the runtime starts the bot automatically |
| \`NA\` | Internal default/no-op handler. Avoid for new integrations |

### Minimum examples by handler

**JS**
\`code\`: \`$_RETURN_DATA_ = { ok: true };\`

**FUNCTION**
\`code\`: \`fnMyFunction\`

**FETCH**
\`code\`: \`https://api.example.com/data\`

**TEXT**
\`code\`: raw text such as \`hello\`

\`custom_data\`:
\`{"mimeType":"text/plain"}\`

**SQL**
\`code\`: \`SELECT id, email, status FROM accounts WHERE account_id = $account_id\`

\`custom_data\`:
\`{"config":{"database":"main_db","username":"db_user","password":"db_password","options":{"host":"db.example.internal","port":1433,"dialect":"mssql"}},"query_type":"SELECT"}\`

**SQL_BULK_I**
\`code\`: \`{"table_name":"accounts","config":{"database":"main_db","username":"db_user","password":"db_password","options":{"host":"db.example.internal","dialect":"mssql"}}}\`

**SOAP**
\`code\`: handler-specific JSON configuration. Call \`handler_documentation\` with \`SOAP\` before writing the payload.

**HANA**
\`code\`: handler-specific JSON configuration. Call \`handler_documentation\` with \`HANA\` before writing the payload.

**MONGODB**
\`code\`: handler-specific JSON configuration. Call \`handler_documentation\` with \`MONGODB\` before writing the payload.

**MCP**
\`code\`: handler-specific JSON configuration. Call \`handler_documentation\` with \`MCP\` before writing the payload.

**TELEGRAM_BOT**
\`code\`: JavaScript source that configures the injected grammY bot instance available as \`$BOT\`. Store the Telegram token in \`custom_data.token\`. Do not instantiate the bot yourself and do not call \`$BOT.start()\`; the runtime starts it after evaluating the script. This handler is used to persist and run bot logic in the background, not to return business data from the HTTP response.

Operational notes for agents:
- An HTTP \`200\` only confirms the route handled the request. It does not prove the bot started successfully.
- Real startup happens in the background worker. Validate worker logs separately.
- Repeated startup failures can auto-disable the endpoint.
- In this repository, seeded apps such as \`demo\` can be restored on server startup, so persistent TELEGRAM_BOT changes may also require updating the default app definition.
- Typical Telegram startup failures: \`401 Unauthorized\` means invalid or revoked token; \`404 Not Found\` usually means Telegram does not recognize that bot token.

### ⚠️ SQL handler Binds
Do not assume one placeholder syntax works for every SQL backend. Keep the SQL text in \`code\`, store connection settings in \`custom_data\`, and confirm the expected bind style with \`handler_documentation\` for \`SQL\` before publishing the endpoint.

### ⚠️ SQL custom_data
For the \`SQL\` handler, keep the SQL query in \`code\` and store database connection parameters in \`custom_data\`. Do not wrap both pieces inside \`code\`.

### ⚠️ Handler-specific JSON payloads
For \`SOAP\`, \`HANA\`, \`MONGODB\`, and \`MCP\`, the exact JSON shape is runtime-specific. Call \`handler_documentation\` for the selected handler and build the payload from that contract instead of reusing examples from another handler. For \`TELEGRAM_BOT\`, write JavaScript code for \`$BOT\`, provide the token in \`custom_data.token\`, let the runtime start the bot automatically, and verify startup in logs instead of relying only on the HTTP response.

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

1. Choose the handler first.
2. Call \`handler_documentation\` with the chosen handler whenever the handler expects a structured JSON payload or database-specific rules.
3. When you create a JSON Schema that will be stored in OpenFusionAPI, call \`validate_json_schema_for_mcp\` before publishing it.
4. Build the \`code\` field following the table above and use \`custom_data\` for SQL connection settings.
5. If updating an existing endpoint, call \`read_endpoint_data\` first and modify the current structure instead of rebuilding it from memory.
6. Run \`endpoint_upsert\` with all required fields.
7. Call \`read_endpoint_data\` again to verify the persisted structure.
8. Test the endpoint via its HTTP URL before exposing it as an MCP tool.
9. For \`TELEGRAM_BOT\`, also inspect worker startup logs and re-check whether the endpoint stayed enabled after startup.
`;
  };

  const getEndpointUpsertDescriptionAddon = (endpoint) => {
    if (!isEndpointUpsertEndpoint(endpoint)) return "";

    return " Handler-Specific Guide (endpoint_upsert): `handler` defines the shape of `code` and related fields. FUNCTION => `code` is a function identifier string. JS => `code` is JavaScript source that must assign `$_RETURN_DATA_`. FETCH => `code` is the target URL. TEXT => `code` is the raw text content and MIME metadata goes in `custom_data.mimeType`. SQL => `code` is the SQL query and `custom_data` stores connection settings. SQL_BULK_I/SOAP/HANA/MONGODB/MCP/TELEGRAM_BOT => `code` uses handler-specific configuration and should be built from `handler_documentation` for that handler. NA is an internal default/no-op handler and should be avoided in new integrations. Recommended agent workflow: choose handler first, inspect the handler contract, then build the payload.";
  };

  // Guard against missing endpoint collections when an app is partially configured.
  if (!app || !Array.isArray(app?.endpoints)) {
    console.warn("[MCP] No endpoints were found for application:", app_name);
    // Return the factory even when no tools are available so the MCP flow remains stable.
    return (_headers) => {
      return getServer();
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
  let markdown_api_catalog_rows = [];

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
    const legacyToolName = sanitizeToolName(mcpNameRaw, toolName);
    const safeToolName = normalizeToolKey(legacyToolName);

    const inputSchema = endpoint?.json_schema?.in?.schema ?? {};
    const outputSchema = endpoint?.json_schema?.out?.schema ?? {};
    const inputSchemaNormalized = normalizeSchemaForZod(inputSchema);
    const schemaWasNormalized = stringifySafe(inputSchemaNormalized) !== stringifySafe(inputSchema);
    const override = getToolDocOverride(safeToolName);
    const hasExplicitExampleRequest = Boolean(
      override && Object.prototype.hasOwnProperty.call(override, "exampleRequest")
    );
    const rawExampleRequest = endpoint?.data_test?.body?.json?.code;
    const rawExampleResponse = endpoint?.data_test?.last_response?.data;
    const generatedRequestExample = buildExampleFromSchema(inputSchema);
    const generatedResponseExample = buildExampleFromSchema(outputSchema);
    const exampleRequest = override?.exampleRequest ?? rawExampleRequest ?? generatedRequestExample;
    const exampleResponse = override?.exampleResponse ?? rawExampleResponse ?? generatedResponseExample;
    const parsedExampleResponse = tryParseStructuredString(exampleResponse);
    const inferredOutputSchemaFromExample =
      (parsedExampleResponse !== undefined && parsedExampleResponse !== null)
        ? inferSchemaFromExample(parsedExampleResponse)
        : null;
    const effectiveOutputSchema = override?.outputSchema ?? (
      isSchemaTooGeneric(outputSchema)
        ? (inferredOutputSchemaFromExample ?? outputSchema)
        : outputSchema
    );
    const outputSchemaWasInferred =
      !override?.outputSchema &&
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
    const noDeclaredInputFields = schemaHasNoDeclaredTopLevelFields(inputSchema);
    const inputAllowsExtraFields = schemaAllowsAdditionalProperties(inputSchema);
    const isArgumentlessTool = noDeclaredInputFields && !inputAllowsExtraFields;
    const isEffectivelyNoArgTool = noDeclaredInputFields;
    const agentToolDescription = buildAgentToolDescription({
      endpoint,
      safeToolName,
      effectiveDescription,
      inputSchema,
      exampleRequest,
      endpointUpsertDescriptionAddon,
    });

    markdown_api_catalog_rows.push([
      endpoint?.mcp?.name && endpoint?.mcp?.name.length > 0
        ? endpoint?.mcp?.name
        : toolName,
      endpoint.method,
      endpoint.resource,
      endpoint.handler,
    ]);

    // Bug fix #5: Uso de optional chaining para evitar TypeError si mcp.title/description no existen
    markdown_api_docs.push(`##
## Endpoint
**${endpoint?.mcp?.name && endpoint?.mcp?.name.length > 0
        ? endpoint?.mcp?.name
        : toolName}** 

**MCP Tool Name (safe)**
${safeToolName}

${legacyToolName !== safeToolName ? `**Legacy Alias**
${legacyToolName}

` : ""}

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

${toPrettyExampleText(exampleRequest, { allowEmptyObject: hasExplicitExampleRequest || isEffectivelyNoArgTool })}

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

  ${isArgumentlessTool
      ? "- This tool does not require input arguments; call it with an empty object `{}`."
      : isEffectivelyNoArgTool
        ? "- This tool is typically called with an empty object `{}`; additional fields are not required unless explicitly documented elsewhere."
        : "- Use this tool only with fields defined in the input schema."}
  - If schema marks a field as deprecated, avoid it for new integrations.
  - Access level above indicates if credentials are required.
  ${schemaWasNormalized ? "- Internal runtime validation schema was normalized for MCP compatibility (unsupported JSON Schema keywords removed)." : "- Runtime validation uses the published JSON schema directly."}
  ${outputSchemaWasInferred ? "- Output schema was inferred from a real example response because the declared output schema is too generic." : "- Output schema is documented as declared by the endpoint contract."}
  ${varsDeprecated ? "- Field `vars` is deprecated (compatibility only). Use appvar_upsert for new app variables." : isEffectivelyNoArgTool ? "- No required fields are declared for this tool." : "- Validate required fields before sending the request."}
  ${(override?.notes ?? []).map((note) => `- ${note}`).join("\n  ")}
  ${legacyToolName !== safeToolName ? `- Legacy alias \`${legacyToolName}\` remains registered for backward compatibility.` : ""}

${endpointUpsertHandlerGuide}
`);

    let zod_inputSchema = z.object({}).describe("Data to send to the endpoint.");
    const requiresPassthroughToolInput = isEndpointUpsertEndpoint(endpoint);

    if (requiresPassthroughToolInput) {
      zod_inputSchema = z.object({}).passthrough().describe(
        "Structured input preserved as-is for endpoint_upsert because recursive and conditional endpoint payloads are not safely represented by the MCP validator.",
      );
    } else if (
      endpoint?.json_schema?.in?.enabled &&
      endpoint?.json_schema?.in?.schema
    ) {
      try {
        const zodSchema = jsonSchemaToZod(inputSchemaNormalized);
        if (zodSchema instanceof z.ZodObject || isObjectLikeSerializedSchema(zodSchema)) {
          zod_inputSchema = zodSchema;
        } else if (isZodSchemaLike(zodSchema)) {
          zod_inputSchema = z.object({ value: zodSchema }).describe(
            "Structured single-value input wrapped for MCP compatibility.",
          );
        } else {
          console.warn(
            `[MCP] Schema conversion returned an invalid Zod schema for ${endpoint.method} ${endpoint.resource}. Se usa schema flexible.`,
          );
          zod_inputSchema = z.object({}).passthrough().describe(
            "Flexible input because schema conversion did not produce a valid Zod schema.",
          );
        }
      } catch (error) {
        console.warn(
          `[MCP] Schema no support to ${endpoint.method} ${endpoint.resource}. Se usa schema flexible.`,
          error?.message || error,
        );
        zod_inputSchema = z.object({}).passthrough().describe(
          "Flexible input due to unsupported JSON Schema features.",
        );
      }
    }

    zod_inputSchema = ensureSerializableToolSchema(zod_inputSchema, {
      endpoint,
      toolName: safeToolName,
    });

    const registerEndpointTool = (registeredToolName, descriptionPrefix = "") => {
      _mcpConfig.tools.push({
        name: registeredToolName,
        info: {
          title:
            endpoint?.mcp?.title && endpoint?.mcp?.title.length > 0
              ? endpoint?.mcp?.title
              : (endpoint.title || endpoint.description || safeToolName),
          description: `${descriptionPrefix}${agentToolDescription}`,

          inputSchema: zod_inputSchema,
        },

        handler: async (data, _context, currentHeaders) => {

          try {
            let AutoURL = new URLAutoEnvironment({
              environment: endpoint.environment,
            });

            let uF = AutoURL.auto(url_internal, true);

            let request_endpoint = await uF[endpoint.method.toLowerCase()]({
              data: data,
              headers: currentHeaders,
            });

            const mimeType = request_endpoint.headers.get("content-type") ?? "text/plain";
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
      });
    };

    registerEndpointTool(safeToolName);
    if (legacyToolName !== safeToolName) {
      registerEndpointTool(legacyToolName, "Legacy alias. ");
    }

  }

  // URI con path explícito: new URL("api://docs/demo").toString() === "api://docs/demo"
  // Si el URI no tiene path (ej: "api://docs-demo"), new URL() añade "/" final → no coincide con la clave registrada
  const resourceURI = "api://docs/" + app_name;
  const catalogResourceURI = "api://docs/catalog/" + app_name;
  const md_resource = `
# API Documentation for ${app_name} on ${environment} environment

${markdown_api_docs.join("\n")}

    `;
  const md_catalog_resource = `
# API Endpoint Catalog for ${app_name} on ${environment} environment

This is a lightweight endpoint catalog for quick discovery. It intentionally excludes per-endpoint schemas, examples, and long behavior notes.

| MCP Tool Name | Method | Resource | Handler |
|---|---|---|---|
${markdown_api_catalog_rows
  .map((row) => `| ${row.map((cell) => toCompactText(cell, "-").replace(/\|/g, "\\|")).join(" | ")} |`)
  .join("\n")}

Use \`list_api_endpoints_${app_name}\` only when you need the full endpoint-by-endpoint documentation dump.

    `;

  _mcpConfig.resources.push({
    name: "api-docs-" + app_name,
    uri: resourceURI,
    info: {
      description: "API Documentation for " + app_name + " on " + environment + " environment",
      mimeType: "text/markdown",
    },
    handler: async (_uri, _extra) => {

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
  });

  _mcpConfig.resources.push({
    name: "api-docs-catalog-" + app_name,
    uri: catalogResourceURI,
    info: {
      description: "Lightweight API endpoint catalog for " + app_name + " on " + environment + " environment",
      mimeType: "text/markdown",
    },
    handler: async (_uri, _extra) => {

      return {
        contents: [
          {
            uri: catalogResourceURI,
            mimeType: "text/markdown",
            text: md_catalog_resource
          }
        ]
      }
    }
  });

_mcpConfig.tools.push({
  name: "validate_json_schema_for_mcp",
  info: {
    title: "Validate JSON Schema For MCP",
    description: [
      "Purpose: validate whether a JSON Schema is operationally compatible with OpenFusionAPI MCP.",
      "Required fields: schema.",
      "Top-level input fields: schema, schema_text, include_normalized_schema, include_serialized_schema.",
      "Output: JSON report with compatibility status, stage-by-stage results, warnings, errors, and recommendations.",
      "Agent guidance: use this tool before publishing any json_schema that will be stored or exposed through OpenFusionAPI.",
      "Agent guidance: this validation is OpenFusionAPI-specific. It checks normalization, jsonSchemaToZod conversion, and MCP serialization behavior instead of only generic JSON Schema validity.",
    ].join("\n"),
    inputSchema: {
      schema: z.unknown().describe("JSON Schema object to validate for OpenFusionAPI MCP compatibility."),
      schema_text: z.string().optional().describe("Optional JSON string form of the schema when the caller cannot send an object directly."),
      include_normalized_schema: z.boolean().optional().describe("When true, include the normalized schema used by OpenFusionAPI before conversion."),
      include_serialized_schema: z.boolean().optional().describe("When true, include the serialized JSON Schema generated from the converted Zod schema."),
    },
    annotations: { readOnlyHint: true },
  },
  handler: async (data) => {
    const report = buildJsonSchemaOperationalReport(data || {});

    return {
      content: [
        {
          type: "text",
          mimeType: "application/json",
          text: JSON.stringify(report, null, 2),
        },
      ],
    };
  }
});

_mcpConfig.tools.push({
  name: sanitizeToolName("list_api_endpoints_catalog_" + app_name, "list_api_endpoints_catalog"),
  info: {
    title: "List API endpoint catalog for " + app_name + " on " + environment + " environment",
    description: [
      `Purpose: return a lightweight endpoint catalog for application '${app_name}' on '${environment}' environment.`,
      "Required fields: none.",
      "Top-level input fields: none.",
      "Output: compact markdown table with MCP tool name, HTTP method, resource path, and handler.",
      "Agent guidance: prefer this tool for discovery because it avoids sending full schemas, examples, and long endpoint documentation blocks.",
    ].join("\n"),
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },
  handler: async () => ({
    content: [
      {
        type: "text",
        text: md_catalog_resource,
      },
    ],
  })
});

_mcpConfig.tools.push({
  name: sanitizeToolName("list_api_endpoints_" + app_name, "list_api_endpoints"),
  info: {
    title: "List API endpoints for " + app_name + " on " + environment + " environment",
    description: [
      `Purpose: return documentation for all API endpoints for application '${app_name}' on '${environment}' environment.`,
      "Required fields: none.",
      "Top-level input fields: none.",
      "Output: markdown text containing endpoint-by-endpoint API documentation, example payloads, schemas, and behavior notes.",
      `Agent guidance: prefer list_api_endpoints_catalog_${app_name} for initial discovery and call this full dump only when you need detailed schemas, examples, or behavior notes for many endpoints at once.`,
    ].join("\n"),
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },
  handler: async () => ({
    content: [
      {
        type: "text",
        text: md_resource,
      },
    ],
  })
});

  // Re-creates the McpServer object for the current request (allowing individual transport connect)
  // and injects the current HTTP request headers so concurrent requests are safely isolated.
  return (headers) => {
    const server = getServer();
    const currentHeaders = headers ?? {};

    for (const res of _mcpConfig.resources) {
      server.registerResource(res.name, res.uri, res.info, async (uri, extra) => {
        return await res.handler(uri, extra, currentHeaders);
      });
    }

    for (const t of _mcpConfig.tools) {
      server.registerTool(t.name, t.info, async (data, context) => {
        return await t.handler(data, context, currentHeaders);
      });
    }

    return server;
  };
};
