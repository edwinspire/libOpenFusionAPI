/**
 * Quick test for the describe_all_tables endpoint (POST /api/db/schema).
 * Run: node scripts/test_describe_all_tables.js
 */
const TOKEN =
  "Bearer OFAPI_KEY@eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFwaWtleSI6eyJpZGFwcCI6ImNmY2QyMDg0LTk1ZDUtNjVlZi02NmU3LWRmZjlmOTg3NjRkYSIsImlkY2xpZW50IjoiMDEwMDczZmMtZjc4ZS00MWFjLTliMWItNDgxNjZkNTEzZDYwIn19LCJleHAiOjE5MDM1NjQ4MDAsIm5iZiI6MTc3NDY1NjAwMCwiaWF0IjoxNzc0NzI0MDI2fQ.XHlApqQsPql-seJmSQF3FuAK-IXEyGFXOSIcxyAxDdY";

const BASE = "http://localhost:3000";
// URL format: /api/{app}/{resource}/{environment}
// app=system, resource=/api/db/schema, environment=prd  →  /api/system/api/db/schema/prd
const ENDPOINT_PATH = "/api/system/api/db/schema/prd";

const body = {
  connection: {
    database: "msdb",
    username: "sa",
    password: "sqlfarma",
    appName: "OpenFusionAPIPortalClientes",
    options: {
      host: "192.168.147.32",
      dialect: "mssql",
      dialectOptions: {
        options: {
          requestTimeout: 600000,
        },
      },
    },
  },
};

(async () => {
  console.log("POST", BASE + ENDPOINT_PATH);
  try {
    const res = await fetch(BASE + ENDPOINT_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    console.log("Status:", res.status);

    if (data && data.ok) {
      console.log("Dialect:", data.dialect);
      console.log("Tables found:", data.table_count);
      const names = Object.keys(data.tables || {});
      console.log("Table names:", names.slice(0, 20));
      if (names.length > 0) {
        const first = names[0];
        console.log(`\nFirst table (${first}) columns:`);
        console.log(JSON.stringify(data.tables[first].columns, null, 2));
      }
    } else {
      console.log("Response:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
})();
