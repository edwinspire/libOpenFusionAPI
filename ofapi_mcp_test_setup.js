const token = "Bearer OFAPI_KEY@eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFwaWtleSI6eyJpZGFwcCI6ImNmY2QyMDg0LTk1ZDUtNjVlZi02NmU3LWRmZjlmOTg3NjRkYSIsImlkY2xpZW50IjoiMDEwMDczZmMtZjc4ZS00MWFjLTliMWItNDgxNjZkNTEzZDYwIn19LCJleHAiOjE5MDM1NjQ4MDAsIm5iZiI6MTc3NDY1NjAwMCwiaWF0IjoxNzc0NzI0MDI2fQ.XHlApqQsPql-seJmSQF3FuAK-IXEyGFXOSIcxyAxDdY";
const base = "http://localhost:3000";
const headers = { "Content-Type": "application/json", Authorization: token };
const appName = `test_mcp_time_${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}`;

async function jfetch(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

(async () => {
  const appPayload = { app: appName, enabled: 1, description: "Aplicacion de prueba MCP para endpoint de hora actual" };
  const appResp = await jfetch(`${base}/api/system/api/app/prd`, { method: "POST", headers, body: JSON.stringify(appPayload) });
  if (appResp.status >= 300) {
    console.log(JSON.stringify({ step: "create_app", ok: false, response: appResp }, null, 2));
    process.exit(1);
  }

  const idapp = appResp.data?.idapp;
  const appVarPayload = {
    idapp,
    name: "TZ",
    type: "string",
    environment: "prd",
    value: "America/Bogota"
  };
  const appVarResp = await jfetch(`${base}/api/system/app/var/prd`, { method: "POST", headers, body: JSON.stringify(appVarPayload) });
  if (appVarResp.status >= 300) {
    console.log(JSON.stringify({ step: "create_appvar", ok: false, idapp, response: appVarResp }, null, 2));
    process.exit(1);
  }

  const endpointResource = `/test/time/now/${appName}`;
  const jsCode = `const now = new Date();\n$_RETURN_DATA_ = {\n  now_iso: now.toISOString(),\n  now_local: now.toString(),\n  epoch_ms: now.getTime(),\n  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone\n};`;

  const endpointPayload = {
    idapp,
    environment: "prd",
    timeout: 30,
    resource: endpointResource,
    method: "GET",
    handler: "JS",
    access: 2,
    title: "Hora actual",
    description: "Endpoint de prueba que retorna hora actual del servidor",
    price_by_request: 1,
    price_kb_request: 1,
    price_kb_response: 1,
    keywords: "test,time,now",
    code: jsCode,
    cache_time: 0,
    mcp: {
      enabled: true,
      name: `test_time_now_${appName}`,
      title: "Test time now",
      description: "Devuelve la hora actual del servidor usando handler JS"
    },
    json_schema: {
      in: { enabled: true, schema: { type: "object", properties: {}, additionalProperties: false } },
      out: {
        enabled: true,
        schema: {
          type: "object",
          properties: {
            now_iso: { type: "string" },
            now_local: { type: "string" },
            epoch_ms: { type: "integer" },
            timezone: { type: "string" }
          },
          additionalProperties: true
        }
      }
    }
  };

  const endpointResp = await jfetch(`${base}/api/system/api/endpoint/prd`, { method: "POST", headers, body: JSON.stringify(endpointPayload) });
  if (endpointResp.status >= 300) {
    console.log(JSON.stringify({ step: "create_endpoint", ok: false, idapp, response: endpointResp }, null, 2));
    process.exit(1);
  }

  const created = {
    app: { app: appName, idapp },
    appvar: appVarResp.data,
    endpoint: {
      idendpoint: endpointResp.data?.idendpoint,
      resource: endpointResource,
      method: "GET",
      handler: "JS",
      mcp_tool: `test_time_now_${appName}`
    }
  };

  console.log(JSON.stringify({ ok: true, created }, null, 2));
})();
