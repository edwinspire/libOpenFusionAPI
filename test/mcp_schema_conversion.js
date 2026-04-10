import assert from "node:assert/strict";

import { system_app } from "../src/lib/db/default/system.js";
import { jsonSchemaToZod } from "../src/lib/server/mcp/utils.js";

function getEndpoint(resource) {
  return system_app.endpoints.find((endpoint) => endpoint.resource === resource && endpoint.method === "POST");
}

const describeAllTables = getEndpoint("/api/db/schema");
const describeTableStructure = getEndpoint("/api/db/table/structure");
const endpointUpsert = getEndpoint("/api/endpoint");

assert.ok(describeAllTables, "Expected system endpoint /api/db/schema to exist");
assert.ok(describeTableStructure, "Expected system endpoint /api/db/table/structure to exist");
assert.ok(endpointUpsert, "Expected system endpoint /api/endpoint to exist");

assert.doesNotThrow(() => jsonSchemaToZod(describeAllTables.json_schema.in.schema));
assert.doesNotThrow(() => jsonSchemaToZod(describeTableStructure.json_schema.in.schema));
assert.doesNotThrow(() => jsonSchemaToZod(endpointUpsert.json_schema.in.schema));

const describeAllTablesSchema = jsonSchemaToZod(describeAllTables.json_schema.in.schema);
const describeAllTablesParsed = describeAllTablesSchema.safeParse({
  connection: {
    database: "msdb",
    username: "sa",
    password: "secret",
    dialect: "mssql",
    host: "127.0.0.1",
    logging: true,
  },
});

assert.equal(describeAllTablesParsed.success, true, "describe_all_tables schema should accept boolean logging");

const endpointUpsertSchema = jsonSchemaToZod(endpointUpsert.json_schema.in.schema);
const endpointUpsertParsed = endpointUpsertSchema.safeParse({
  idapp: "11111111-1111-4111-8111-111111111111",
  environment: "prd",
  timeout: 30,
  resource: "/numero/a-texto-es",
  method: "GET",
  handler: "JS",
  access: 0,
  title: "Numero a texto ES",
  description: "Convierte un numero a texto en espanol.",
  price_by_request: 0,
  price_kb_request: 0,
  price_kb_response: 0,
  keywords: "numero,texto,espanol",
  ctrl: { admin: true, nested: { tags: ["demo", 1, null] } },
  code: "$_RETURN_DATA_ = { ok: true };",
  cors: { origin: "*" },
  cache_time: 0,
  mcp: { enabled: true },
  json_schema: {
    in: { enabled: true, schema: { type: "object", properties: { numero: { type: "number" } } } },
  },
  custom_data: { example: [{ ok: true }] },
  headers_test: {},
  data_test: { body: { json: { numero: 42 } } },
});

assert.equal(endpointUpsertParsed.success, true, "endpoint_upsert schema should accept recursive jsonValue payloads");