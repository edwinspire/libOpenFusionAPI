import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const AI_CONFIG = {
  modelProvider: "ollama",
  model: "llama3.2",
  temperature: 0.1,
  baseUrl: "http://localhost:11434",
  timeout: 1800000,
};

const MCP_SERVER_URL = "https://dmcp-server.deno.dev/sse";

const connectRemoteMCP = async () => {
  const baseUrl = new URL(MCP_SERVER_URL);

  try {
    const client = new Client({ name: "fn-ollama-mcp-roll", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(baseUrl);
    await client.connect(transport);
    return { client, transport, transportType: "streamable-http" };
  } catch (streamError) {
    const client = new Client({ name: "fn-ollama-mcp-roll", version: "1.0.0" });
    const transport = new SSEClientTransport(baseUrl);
    await client.connect(transport);
    return {
      client,
      transport,
      transportType: `sse-fallback (${streamError.message})`,
    };
  }
};

const toPlainText = (content) => {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return JSON.stringify(content);

  return content
    .map((item) => {
      if (typeof item?.text === "string") return item.text;
      return JSON.stringify(item);
    })
    .join("\n");
};

export default async ({ user_data, signal }) => {
  const prompt =
    user_data?.prompt || "Explica de forma breve el resultado de la tirada.";
  const diceRollExpression = user_data?.diceRollExpression || "2d4 + 1";

  let clientBundle;

  try {
    clientBundle = await connectRemoteMCP();
    const toolsResult = await clientBundle.client.listTools();
    const rollResult = await clientBundle.client.callTool({
      name: "roll",
      arguments: { diceRollExpression },
    });

    const rollText = toPlainText(rollResult?.content || []);

    const openai = new OpenAI({
      apiKey: "ollama",
      baseURL: `${AI_CONFIG.baseUrl.replace(/\/$/, "")}/v1`,
      timeout: AI_CONFIG.timeout,
    });

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      temperature: AI_CONFIG.temperature,
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente breve. Debes responder en espanol claro e indicar que el valor numerico vino de una herramienta MCP remota.",
        },
        {
          role: "user",
          content: `Pregunta del usuario: ${prompt}\nHerramienta MCP usada: roll\nExpresion enviada: ${diceRollExpression}\nResultado de la herramienta: ${rollText}`,
        },
      ],
      signal,
    });

    return {
      code: 200,
      data: {
        ok: true,
        provider: AI_CONFIG.modelProvider,
        model: AI_CONFIG.model,
        mcp: {
          server_url: MCP_SERVER_URL,
          transport: clientBundle.transportType,
          tools: toolsResult?.tools || [],
          tool_used: "roll",
          diceRollExpression,
          raw_result: rollResult,
          text_result: rollText,
        },
        ai: {
          text: completion.choices?.[0]?.message?.content || "",
          finish_reason: completion.choices?.[0]?.finish_reason || null,
        },
      },
    };
  } catch (error) {
    return {
      code: error?.statusCode || 500,
      data: {
        error: error?.message || String(error),
      },
    };
  } finally {
    try {
      await clientBundle?.transport?.close();
    } catch (error) {}
  }
};