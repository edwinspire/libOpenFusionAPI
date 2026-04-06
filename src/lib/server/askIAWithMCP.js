import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const DEFAULT_CLIENT_NAME = "openfusion-ia-chat-runtime";
const DEFAULT_CLIENT_VERSION = "1.0.0";
const DEFAULT_TIMEOUT = 60000;
const DEFAULT_MAX_TOOL_ROUNDS = 6;
const DEFAULT_PLACEHOLDER_API_KEY = "openfusion-local";

let legacyRpcRequestId = 1;

const isPlainObject = (value) => {
  return value != null && typeof value === "object" && !Array.isArray(value);
};

const normalizeArray = (value) => {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const toContentText = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item?.text === "string") {
          return item.text;
        }

        if (typeof item?.content === "string") {
          return item.content;
        }

        return JSON.stringify(item);
      })
      .join("\n")
      .trim();
  }

  if (value == null) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const safeJsonParse = (value, fallbackValue = {}) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallbackValue;
  }

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    return fallbackValue;
  }
};

const splitSseEvents = (text) => {
  if (typeof text !== "string" || text.trim() === "") {
    return [];
  }

  return text
    .split(/\r?\n\r?\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
};

const parseSsePayloads = (text) => {
  const events = splitSseEvents(text);
  const payloads = [];

  for (const eventText of events) {
    const dataLines = eventText
      .split(/\r?\n/g)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .filter(Boolean);

    if (dataLines.length === 0) {
      continue;
    }

    const payload = safeJsonParse(dataLines.join("\n"), null);
    if (payload) {
      payloads.push(payload);
    }
  }

  return payloads;
};

const normalizeToolArguments = (value) => {
  if (isPlainObject(value)) {
    return value;
  }

  const parsed = safeJsonParse(value, {});
  return isPlainObject(parsed) ? parsed : {};
};

const normalizeOpenAIBaseUrl = (baseUrl) => {
  if (typeof baseUrl !== "string" || baseUrl.trim() === "") {
    return undefined;
  }

  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/v1") ? trimmed : `${trimmed}/v1`;
};

const normalizeHeadersObject = (headers) => {
  if (!isPlainObject(headers)) {
    return undefined;
  }

  const normalized = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value == null) {
      continue;
    }

    normalized[key] = String(value);
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
};

const sanitizeToolNamePart = (value, fallbackValue) => {
  const sanitized = String(value || fallbackValue)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return sanitized || fallbackValue;
};

const isLikelyMutatingTool = (tool) => {
  const text = [tool?.name, tool?.title, tool?.description]
    .filter((value) => typeof value === "string" && value.trim() !== "")
    .join(" ")
    .toLowerCase();

  return /(create|update|upsert|delete|remove|insert|patch|write|set)/.test(text);
};

const buildToolUsageGuidance = (serverBundles) => {
  if (!Array.isArray(serverBundles) || serverBundles.length === 0) {
    return null;
  }

  const lines = [
    "Rules for MCP tool usage:",
    "- Use tools only when they provide real data or perform an action that is necessary to answer.",
    "- If you can answer correctly with general knowledge and do not need external data, answer directly without using tools.",
    "- If the request is informational or read-only, prefer read-only tools.",
    "- Use state-changing tools only when the user explicitly asks to create, update, delete, or change something.",
    "- If a tool fails validation or does not fit the context, try a more appropriate tool before responding.",
    "- Base the decision on each tool's name, description, and input schema.",
    "- Never respond with JSON that merely describes a tool call; either execute the tool for real or provide the final answer to the user.",
    "Available MCP servers:",
  ];

  for (const bundle of serverBundles) {
    const readOnlyTools = [];
    const mutatingTools = [];

    for (const tool of bundle.tools) {
      if (isLikelyMutatingTool(tool)) {
        mutatingTools.push(tool.name);
      } else {
        readOnlyTools.push(tool.name);
      }
    }

    lines.push(`- ${bundle.server.name}:`);
    lines.push(`  URL: ${bundle.server.url}`);
    lines.push(`  Read-only: ${readOnlyTools.join(", ") || "none"}`);
    lines.push(`  Mutating: ${mutatingTools.join(", ") || "none"}`);
  }

  return lines.join("\n");
};

const normalizePromptMessages = (prompts) => {
  const values = normalizeArray(prompts);
  const messages = [];

  for (const item of values) {
    if (typeof item === "string") {
      messages.push({ role: "user", content: item });
      continue;
    }

    if (!isPlainObject(item) || typeof item.role !== "string") {
      continue;
    }

    messages.push({
      role: item.role,
      content: item.content ?? "",
      name: item.name,
    });
  }

  return messages;
};

