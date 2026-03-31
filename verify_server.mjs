import http from 'http';
import { promisify } from 'util';

const newValidationCode = {
  describe_all_tables: `if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) { $_EXCEPTION_("Invalid request: expected JSON object in body", {received_type: typeof request.body}, 400); }
let payload = null;
if (request.body.json && typeof request.body.json === "object" && !Array.isArray(request.body.json)) { payload = request.body.json.code && typeof request.body.json.code === "object" && !Array.isArray(request.body.json.code) ? request.body.json.code : request.body.json; } else if (request.body.code && typeof request.body.code === "object" && !Array.isArray(request.body.code)) { payload = request.body.code; } else if (request.body.connection) { payload = request.body; }
if (!payload || typeof payload !== "object" || Array.isArray(payload)) { $_EXCEPTION_("Could not extract payload", {checked: ["body.json.code", " body.json", "body.code", "body"]}, 400); }
const connection = payload.connection;
const schema = payload.schema;
if (!connection || typeof connection !== "object") { $_EXCEPTION_("Missing 'connection' object", {}, 400); }
const missingFields = [];
const invalidFields = [];
for (const f of ["database", "username", "password", "dialect", "host"]) { const v = connection[f]; if (!v) missingFields.push("connection." + f); else if (typeof v !== "string" || !v.trim()) invalidFields.push("connection." + f); }
if (missingFields.length || invalidFields.length) { $_EXCEPTION_("Invalid connection", {missing: missingFields.length > 0 ? missingFields : undefined, invalid: invalidFields.length > 0 ? invalidFields : undefined}, 400); }
const sequelizeConfig = { ...connection, database: connection.database.trim(), username: connection.username.trim(), password: connection.password.trim(), dialect: connection.dialect.trim(), host: connection.host.trim() };
const db = new sequelize.Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);
try { await db.authenticate(); const queryInterface = db.getQueryInterface(); const normalizedSchema = typeof schema === "string" ? schema.trim() : null; let tables; if (typeof queryInterface.listTables === "function") { tables = await queryInterface.listTables(normalizedSchema ? { schema: normalizedSchema } : {}); } else { tables = await queryInterface.showAllTables(); } const result = {}; for (const tableEntry of tables) { const tableName = typeof tableEntry === "string" ? tableEntry : (tableEntry.tableName || tableEntry.table_name || String(tableEntry)); const tableSchema = typeof tableEntry === "object" ? (tableEntry.schema || tableEntry.table_schema || normalizedSchema || null) : (normalizedSchema || null); try { const tableRef = tableSchema ? { tableName, schema: tableSchema } : tableName; const columns = await queryInterface.describeTable(tableRef); result[tableName] = { schema: tableSchema, columns }; } catch (err) { result[tableName] = { schema: tableSchema, error: err?.message || "Failed" }; } } $_RETURN_DATA_ = { ok: true, dialect: db.getDialect(), schema: normalizedSchema, table_count: tables.length, tables: result }; } catch (error) { $_EXCEPTION_("Database error", {message: error?.message || "Unknown"}, 500); } finally { await db.close(); }`,
  
  describe_table_structure: `if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) { $_EXCEPTION_("Invalid request", {}, 400); }
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
if (missingFields.length || invalidFields.length) { $_EXCEPTION_("Invalid parameters", {missing: missingFields.length > 0 ? missingFields : undefined, invalid: invalidFields.length > 0 ? invalidFields : undefined}, 400); }
const sequelizeConfig = { ...connection, database: connection.database.trim(), username: connection.username.trim(), password: connection.password.trim(), dialect: connection.dialect.trim(), host: connection.host.trim() };
const db = new sequelize.Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);
try { await db.authenticate(); const queryInterface = db.getQueryInterface(); const normalizedSchema = typeof schema === "string" ? schema.trim() : null; const normalizedTable = table.trim(); const tableRef = normalizedSchema ? { tableName: normalizedTable, schema: normalizedSchema } : normalizedTable; const columns = await queryInterface.describeTable(tableRef); $_RETURN_DATA_ = { ok: true, dialect: db.getDialect(), table: normalizedTable, schema: normalizedSchema, columns }; } catch (error) { $_EXCEPTION_("Unable to describe table", {message: error?.message || "Unknown"}, 500); } finally { await db.close(); }`
};

// Test connection first
const testReq = http.request({ host: 'localhost', port: 3000, path: '/api/apps', method: 'GET' }, (res) => {
  console.log('✓ Server is responding');
  if (res.statusCode === 200 || res.statusCode === 401) {
    console.log('✓ Server is ready to accept updates\n');
    console.log('Next: Use the API tools to apply these endpoint updates:');
    console.log('  1. Update describe_all_tables (ID: 18c23475-a6d1-4070-955b-685f3947fb62)');
    console.log('  2. Update describe_table_structure (ID: 9a4e24c9-f563-42b2-b7db-b4bc4b03c5c1)');
    process.exit(0);
  }
});

testReq.on('error', (e) => {
  console.error('✗ Server not responding yet');
  console.log('  Error:', e.message);
  process.exit(1);
});

testReq.end();
