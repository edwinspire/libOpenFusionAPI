#!/usr/bin/env node

const http = require('http');

// The new codes
const describeAllCode = `if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) { $_EXCEPTION_("Invalid request: expected JSON object in body", {received_type: typeof request.body}, 400); }
let payload = null;
if (request.body.json && typeof request.body.json === "object" && !Array.isArray(request.body.json)) { payload = request.body.json.code && typeof request.body.json.code === "object" && !Array.isArray(request.body.json.code) ? request.body.json.code : request.body.json; } else if (request.body.code && typeof request.body.code === "object" && !Array.isArray(request.body.code)) { payload = request.body.code; } else if (request.body.connection) { payload = request.body; }
if (!payload || typeof payload !== "object" || Array.isArray(payload)) { $_EXCEPTION_("Could not extract payload", {checked: ["body.json.code", "body.json", "body.code", "body"]}, 400); }
const connection = payload.connection;
const schema = payload.schema;
if (!connection || typeof connection !== "object") { $_EXCEPTION_("Missing 'connection' object", {}, 400); }
const missingFields = [];
const invalidFields = [];
for (const f of ["database", "username", "password", "dialect", "host"]) { const v = connection[f]; if (!v) missingFields.push("connection." + f); else if (typeof v !== "string" || !v.trim()) invalidFields.push("connection." + f); }
if (missingFields.length || invalidFields.length) { $_EXCEPTION_("Invalid connection parameters", {missing: missingFields.length ? missingFields : undefined, invalid: invalidFields.length ? invalidFields : undefined}, 400); }
if (schema !== undefined && schema !== null) { if (typeof schema !== "string" || !schema.trim()) { $_EXCEPTION_("Invalid schema", {}, 400); } }
const sequelizeConfig = { ...connection, database: connection.database.trim(), username: connection.username.trim(), password: connection.password.trim(), dialect: connection.dialect.trim(), host: connection.host.trim() };
const db = new sequelize.Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);
try { await db.authenticate(); const queryInterface = db.getQueryInterface(); const normalizedSchema = typeof schema === "string" ? schema.trim() : null; let tables; if (typeof queryInterface.listTables === "function") { tables = await queryInterface.listTables(normalizedSchema ? { schema: normalizedSchema } : {}); } else { tables = await queryInterface.showAllTables(); } const result = {}; for (const tableEntry of tables) { const tableName = typeof tableEntry === "string" ? tableEntry : (tableEntry.tableName || tableEntry.table_name || String(tableEntry)); const tableSchema = typeof tableEntry === "object" ? (tableEntry.schema || tableEntry.table_schema || normalizedSchema || null) : (normalizedSchema || null); try { const tableRef = tableSchema ? { tableName, schema: tableSchema } : tableName; const columns = await queryInterface.describeTable(tableRef); result[tableName] = { schema: tableSchema, columns }; } catch (err) { result[tableName] = { schema: tableSchema, error: err?.message || "Failed" }; } } $_RETURN_DATA_ = { ok: true, dialect: db.getDialect(), schema: normalizedSchema, table_count: tables.length, tables: result }; } catch (error) { $_EXCEPTION_("Database error", {message: error?.message || "Unknown"}, 500); } finally { await db.close(); }`;

const describeTableCode = `if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) { $_EXCEPTION_("Invalid request", {}, 400); }
let payload = request.body.json?.code || request.body.json || request.body.code || request.body;
if (!payload || typeof payload !== "object") { $_EXCEPTION_("No payload", {}, 400); }
const connection = payload.connection;
const table = payload.table;
const schema = payload.schema;
if (!connection || typeof connection !== "object") { $_EXCEPTION_("Missing connection", {}, 400); }
const missingFields = [];
const invalidFields = [];
for (const f of ["database", "username", "password", "dialect", "host"]) { const v = connection[f]; if (!v) missingFields.push("connection." + f); else if (typeof v !== "string" || !v.trim()) invalidFields.push("connection." + f); }
if (!table || typeof table !== "string" || !table.trim()) { missingFields.push("table"); }
if (missingFields.length || invalidFields.length) { $_EXCEPTION_("Invalid parameters", {missing: missingFields.length ? missingFields : undefined, invalid: invalidFields.length ? invalidFields : undefined}, 400); }
if (schema !== undefined && schema !== null && (typeof schema !== "string" || !schema.trim())) { $_EXCEPTION_("Invalid schema", {}, 400); }
const sequelizeConfig = { ...connection, database: connection.database.trim(), username: connection.username.trim(), password: connection.password.trim(), dialect: connection.dialect.trim(), host: connection.host.trim() };
const db = new sequelize.Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);
try { await db.authenticate(); const queryInterface = db.getQueryInterface(); const normalizedSchema = typeof schema === "string" ? schema.trim() : null; const normalizedTable = table.trim(); const tableRef = normalizedSchema ? { tableName: normalizedTable, schema: normalizedSchema } : normalizedTable; const columns = await queryInterface.describeTable(tableRef); $_RETURN_DATA_ = { ok: true, dialect: db.getDialect(), table: normalizedTable, schema: normalizedSchema, columns }; } catch (error) { $_EXCEPTION_("Unable to describe table", {message: error?.message || "Unknown"}, 500); } finally { await db.close(); }`;

console.log("Summary of changes:");
console.log("================");
console.log("\n1. REMOVED FALLBACKS:");
console.log("   - No more: 'request.body && request.body.json ? request.body.json : request.body || {}'");
console.log("   - Instead: explicit detection of request.body.json.code | json | code | body");
console.log("\n2. CLEARER EXCEPTIONS:");
console.log("   - Lists EXACT field names that are missing or invalid");
console.log("   - Example: missing: ['connection.username'] (not generic 'missing parameters')");
console.log("\n3. STRICTNESS:");
console.log("   - Validates every required field individually");
console.log("   - Checks type (must be string)");
console.log("   - Checks length (must be non-empty)");
console.log("\nNOTE: These codes are ready to deploy via:");
console.log("  POST /api/endpoint with handler=JS");
console.log("  Endpoint IDs:");
console.log("    describe_all_tables: 18c23475-a6d1-4070-955b-685f3947fb62");
console.log("    describe_table_structure: 9a4e24c9-f563-42b2-b7db-b4bc4b03c5c1");
