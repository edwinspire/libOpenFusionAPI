import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const HOST = "127.0.0.1";
const PORT = 3101;
const MCP_URL = `http://${HOST}:${PORT}/api/system/mcp/server/prd`;
const RESULT_PATH = path.join(process.cwd(), "test", ".mcp_tool_descriptions.result.json");
const DEBUG_PATH = path.join(process.cwd(), "test", ".mcp_tool_descriptions.debug.json");

const expectedPhrases = {
  app_create_update: [
    "first step in the recommended workflow",
    "create shared AppVars with 'appvar_upsert'",
    "attach endpoints with 'endpoint_upsert'",
  ],
  validate_json_schema_for_mcp: [
    "operationally compatible with OpenFusionAPI MCP",
    "use this tool before publishing any json_schema",
    "checks normalization, jsonSchemaToZod conversion, and MCP serialization behavior",
  ],
  endpoint_upsert: [
    "Creates or updates an endpoint attached to an existing application",
    "define reusable AppVars per environment (`dev`, `qa`, `prd`)",
    "by choosing both the handler and the HTTP method explicitly",
  ],
  appvar_upsert: [
    "Creates or updates a reusable application variable for a target `idapp` and `environment`",
    "before creating endpoints",
    "Supported environments commonly used by agents are `dev`, `qa`, and `prd`",
  ],
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseRpcPayload(text) {
  const trimmed = String(text ?? "").trim();

  if (!trimmed) {
    throw new Error("Empty MCP response body");
  }

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  return parseSsePayload(text);
}

async function rpcCall(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const payload = parseRpcPayload(text);

  if (payload?.error) {
    const error = new Error(`MCP RPC error on ${body.method}: ${JSON.stringify(payload.error)}`);
    error.responseText = text;
    error.status = response.status;
    throw error;
  }

  return {
    response,
    text,
    payload,
  };
}

async function waitForServer(url, timeoutMs = 60000) {
  const startedAt = Date.now();
  let lastError = null;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      await rpcCall(url, {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: {
            name: "mcp-tool-descriptions-test",
            version: "1.0.0",
          },
        },
      });

      const result = await rpcCall(url, {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {},
      });

      if (Array.isArray(result?.payload?.result?.tools)) {
        return result.payload;
      }
    } catch (error) {
      lastError = error;
    }

    await sleep(1000);
  }

  if (lastError) {
    throw new Error(`Timed out waiting for MCP server at ${url}. Last error: ${lastError.message}`);
  }

  throw new Error(`Timed out waiting for MCP server at ${url}`);
}

function parseSsePayload(text) {
  const line = text.split(/\r?\n/).find((item) => item.startsWith("data: "));
  if (!line) {
    throw new Error("No SSE data payload found in tools/list response");
  }

  return JSON.parse(line.slice(6));
}

function getToolDescription(tools, name) {
  return tools.find((tool) => tool?.name === name)?.description ?? null;
}

function getToolDefinition(tools, name) {
  return tools.find((tool) => tool?.name === name) ?? null;
}

function assertNoSchemaFallbackWarnings(logText, toolNames) {
  for (const toolName of toolNames) {
    const marker = `[MCP] Tool schema serialization failed for ${toolName}`;
    if (logText.includes(marker)) {
      throw new Error(`Unexpected MCP schema fallback warning detected for ${toolName}`);
    }
  }
}

function schemaHasProperty(schema, propertyName, seen = new Set()) {
  if (!schema || typeof schema !== "object") {
    return false;
  }

  if (seen.has(schema)) {
    return false;
  }
  seen.add(schema);

  if (schema.properties && typeof schema.properties === "object" && schema.properties[propertyName]) {
    return true;
  }

  const nestedCollections = [schema.allOf, schema.anyOf, schema.oneOf, schema.prefixItems];
  for (const collection of nestedCollections) {
    if (Array.isArray(collection) && collection.some((item) => schemaHasProperty(item, propertyName, seen))) {
      return true;
    }
  }

  if (schema.items && schemaHasProperty(schema.items, propertyName, seen)) {
    return true;
  }

  if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
    return schemaHasProperty(schema.additionalProperties, propertyName, seen);
  }

  return false;
}

async function main() {
  const cwd = process.cwd();
  const child = spawn(
    process.execPath,
    ["./src/server.js"],
    {
      cwd,
      env: {
        ...process.env,
        HOST,
        PORT: String(PORT),
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  const stdoutChunks = [];
  const stderrChunks = [];

  child.stdout.on("data", (chunk) => stdoutChunks.push(String(chunk)));
  child.stderr.on("data", (chunk) => stderrChunks.push(String(chunk)));

  const waitForClose = () => new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve();
      return;
    }

    child.once("close", () => resolve());
  });

  const cleanup = async () => {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGTERM");
      await Promise.race([waitForClose(), sleep(3000)]);
    }

    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
      await Promise.race([waitForClose(), sleep(3000)]);
    }
  };

  try {
    const payload = await waitForServer(MCP_URL);
    const tools = Array.isArray(payload?.result?.tools) ? payload.result.tools : [];
    const combinedLogs = `${stdoutChunks.join("")}\n${stderrChunks.join("")}`;

    assertNoSchemaFallbackWarnings(combinedLogs, [
      "app_create_update",
      "endpoint_upsert",
      "appvar_upsert",
    ]);

    for (const [toolName, phrases] of Object.entries(expectedPhrases)) {
      const description = getToolDescription(tools, toolName);
      if (!description) {
        throw new Error(`Tool ${toolName} was not exposed by tools/list`);
      }

      for (const phrase of phrases) {
        if (!description.includes(phrase)) {
          throw new Error(`Tool ${toolName} is missing phrase: ${phrase}`);
        }
      }
    }

    const appCreateUpdateTool = getToolDefinition(tools, "app_create_update");
    const appCreateUpdateSchema = appCreateUpdateTool?.inputSchema;

    if (!schemaHasProperty(appCreateUpdateSchema, "app") || !schemaHasProperty(appCreateUpdateSchema, "enabled")) {
      throw new Error("Tool app_create_update lost its expected structured input schema in tools/list");
    }

    const result = {
      ok: true,
      checkedTools: Object.keys(expectedPhrases),
      port: PORT,
    };

    fs.writeFileSync(RESULT_PATH, JSON.stringify(result, null, 2));
    if (fs.existsSync(DEBUG_PATH)) {
      fs.rmSync(DEBUG_PATH);
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    fs.writeFileSync(DEBUG_PATH, JSON.stringify({
      error: error?.message ?? String(error),
      stdout: stdoutChunks.join(""),
      stderr: stderrChunks.join(""),
    }, null, 2));
    throw error;
  } finally {
    await cleanup();
  }
}

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error(error?.message ?? String(error));
  process.exit(1);
}