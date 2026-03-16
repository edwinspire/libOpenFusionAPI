const BASE_URL = process.env.OFAPI_BASE_URL || "http://localhost:3000";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const text = await response.text();
  return {
    status: response.status,
    headers: response.headers,
    text,
  };
}

function parseJson(text, context) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${context}: invalid JSON response`);
  }
}

function parseSseData(text, context) {
  const dataLine = text
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("data:"));

  if (!dataLine) {
    throw new Error(`${context}: SSE payload has no data line`);
  }

  const payload = dataLine.slice("data:".length).trim();
  return parseJson(payload, context);
}

async function run() {
  console.log(`[smoke] BASE_URL=${BASE_URL}`);

  console.log("[smoke] 1/3 login endpoint");
  const login = await request("/api/system/system/login/prd", {
    method: "POST",
    headers: {
      Authorization: "Basic c3VwZXJ1c2VyOnN1cGVydXNlcg==",
    },
  });

  assert(login.status === 200, `login expected 200, got ${login.status}`);
  const loginJson = parseJson(login.text, "login");
  assert(loginJson.login === true, "login response does not contain login=true");

  console.log("[smoke] 2/3 protected endpoint with invalid basic");
  const invalidBasic = await request("/api/demo/ofapi/javascript/example02/dev", {
    method: "GET",
    headers: {
      Authorization: "Basic YmFkOnBhc3M=",
    },
  });

  assert(
    invalidBasic.status === 401,
    `invalid basic expected 401, got ${invalidBasic.status}`,
  );

  console.log("[smoke] 3/3 mcp initialize");
  const mcp = await request("/api/demo/mcp/server/dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "smoke", version: "1.0" },
      },
    }),
  });

  assert(mcp.status === 200, `mcp initialize expected 200, got ${mcp.status}`);
  const mcpData = parseSseData(mcp.text, "mcp initialize");
  assert(
    mcpData?.result?.serverInfo?.name === "OpenFusionAPI MCP Server",
    "mcp initialize serverInfo.name mismatch",
  );

  console.log("[smoke] OK");
}

run().catch((error) => {
  console.error("[smoke] FAIL:", error.message);
  process.exit(1);
});