const buildOpenAIClient = (ai) => {
  if (!isPlainObject(ai)) {
    throw new Error("IA configuration is required.");
  }

  if (typeof ai.model !== "string" || ai.model.trim() === "") {
    throw new Error("IA configuration requires a non-empty `model`.");
  }

  const baseURL = normalizeOpenAIBaseUrl(ai.baseUrl ?? ai.baseURL);
  const timeout = Number(ai.timeout ?? DEFAULT_TIMEOUT);
  const apiKey = ai.apiKey ?? ai.api_key ?? (baseURL ? DEFAULT_PLACEHOLDER_API_KEY : undefined);

  if (!apiKey) {
    throw new Error("IA configuration requires `apiKey` or `baseUrl`/`baseURL`.");
  }

  const client = new OpenAI({
    apiKey,
    baseURL,
    timeout: Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_TIMEOUT,
    defaultHeaders: isPlainObject(ai.headers) ? ai.headers : undefined,
    organization: ai.organization,
    project: ai.project,
  });

  return {
    client,
    model: ai.model.trim(),
    temperature: ai.temperature,
    maxTokens: ai.maxTokens ?? ai.max_tokens,
    toolChoice: ai.toolChoice ?? ai.tool_choice,
    provider: ai.modelProvider ?? ai.provider ?? "openai-compatible",
  };
};

const createLegacySseRpcClient = (server) => {
  const serverUrl = server.url ?? server.serverUrl ?? server.server_url;
  const headers = normalizeHeadersObject(server.headers);
  const timeout = Number(server.timeout ?? DEFAULT_TIMEOUT);

  const rpcCall = async (method, params = {}) => {
    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...(headers || {}),
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: legacyRpcRequestId++,
        method,
        params,
      }),
      signal: AbortSignal.timeout(
        Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_TIMEOUT,
      ),
    });

    const rawText = await response.text();
    const payloads = parseSsePayloads(rawText);
    const rpcPayload = payloads.find((payload) => isPlainObject(payload) && payload.jsonrpc === "2.0");

    if (!rpcPayload) {
      throw new Error(
        `Legacy MCP SSE fallback did not return a JSON-RPC payload. HTTP ${response.status}. Body=${rawText.slice(0, 500)}`,
      );
    }

    if (rpcPayload.error) {
      throw new Error(`Legacy MCP SSE RPC error: ${JSON.stringify(rpcPayload.error)}`);
    }

    return rpcPayload.result;
  };

  return {
    listTools: async () => rpcCall("tools/list", {}),
    callTool: async ({ name, arguments: args = {} }) => {
      return rpcCall("tools/call", {
        name,
        arguments: args,
      });
    },
    close: async () => {},
  };
};

const createTransport = async (server) => {
  const serverUrl = server.url ?? server.serverUrl ?? server.server_url;

  if (typeof serverUrl !== "string" || serverUrl.trim() === "") {
    throw new Error("Each MCP server requires a non-empty `url`.");
  }

  const baseUrl = new URL(serverUrl);
  const transportPriority = normalizeArray(server.transportPriority ?? ["streamable-http", "legacy-sse-http"]);
  const failures = [];

  for (const transportName of transportPriority) {
    try {
      if (transportName === "streamable-http") {
        return {
          transport: new StreamableHTTPClientTransport(baseUrl, {
            requestInit: {
              headers: isPlainObject(server.headers) ? server.headers : undefined,
            },
          }),
          transportType: "streamable-http",
        };
      }

      if (transportName === "legacy-sse-http") {
        return {
          transport: null,
          transportType: "legacy-sse-http",
          legacyClient: createLegacySseRpcClient({
            ...server,
            url: baseUrl.href,
          }),
        };
      }
    } catch (error) {
      failures.push(`${transportName}: ${error.message}`);
    }
  }

  throw new Error(`Unable to create MCP transport for ${serverUrl}. ${failures.join(" | ")}`.trim());
};

const connectMcpServer = async (server, { clientName, clientVersion } = {}) => {
  const { transport, transportType, legacyClient } = await createTransport(server);

  if (legacyClient) {
    return {
      client: legacyClient,
      transport: { close: legacyClient.close },
      transportType,
    };
  }

  const client = new Client({
    name: clientName || DEFAULT_CLIENT_NAME,
    version: clientVersion || DEFAULT_CLIENT_VERSION,
  });

  try {
    await client.connect(transport);
  } catch (primaryError) {
    try {
      await transport.close?.();
    } catch (closeError) {}

    if (transportType === "streamable-http") {
      const fallbackClient = createLegacySseRpcClient(server);
      return {
        client: fallbackClient,
        transport: { close: fallbackClient.close },
        transportType: `legacy-sse-http-fallback (${primaryError.message})`,
      };
    }

    throw primaryError;
  }

  return { client, transport, transportType };
};

