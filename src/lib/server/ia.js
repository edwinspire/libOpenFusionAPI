//import * as LANGCHAIN_CHAT_MODEL_UNIVERSAL from "langchain/chat_models/universal";
import * as LANGCHAIN_TOOLS from "@langchain/core/tools";
import { initChatModel } from "langchain/chat_models/universal";
//import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
//import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import * as LANGCHAIN_PROMPTS from "@langchain/core/prompts";


/*
const config_model = {
  modelProvider: "ollama",
  model: "qwen3:0.6b",
  temperature: 0.1,
  baseUrl: "http://localhost:11434",
  timeout: 60000 * 30, // 30 minutos
}
*/

const chatModel = async (config_model) => {
  /*
    if (model.includes("huggingface")) {
    options = { ...model, ...options };
    return new HuggingFaceInference(options);
  } else {
    return await initChatModel(model, options);
  }

  */
  return await initChatModel(undefined, config_model);
};


const AgentExecutorMCP = async (config_model, mcpServers, prompt, agent_options) => {
  const chat = await chatModel(config_model);
  return AgentExecutorMCPWithoutModel(chat, mcpServers, prompt, agent_options);
};

const AgentExecutorMCPWithoutModel = async (chatModel, mcpServers, prompt, agent_options) => {
  let clientMCP;
  let tools = [];
  try {
    if (Object.keys(mcpServers).length > 0) {
      // Crear cliente MCP
      const client = new MultiServerMCPClient({
        throwOnLoadError: true,
        prefixToolNameWithServerName: false,
        additionalToolNamePrefix: "",
        useStandardContentBlocks: true,
        mcpServers: mcpServers,
      });

      // Cargar herramientas MCP
      tools = await client.getTools();
      /*
      console.log(
        `🔧 Herramientas cargadas: ${tools.map((t) => t.name).join(", ")}`,
        tools
      );
      */
    }

    /*
  const model = await initChatModel("qwen3:0.6b", {
    modelProvider: "ollama",
    temperature: 0.1,
    baseUrl: "http://172.16.243.104:11434",
    timeout: 60000 * 30, // 30 minutos
  });
  */

    /*
  // Configurar modelo Ollama
  const model = new ChatOllama({
    baseUrl: "http://172.16.243.104:11434",
    model: "qwen3:0.6b", // o "mistral-tools" si está disponible
    temperature: 0.1,
    timeout: 60000 * 30, // 30 minutos
  });
  */

    /*
  // Crear prompt con la variable obligatoria `agent_scratchpad`
  const prompt = ChatPromptTemplate.fromTemplate(`
Eres un asistente que usa herramientas MCP que responde en español.
Cada herramienta tiene un esquema estricto de entrada.
Cuando uses una herramienta, asegúrate de enviar un JSON que cumpla exactamente con el esquema.
Si no hay herramienta relevante, responde claramente que no puedes hacerlo.
Pregunta del usuario:
{input}

{agent_scratchpad}
`);
*/

    /*
// Define a chat prompt template with system and user messages
const chatPromptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["user", "Tell me a joke about {topic}."],
]);

// Invoke the template with a value for the placeholder
const formattedChatPrompt = await chatPromptTemplate.invoke({ topic: "dogs" });

*/

    // Crear agente compatible con AgentExecutor
    const agent = await createToolCallingAgent({
      llm: chatModel,
      tools,
      prompt,
    });

    // Crear AgentExecutor
    return new AgentExecutor({
      agent,
      tools,
      verbose: agent_options.verbose || false,
      returnIntermediateSteps: agent_options.returnIntermediateSteps || false,
      maxIterations: 5, // opcional, aumenta si necesitas más pasos
    });
  } catch (error) {
    console.error("Error al cargar herramientas MCP:", error);
    throw error;
  } finally {
    if (clientMCP) {
      clientMCP.close();
    }
  }

  /*
    // Ejecutar consulta
    const result = await agentExecutor.invoke({
      input:
        "Obten la información de oficinas usando la herramienta pertinente y Dame la lista de todos los tecnicos asignados",
    });
    */
};

const cleanThinkOutput = (text) => {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}


export {
  cleanThinkOutput as LANGCHAIN_CLEAN_THINK_OUTPUT,
  chatModel as LANGCHAIN_CHAT_MODEL,
  LANGCHAIN_TOOLS,
  initChatModel as LANGCHAIN_CHAT_MODEL_UNIVERSAL,
  AgentExecutorMCP as LANGCHAIN_AGENT_EXECUTOR_MCP,
  LANGCHAIN_PROMPTS,
};
