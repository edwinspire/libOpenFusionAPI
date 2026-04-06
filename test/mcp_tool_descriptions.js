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

async function waitForServer(url, timeoutMs = 60000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
      });

      const text = await response.text();
      if (text.includes('"tools"')) {
        return text;
      }
    } catch {
      // Server still booting.
    }

    await sleep(1000);
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
    const text = await waitForServer(MCP_URL);
    const payload = parseSsePayload(text);
    const tools = Array.isArray(payload?.result?.tools) ? payload.result.tools : [];

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