const normalizeToolSchema = (schema) => {
  if (isPlainObject(schema)) {
    return schema;
  }

  return {
    type: "object",
    properties: {},
    additionalProperties: true,
  };
};

const extractSyntheticToolParameters = (value) => {
  if (!isPlainObject(value)) {
    return {};
  }

  if (isPlainObject(value.parameters)) {
    return value.parameters;
  }

  if (isPlainObject(value.arguments)) {
    return value.arguments;
  }

  if (isPlainObject(value.args)) {
    return value.args;
  }

  return {};
};

const parseAssistantToolIntent = (content) => {
  if (typeof content !== "string") {
    return null;
  }

  const parsed = safeJsonParse(content, null);
  if (!isPlainObject(parsed) || typeof parsed.name !== "string") {
    const fencedBlocks = Array.from(
      content.matchAll(/```(?:json|javascript|js|python)?\s*([\s\S]*?)```/gi),
    );

    for (let index = fencedBlocks.length - 1; index >= 0; index -= 1) {
      const blockContent = fencedBlocks[index]?.[1]?.trim();
      const blockParsed = safeJsonParse(blockContent, null);

      if (isPlainObject(blockParsed) && typeof blockParsed.name === "string") {
        return {
          name: blockParsed.name,
          parameters: extractSyntheticToolParameters(blockParsed),
        };
      }
    }

    return null;
  }

  return {
    name: parsed.name,
    parameters: extractSyntheticToolParameters(parsed),
  };
};

const buildOpenAITools = (serverBundles) => {
  const tools = [];
  const toolRegistry = new Map();

  for (const bundle of serverBundles) {
    const serverKey = sanitizeToolNamePart(bundle.server.name, "mcp");

    for (const tool of bundle.tools) {
      const alias = `${serverKey}__${sanitizeToolNamePart(tool.name, "tool")}`;
      const shortName = sanitizeToolNamePart(tool.name, "tool");

      toolRegistry.set(alias, {
        alias,
        shortName,
        toolName: tool.name,
        serverName: bundle.server.name,
        serverUrl: bundle.server.url,
        client: bundle.client,
        description: tool.description,
      });

      if (!toolRegistry.has(tool.name)) {
        toolRegistry.set(tool.name, toolRegistry.get(alias));
      }

      if (!toolRegistry.has(shortName)) {
        toolRegistry.set(shortName, toolRegistry.get(alias));
      }

      tools.push({
        type: "function",
        function: {
          name: alias,
          description:
            tool.description
            || `MCP tool ${tool.name} from server ${bundle.server.name}.`,
          parameters: normalizeToolSchema(tool.inputSchema),
        },
      });
    }
  }

  return { tools, toolRegistry };
};

const extractAssistantText = (message) => {
  return toContentText(message?.content).trim();
};

const formatToolResult = (result) => {
  if (typeof result?.content === "string") {
    return result.content;
  }

  if (Array.isArray(result?.content)) {
    return result.content
      .map((item) => {
        if (typeof item?.text === "string") {
          return item.text;
        }

        return JSON.stringify(item);
      })
      .join("\n")
      .trim();
  }

  return JSON.stringify(result);
};

const closeServerBundles = async (serverBundles) => {
  for (const bundle of serverBundles) {
    try {
      await bundle.transport?.close?.();
    } catch (error) {}
  }
};

export const listMcpTools = async ({
  mcpServers,
  clientName = DEFAULT_CLIENT_NAME,
  clientVersion = DEFAULT_CLIENT_VERSION,
} = {}) => {
  const servers = normalizeArray(mcpServers).filter((item) => isPlainObject(item));

  if (servers.length === 0) {
    return [];
  }

  const serverBundles = [];

  try {
    for (const server of servers) {
      const normalizedServer = {
        ...server,
        name: server.name || new URL(server.url ?? server.serverUrl ?? server.server_url).hostname,
        url: server.url ?? server.serverUrl ?? server.server_url,
      };

      const connection = await connectMcpServer(normalizedServer, {
        clientName,
        clientVersion,
      });

      const listResult = await connection.client.listTools();
      serverBundles.push({
        ...connection,
        server: normalizedServer,
        tools: Array.isArray(listResult?.tools) ? listResult.tools : [],
      });
    }

    return serverBundles.map((bundle) => ({
      server: {
        name: bundle.server.name,
        url: bundle.server.url,
        transport: bundle.transportType,
      },
      tools: bundle.tools,
    }));
  } finally {
    await closeServerBundles(serverBundles);
  }
};

