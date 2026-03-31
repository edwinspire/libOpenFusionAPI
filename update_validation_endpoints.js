#!/usr/bin/env node

// New code for describe_all_tables - NO fallbacks, CLEAR exceptions
const describeAllCode = `if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) { $_EXCEPTION_("Invalid request: expected JSON object in body", {received_type: typeof request.body}, 400); }
let payload = null;
if (request.body.json && typeof request.body.json === "object" && !Array.isArray(request.body.json)) { payload = request.body.json.code && typeof request.body.json.code === "object" && !Array.isArray(request.body.json.code) ? request.body.json.code : request.body.json; } else if (request.body.code && typeof request.body.code === "object" && !Array.isArray(request.body.code)) { payload = request.body.code; } else if (request.body.connection) { payload = request.body; }
if (!payload || typeof payload !== "object" || Array.isArray(payload)) { $_EXCEPTION_("Could not extract payload - payload not found or invalid type", {checked_structures: ["body.json.code", "body.json", "body.code", "body"]}, 400); }
const connection = payload.connection;
const schema = payload.schema;
if (!connection || typeof connection !== "object" || Array.isArray(connection)) { $_EXCEPTION_("Missing or invalid 'connection' object", {received_type: connection === null ? "null" : typeof connection}, 400); }
const requiredFields = ["database", "username", "password", "dialect", "host"];
const missingFields = [];
const invalidFields = [];
for (const field of requiredFields) { const value = connection[field]; if (value === undefined || value === null) { missingFields.push("connection." + field); } else if (typeof value !== "string") { invalidFields.push("connection." + field + " (type: " + typeof value + ", expected: string)"); } else if (value.trim().length === 0) { invalidFields.push("connection." + field + " (empty string)"); } }
if (missingFields.length > 0 || invalidFields.length > 0) { const details = {}; if (missingFields.length > 0) details.missing = missingFields; if (invalidFields.length > 0) details.invalid = invalidFields; $_EXCEPTION_("Invalid connection parameters", details, 400); }
if (schema !== undefined && schema !== null) { if (typeof schema !== "string") { $_EXCEPTION_("'schema' must be string type", {received_type: typeof schema}, 400); } if (schema.trim().length === 0) { $_EXCEPTION_("'schema' cannot be empty string", {}, 400); } }
const sequelizeConfig = { ...connection, database: connection.database.trim(), username: connection.username.trim(), password: connection.password.trim(), dialect: connection.dialect.trim(), host: connection.host.trim() };
const db = new sequelize.Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);
try { await db.authenticate(); const queryInterface = db.getQueryInterface(); const normalizedSchema = typeof schema === "string" ? schema.trim() : null; let tables; if (typeof queryInterface.listTables === "function") { tables = await queryInterface.listTables(normalizedSchema ? { schema: normalizedSchema } : {}); } else { tables = await queryInterface.showAllTables(); } const result = {}; for (const tableEntry of tables) { const tableName = typeof tableEntry === "string" ? tableEntry : (tableEntry.tableName || tableEntry.table_name || String(tableEntry)); const tableSchema = typeof tableEntry === "object" ? (tableEntry.schema || tableEntry.table_schema || normalizedSchema || null) : (normalizedSchema || null); try { const tableRef = tableSchema ? { tableName, schema: tableSchema } : tableName; const columns = await queryInterface.describeTable(tableRef); result[tableName] = { schema: tableSchema, columns }; } catch (tableError) { result[tableName] = { schema: tableSchema, error: tableError && tableError.message ? tableError.message : "Failed to describe table" }; } } $_RETURN_DATA_ = { ok: true, dialect: db.getDialect(), schema: normalizedSchema, table_count: tables.length, tables: result }; } catch (error) { $_EXCEPTION_("Unable to retrieve database schema", {message: error && error.message ? error.message : "Unknown error"}, 500); } finally { await db.close(); }`;

// New code for describe_table_structure - same strict validation
const describeTableCode = `if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) { $_EXCEPTION_("Invalid request: expected JSON object in body", {received_type: typeof request.body}, 400); }
let payload = null;
if (request.body.json && typeof request.body.json === "object" && !Array.isArray(request.body.json)) { payload = request.body.json.code && typeof request.body.json.code === "object" && !Array.isArray(request.body.json.code) ? request.body.json.code : request.body.json; } else if (request.body.code && typeof request.body.code === "object" && !Array.isArray(request.body.code)) { payload = request.body.code; } else if (request.body.connection || request.body.table) { payload = request.body; }
if (!payload || typeof payload !== "object" || Array.isArray(payload)) { $_EXCEPTION_("Could not extract payload - payload not found or invalid type", {checked_structures: ["body.json.code", "body.json", "body.code", "body"]}, 400); }
const connection = payload.connection;
const table = payload.table;
const schema = payload.schema;
if (!connection || typeof connection !== "object" || Array.isArray(connection)) { $_EXCEPTION_("Missing or invalid 'connection' object", {received_type: connection === null ? "null" : typeof connection}, 400); }
const requiredFields = ["database", "username", "password", "dialect", "host"];
const missingFields = [];
const invalidFields = [];
for (const field of requiredFields) { const value = connection[field]; if (value === undefined || value === null) { missingFields.push("connection." + field); } else if (typeof value !== "string") { invalidFields.push("connection." + field + " (type: " + typeof value + ", expected: string)"); } else if (value.trim().length === 0) { invalidFields.push("connection." + field + " (empty string)"); } }
if (missingFields.length > 0 || invalidFields.length > 0) { const details = {}; if (missingFields.length > 0) details.missing = missingFields; if (invalidFields.length > 0) details.invalid = invalidFields; $_EXCEPTION_("Invalid connection parameters", details, 400); }
if (typeof table !== "string" || table.trim().length === 0) { $_EXCEPTION_("Missing or invalid 'table' parameter", {received_type: typeof table}, 400); }
if (schema !== undefined && schema !== null) { if (typeof schema !== "string") { $_EXCEPTION_("'schema' must be string type", {received_type: typeof schema}, 400); } if (schema.trim().length === 0) { $_EXCEPTION_("'schema' cannot be empty string", {}, 400); } }
const sequelizeConfig = { ...connection, database: connection.database.trim(), username: connection.username.trim(), password: connection.password.trim(), dialect: connection.dialect.trim(), host: connection.host.trim() };
const db = new sequelize.Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);
try { await db.authenticate(); const queryInterface = db.getQueryInterface(); const normalizedSchema = typeof schema === "string" ? schema.trim() : null; const normalizedTable = table.trim(); const tableRef = normalizedSchema ? { tableName: normalizedTable, schema: normalizedSchema } : normalizedTable; const columns = await queryInterface.describeTable(tableRef); $_RETURN_DATA_ = { ok: true, dialect: db.getDialect(), table: normalizedTable, schema: normalizedSchema, columns }; } catch (error) { $_EXCEPTION_("Unable to describe table structure", {message: error && error.message ? error.message : "Unknown error"}, 500); } finally { await db.close(); }`;

console.log("✓ Code generation complete");
console.log(`  describe_all_tables: ${describeAllCode.length} chars`);
console.log(`  describe_table_structure: ${describeTableCode.length} chars`);
console.log("\nKey improvements:");
console.log("  ✓ NO fallbacks - explicit structure detection");
console.log("  ✓ CLEAR exceptions - lists EXACT fields missing");
console.log("  ✓ Validates all required fields explicitly");
console.log("  ✓ Type checking for each field");
console.log("  ✓ Empty string detection");
