import { setCacheReply } from "./utils.js";
import {
  LANGCHAIN_AGENT_EXECUTOR_MCP,
  LANGCHAIN_PROMPTS,
  LANGCHAIN_CLEAN_THINK_OUTPUT,
} from "../server/ia.js";

function convertToPrompt(start) {
  let filtered = start.filter((obj) => obj.type && obj.prompt);

  return filtered.map((obj) => {
    //const [key, value] = Object.entries(obj)[0]; // Tomamos la primera clave-valor
    return [obj.type, obj.prompt];
  });
}

export const agentIAFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method
) => {
  try {
    let ChatParameters = JSON.parse(method.code);

    // TODO: Lanzar una excepción si no se proporciona un modelo
    const model = ChatParameters.model;

    if (!model || !model.model || model.model.length == 0) {
      let alt_resp = { error: "Model is required" };
      setCacheReply(reply, alt_resp);
      reply.code(400).send(alt_resp);
    } else {
      const mcpServers = ChatParameters.mcpServers || {};
      /*
    const mcpServers = {
      name_my_server_mcp: {
        transport: "http",
        url: "http://localhost:3000/api/mcp/server/prd",
      },
    };
*/

      let prompts =
        ChatParameters.init_prompts &&
        Array.isArray(ChatParameters.init_prompts)
          ? ChatParameters.init_prompts
          : [];

      const prompt_history =
        $_REQUEST_.body?.prompt?.history &&
        Array.isArray($_REQUEST_.body?.prompt?.history)
          ? $_REQUEST_.body?.prompt?.history
          : [];
      const prompt_user =
        $_REQUEST_.body?.prompt?.user &&
        Array.isArray($_REQUEST_.body?.prompt?.user)
          ? $_REQUEST_.body?.prompt?.user
          : [];

      /*
      if (prompt_history.length > 0) {
        // Ignora el promt inicial y une el promt historico con el actual
        prompts = [...prompt_history, ...prompt_user];
      } else {
        prompts = [...ChatParameters.init_prompts, ...prompt_user];
      }
*/

      prompts = [
        ...ChatParameters.init_prompts,
        ...prompt_history,
        ...prompt_user,
      ];

      const final_prompt = convertToPrompt(prompts);
      const prompt =
        LANGCHAIN_PROMPTS.ChatPromptTemplate.fromMessages(final_prompt);

      /*
    const prompt = LANGCHAIN_PROMPTS.ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant."],
      ["user", "Tell me a joke about {topic}."],
    ]);
    */

      //    const model = "ollama:qwen3:0.6b";

      /*
    const options = {
      temperature: 0.1,
      baseUrl: "http://172.16.243.104:11434",
      timeout: 60000 * 30, // 30 minutos
    };
    */
      const options = ChatParameters.agent_options || {};

      const agent = await LANGCHAIN_AGENT_EXECUTOR_MCP(
        model,
        mcpServers,
        prompt,
        options
      );

      //let result_fn = await agent.invoke({ topic: "cat" });
      let result_fn = await agent.invoke();

      if (
        response.openfusionapi.lastResponse &&
        response.openfusionapi.lastResponse.hash_request
      ) {
        response.openfusionapi.lastResponse.data = result_fn;
      }

      if (options.cleanThinkOutput && result_fn.output) {
        result_fn.output = LANGCHAIN_CLEAN_THINK_OUTPUT(result_fn.output);
      }

      response.code(200).send(result_fn);
    }
  } catch (error) {
    console.trace(error);
    setCacheReply(response, error);

    response
      .code(error.statusCode == null ? 500 : error.statusCode)
      .send(error);
  }
};
