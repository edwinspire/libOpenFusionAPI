import fs from "node:fs";
import path from "node:path";

const DEFAULT_SERVER_KEY = "openfusion_system_remote_prd";

function normalizeJsonc(source) {
  const withoutBlockComments = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutLineComments = withoutBlockComments.replace(/^\s*\/\/.*$/gm, "");
  return withoutLineComments.replace(/,\s*([}\]])/g, "$1");
}

function resolveMcpConfig(serverKey) {
  const appData = process.env.APPDATA;
  if (!appData) {
    throw new Error("APPDATA is not defined. Unable to resolve VS Code mcp.json.");
  }

  const mcpPath = path.join(appData, "Code", "User", "mcp.json");
  if (!fs.existsSync(mcpPath)) {
    throw new Error(`mcp.json not found at ${mcpPath}`);
  }

  const raw = fs.readFileSync(mcpPath, "utf8");
  const parsed = JSON.parse(normalizeJsonc(raw));
  const server = parsed?.servers?.[serverKey];

  if (!server) {
    throw new Error(`Server key '${serverKey}' not found in ${mcpPath}`);
  }

  const url = server.url;
  const auth = server?.headers?.Authorization || server?.headers?.authorization;

  if (!url) throw new Error(`Server '${serverKey}' does not have a URL.`);
  if (!auth) throw new Error(`Server '${serverKey}' does not have Authorization header.`);

  return { url, auth, mcpPath };
}

async function callMcp(mcpUrl, authorization, method, params = {}) {
  const response = await fetch(mcpUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: authorization,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${rawText.slice(0, 500)}`);
  }

  for (const line of rawText.split("\n")) {
    if (line.startsWith("data: ")) return JSON.parse(line.slice(6));
  }

  return JSON.parse(rawText);
}

async function main() {
  const cfg = resolveMcpConfig(DEFAULT_SERVER_KEY);
  console.log(`Using MCP server: ${DEFAULT_SERVER_KEY}`);
  console.log(`mcp.json: ${cfg.mcpPath}`);

  const result = await callMcp(cfg.url, cfg.auth, "tools/list");
  if (result?.error) {
    throw new Error(`tools/list failed: ${JSON.stringify(result.error)}`);
  }

  const tools = result?.result?.tools;
  if (!Array.isArray(tools) || tools.length === 0) {
    throw new Error("tools/list returned no tools.");
  }

  const missingDescription = [];
  const missingInputSchema = [];

  for (const tool of tools) {
    const name = String(tool?.name || "").trim();
    const description = String(tool?.description || "").trim();
    const inputSchema = tool?.inputSchema;

    if (!name) continue;
    if (!description) missingDescription.push(name);
    if (!inputSchema || typeof inputSchema !== "object") missingInputSchema.push(name);
  }

  console.log(`Tools discovered: ${tools.length}`);
  console.log(`Missing description: ${missingDescription.length}`);
  console.log(`Missing inputSchema: ${missingInputSchema.length}`);

  if (missingDescription.length > 0) {
    console.error("Tools without description:");
    for (const name of missingDescription) console.error(` - ${name}`);
  }

  if (missingInputSchema.length > 0) {
    console.error("Tools without inputSchema:");
    for (const name of missingInputSchema) console.error(` - ${name}`);
  }

  if (missingDescription.length > 0 || missingInputSchema.length > 0) {
    process.exit(1);
  }

  console.log("OK: all tools expose description and inputSchema.");
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(2);
});