export const askIAWithMCP = async ({
  ai,
  mcpServers = [],
  prompts,
  maxToolRounds = DEFAULT_MAX_TOOL_ROUNDS,
  includeDiagnostics = false,
  signal,
} = {}) => {
  const messages = normalizePromptMessages(prompts);

  if (messages.length === 0) {
    throw new Error("At least one prompt/message is required.");
  }

  const aiConfig = buildOpenAIClient(ai);
  const servers = normalizeArray(mcpServers).filter((item) => isPlainObject(item));
  const serverBundles = [];

  try {
    for (const server of servers) {
      const normalizedServer = {
        ...server,
        name: server.name || new URL(server.url ?? server.serverUrl ?? server.server_url).hostname,
        url: server.url ?? server.serverUrl ?? server.server_url,
      };

      const connection = await connectMcpServer(normalizedServer, {
        clientName: ai.clientName ?? DEFAULT_CLIENT_NAME,
        clientVersion: ai.clientVersion ?? DEFAULT_CLIENT_VERSION,
      });

      const listResult = await connection.client.listTools();
      serverBundles.push({
        ...connection,
        server: normalizedServer,
        tools: Array.isArray(listResult?.tools) ? listResult.tools : [],
      });
    }

    const { tools, toolRegistry } = buildOpenAITools(serverBundles);
    const executionLog = [];
    const toolGuidance = buildToolUsageGuidance(serverBundles);
    const roundsLimit = Number.isFinite(Number(maxToolRounds))
      ? Math.max(1, Number(maxToolRounds))
      : DEFAULT_MAX_TOOL_ROUNDS;

    if (toolGuidance) {
      messages.unshift({
        role: "system",
        content: toolGuidance,
      });
    }

    for (let round = 0; round < roundsLimit; round += 1) {
      const completion = await aiConfig.client.chat.completions.create({
        model: aiConfig.model,
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens,
        messages,
        tools: tools.length > 0 ? tools : undefined,
        tool_choice: tools.length > 0 ? aiConfig.toolChoice : undefined,
        signal,
      });

      const assistantMessage = completion?.choices?.[0]?.message;
      if (!assistantMessage) {
        throw new Error("The IA service returned a completion without message.");
      }

      messages.push({
        role: "assistant",
        content: assistantMessage.content ?? "",
        tool_calls: assistantMessage.tool_calls,
      });

      const toolCalls = Array.isArray(assistantMessage.tool_calls)
        ? assistantMessage.tool_calls
        : [];
      const syntheticToolIntent = toolCalls.length === 0
        ? parseAssistantToolIntent(extractAssistantText(assistantMessage))
        : null;

      const effectiveToolCalls = toolCalls.length > 0
        ? toolCalls
        : syntheticToolIntent
          ? [{
            id: `synthetic_tool_call_${round + 1}`,
            type: "function",
            function: {
              name: syntheticToolIntent.name,
              arguments: JSON.stringify(syntheticToolIntent.parameters),
            },
          }]
          : [];

      if (effectiveToolCalls.length === 0) {
        const text = extractAssistantText(assistantMessage);
        if (!includeDiagnostics) {
          return text;
        }

        return {
          text,
          provider: aiConfig.provider,
          model: aiConfig.model,
          messages,
          tools,
          toolExecutions: executionLog,
          mcpServers: serverBundles.map((bundle) => ({
            name: bundle.server.name,
            url: bundle.server.url,
            transport: bundle.transportType,
            tools: bundle.tools.map((tool) => tool.name),
          })),
        };
      }

      for (const toolCall of effectiveToolCalls) {
        const toolName = toolCall?.function?.name;
        const toolMeta = toolRegistry.get(toolName);

        if (!toolMeta) {
          throw new Error(`The IA requested an unknown tool: ${toolName}.`);
        }

        const toolArguments = normalizeToolArguments(toolCall?.function?.arguments);
        const rawResult = await toolMeta.client.callTool({
          name: toolMeta.toolName,
          arguments: toolArguments,
        });
        const textResult = formatToolResult(rawResult);

        executionLog.push({
          toolAlias: toolMeta.alias,
          toolName: toolMeta.toolName,
          serverName: toolMeta.serverName,
          serverUrl: toolMeta.serverUrl,
          arguments: toolArguments,
          textResult,
          rawResult,
        });

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: textResult || JSON.stringify(rawResult),
        });
      }
    }

    throw new Error(`The IA did not finish after ${roundsLimit} tool rounds.`);
  } finally {
    await closeServerBundles(serverBundles);
  }
};

export default askIAWithMCP;
