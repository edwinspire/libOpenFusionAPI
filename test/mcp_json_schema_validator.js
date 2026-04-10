import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const HOST = "127.0.0.1";
const PORT = 3102;
const MCP_URL = `http://${HOST}:${PORT}/api/system/mcp/server/prd`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseSsePayload(text) {
  const line = text.split(/\r?\n/).find((item) => item.startsWith("data: "));
  if (!line) {
    throw new Error("No SSE data payload found in MCP response");
  }

  return JSON.parse(line.slice(6));
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
  const payload = parseSsePayload(text);

  if (payload?.error) {
    throw new Error(`MCP RPC error on ${body.method}: ${JSON.stringify(payload.error)}`);
  }

  return payload;
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
            name: "mcp-json-schema-validator-test",
            version: "1.0.0",
          },
        },
      });

      return;
    } catch (error) {
      lastError = error;
    }

    await sleep(1000);
  }

  throw new Error(`Timed out waiting for MCP server at ${url}. Last error: ${lastError?.message || "unknown"}`);
}

async function main() {
  const child = spawn(process.execPath, ["./src/server.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      HOST,
      PORT: String(PORT),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const stdoutChunks = [];
  const stderrChunks = [];

  child.stdout.on("data", (chunk) => stdoutChunks.push(String(chunk)));
  child.stderr.on("data", (chunk) => stderrChunks.push(String(chunk)));

  const cleanup = async () => {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGTERM");
      await sleep(2000);
    }

    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
      await sleep(1000);
    }
  };

  try {
    await waitForServer(MCP_URL);

    const validPayload = await rpcCall(MCP_URL, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "validate_json_schema_for_mcp",
        arguments: {
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            required: ["name"],
            additionalProperties: false,
          },
          include_normalized_schema: true,
        },
      },
    });

    const validResultText = validPayload?.result?.content?.[0]?.text;
    const validResult = JSON.parse(validResultText);

    assert.equal(validResult.valid, true, "Expected valid schema to be accepted");
    assert.equal(validResult.compatible, true, "Expected compatible schema to pass operational validation");
    assert.equal(validResult.stages.mcpSerialization, true, "Expected operational validation to reach MCP serialization stage");
    assert.ok(validResult.normalizedSchema, "Expected normalized schema to be returned when requested");

    const warningPayload = await rpcCall(MCP_URL, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "validate_json_schema_for_mcp",
        arguments: {
          schema: {
            type: "object",
            properties: {
              status: { type: "string" },
            },
            if: {
              properties: {
                status: { const: "active" },
              },
            },
            then: {
              required: ["status"],
            },
          },
        },
      },
    });

    const warningResultText = warningPayload?.result?.content?.[0]?.text;
    const warningResult = JSON.parse(warningResultText);

    assert.equal(warningResult.compatible, true, "Expected schema with removable unsupported keywords to remain compatible");
    assert.ok(
      warningResult.warnings.some((item) => item.includes("unsupported JSON Schema keywords")),
      "Expected warning about unsupported JSON Schema keywords removed during normalization",
    );

    const invalidPayload = await rpcCall(MCP_URL, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "validate_json_schema_for_mcp",
        arguments: {
          schema_text: "{ invalid json",
        },
      },
    });

    const invalidResultText = invalidPayload?.result?.content?.[0]?.text;
    const invalidResult = JSON.parse(invalidResultText);

    assert.equal(invalidResult.compatible, false, "Expected malformed schema_text to fail validation");
    assert.ok(
      invalidResult.errors.some((item) => item.includes("schema_text is not valid JSON")),
      "Expected parse error for malformed schema_text",
    );

    const combinedLogs = `${stdoutChunks.join("")}\n${stderrChunks.join("")}`;
    assert.ok(
      !combinedLogs.includes("[MCP] Tool schema serialization failed for validate_json_schema_for_mcp"),
      "Validator tool should not trigger schema serialization fallback warnings",
    );
  } finally {
    await cleanup();
  }
}

await main();