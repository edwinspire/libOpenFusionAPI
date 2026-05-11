# JS Handler API Reference

> Auto-generated documentation for the JavaScript Handler environment.

## Table of Contents

- [\$_CUSTOM_HEADERS_](#_custom_headers_)
- [\$_EXCEPTION_](#_exception_)
- [\$_RETURN_DATA_](#_return_data_)
- [OpenAI](#openai)
- [PromiseSequence](#promisesequence)
- [askAIWithTools](#askaiwithtools)
- [askIAWithMCP](#askiawithmcp)
- [askIAWithProviderMCP](#askiawithprovidermcp)
- [createAIProviderMCPClient](#createaiprovidermcpclient)
- [createImageFromHTML](#createimagefromhtml)
- [createPDFFromHTML](#createpdffromhtml)
- [crypto](#crypto)
- [dnsPromises](#dnspromises)
- [forge](#forge)
- [json_to_xlsx_buffer](#json_to_xlsx_buffer)
- [jwt](#jwt)
- [listMcpTools](#listmcptools)
- [luxon](#luxon)
- [mongoose](#mongoose)
- [nodemailer](#nodemailer)
- [ofapi](#ofapi)
- [pdfjs](#pdfjs)
- [reply](#reply)
- [request](#request)
- [request_xlsx_body_to_json](#request_xlsx_body_to_json)
- [sequelize](#sequelize)
- [sequentialPromises](#sequentialpromises)
- [uFetch](#ufetch)
- [uFetchAutoEnv](#ufetchautoenv)
- [uuid](#uuid)
- [xlsx](#xlsx)
- [xlsx_style](#xlsx_style)
- [xml2js](#xml2js)
- [xmlCrypto](#xmlcrypto)
- [xmlFormatter](#xmlformatter)
- [xmldom](#xmldom)
- [z](#z)

---

### `$_CUSTOM_HEADERS_`

[External Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 

Map of custom response headers to send together with $_RETURN_DATA_.

**Notes**

- Useful for downloads, custom content types, caching headers, and content disposition.

**Agent Guidance**

- Set headers here before assigning binary or special response payloads to $_RETURN_DATA_.

*   Returns: Map object with custom headers

#### Example

```javascript

$_CUSTOM_HEADERS_.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.xlsx"',
);
      
```

---

### `$_EXCEPTION_(message, [data], [statusCode])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Interrupts the program flow and throws an exception with a specific message and status code.

*   `message` <string> The error message to display.
*   `data` <any> **Optional**. Additional context data for the error.
*   `statusCode` <integer> **Optional**. Default: `500`. HTTP Status Code for the response.

*   Returns: <void> Throws an exception object that stops execution.

    **Result Structure:**

    *   `message` <string> The error message.
    *   `data` <any> Context data.
    *   `statusCode` <integer> HTTP Status Code.

#### Example

```javascript
// simple usage
$_EXCEPTION_("Invalid input parameter");

// with data and status code
$_EXCEPTION_("User not found", { userId: 123 }, 404);
```

---

### `$_RETURN_DATA_`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Primary output slot for JS handlers. Assign the final payload here instead of using return.

**Notes**

- This is the supported JS handler response contract.

**Agent Guidance**

- Prefer assigning to $_RETURN_DATA_ over calling reply.send() directly unless you need low-level Fastify control.

*   Returns: Any values

#### Example

```javascript

$_RETURN_DATA_ = { name: 'John', age: 30 };
      
```

---

### `OpenAI`

[External Documentation](https://github.com/openai/openai-node) 

Official OpenAI SDK for calling language, reasoning, and multimodal models from JS handlers.

**Notes**

- Requires a valid API key, typically injected through App Vars or environment variables.
- Outbound network access must be available from the server running the JS handler.

**Agent Guidance**

- Use this when the endpoint must call an external OpenAI model directly instead of delegating to another internal endpoint.
- Return only the relevant subset of the SDK response unless the caller explicitly needs raw provider metadata.

*   Returns: OpenAI client instance

#### Example

```javascript

const client = new OpenAI({
  apiKey: endpointEnv.OPENAI_API_KEY,
});

const response = await client.responses.create({
  model: 'gpt-4.1-mini',
  input: 'Summarize in one sentence what OpenFusionAPI does.',
});

$_RETURN_DATA_ = {
  text: response.output_text,
  id: response.id,
};
      
```

---

### `PromiseSequence`

[External Documentation](https://github.com/edwinspire/sequential-promises) 

Utility for processing async tasks sequentially or in controlled batches.

**Notes**

- Useful when you must avoid flooding an external API or database with too many parallel calls.

**Agent Guidance**

- Use this when order matters or when downstream systems require throttled execution.

#### Example

```javascript

function processBlock(block) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: block * 2 });
    }, 250);
  });
}

const data = [1, 2, 3, 4, 5];
const batchSize = 2;

const result = await PromiseSequence.ByItems(processBlock, batchSize, data);
$_RETURN_DATA_ = result;
      
```

---

### `askAIWithTools(options.provider, [options.provider.provider|modelProvider|name|vendor], options.provider.model, [options.provider.baseUrl|baseURL], [options.provider.apiKey|api_key], [options.provider.azureApiKey|azure_api_key], [options.provider.apiVersion|api_version|api-version], [options.provider.clientName], [options.provider.clientVersion], [options.provider.defaultQuery|default_query], [options.provider.headers], [options.provider.temperature], [options.provider.maxTokens|max_tokens], [options.provider.toolChoice|tool_choice], [options.provider.timeout], [options.provider.responseTimeout|responseTimeoutMs|runTimeout], options.prompts, [options.mcpServers], [options.mcpServers[].name], options.mcpServers[].url, [options.mcpServers[].headers], [options.mcpServers[].timeout], [options.mcpServers[].transportPriority], [options.maxToolRounds], [options.includeDiagnostics], [options.signal])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Generic AI helper that accepts a provider configuration, connects to the selected AI service, and optionally enables MCP tools from one or more MCP servers during the conversation.

**Notes**

- This helper is the recommended entry point for new JS endpoints that must be configurable across multiple AI providers.
- `askIAWithProviderMCP` is the equally capable provider-first alias when you want the function name itself to emphasize MCP-enabled provider execution.
- The minimum valid call is `provider.model + prompts`. In practice, most remote providers also need an API key.
- Built-in provider presets currently available in this repo are: `openai`, `openai-compatible`, `azure-openai` (alias `azure`), `ollama`, `anthropic` (alias `claude`), and `google-gemini` (aliases `google` and `gemini`).
- `openai` and `openai-compatible` use the OpenAI Chat Completions shape. Use `openai-compatible` when routing to a custom compatible base URL.
- Azure OpenAI uses the SDK Azure client path internally, including `api-version` handling and deployment-aware routes.
- Local Ollama can be called without a real API key because the helper injects a placeholder key when a base URL is present and no key is provided.
- Native Anthropic support is available through the `anthropic` or `claude` provider preset and requires an Anthropic API key plus a valid Anthropic model name.
- Native Google support is available through the `google`, `gemini`, or `google-gemini` provider preset and requires a Google GenAI API key or Vertex AI settings. If `model` is omitted there, the helper defaults to `gemini-2.5-flash`.
- `timeout` controls the provider client's HTTP timeout. `responseTimeout` or `runTimeout` can also be set when you want a hard deadline for the overall AI response wait.
- If you pass MCP servers, the helper will prepend a system instruction that explains the available tools and their mutating vs read-only intent.
- MCP tools are exposed to the model as OpenAI function tools. The helper connects, lists tools, executes tool calls, and continues the conversation until it reaches a final answer or the round limit.

**Agent Guidance**

- Prefer this helper over askIAWithMCP for new work because it is provider-agnostic and easier to parameterize from request bodies or App Vars.
- Use askIAWithProviderMCP when you want the function name to make it obvious that both the provider and MCP servers are first-class inputs.
- Always provide `provider.model`. Also provide `provider.provider` when you want a known preset to resolve base URL and behavior automatically.
- For plain OpenAI, use `provider: 'openai'` with `apiKey` and optionally override `baseUrl` when you are not using the default OpenAI endpoint.
- For custom OpenAI-compatible gateways or self-hosted providers, use `provider: 'openai-compatible'` and set `baseUrl`.
- For Azure OpenAI, provide `provider: 'azure-openai'`, the deployment name in `model`, the Azure OpenAI base URL, and `apiVersion`.
- For Ollama, provide `provider: 'ollama'`, a local model name, and optionally a custom `baseUrl` if it is not running on the default host.
- For Anthropic, provide `provider: 'anthropic'` or `provider: 'claude'`, plus `apiKey` and a native Anthropic model name such as `claude-3-7-sonnet-latest`.
- For Google Gemini, provide `provider: 'google'`, `provider: 'gemini'`, or `provider: 'google-gemini'`, plus `apiKey` and a Gemini model such as `gemini-2.5-flash`.
- Use the preset aliases intentionally: `azure` resolves to `azure-openai`, `claude` resolves to `anthropic`, and `google` or `gemini` resolve to `google-gemini`.
- If MCP capabilities are unknown, call listMcpTools first and only then call askAIWithTools with the selected servers.
- Store provider defaults and API keys in Application Variables whenever possible instead of hardcoding them into endpoint code.
- When generating endpoint code, prefer one canonical request body shape and document it explicitly in the endpoint JSON schema.
- If the task is informational, provide only read-only MCP servers or read-only tools when possible.

*   `options.provider` <object> Provider configuration. Must include at least `model`. Built-in presets currently available in this repo are `openai`, `openai-compatible`, `azure-openai`, `ollama`, `anthropic`, `claude`, `google`, `gemini`, and `google-gemini`.
*   `options.provider.provider|modelProvider|name|vendor` <string> **Optional**. Provider preset selector. Supported values are `openai`, `openai-compatible`, `azure-openai`, `azure`, `ollama`, `anthropic`, `claude`, `google`, `gemini`, and `google-gemini`. If omitted, the helper assumes `openai-compatible`.
*   `options.provider.model` <string> Exact model or deployment name to invoke. This field is always required. For Azure OpenAI, pass the deployment name here.
*   `options.provider.baseUrl|baseURL` <string> **Optional**. Optional provider base URL override. If omitted, the helper uses the preset default when available. Use this when routing through a gateway or a custom OpenAI-compatible endpoint.
*   `options.provider.apiKey|api_key` <string> **Optional**. Provider API key for OpenAI-compatible providers. Required unless the selected provider is local and works with a placeholder key, such as Ollama.
*   `options.provider.azureApiKey|azure_api_key` <string> **Optional**. Azure OpenAI API key when using the Azure provider preset.
*   `options.provider.apiVersion|api_version|api-version` <string> **Optional**. Azure OpenAI API version. This is recommended when the provider is Azure OpenAI.
*   `options.provider.clientName` <string> **Optional**. Optional MCP client name used while connecting to MCP servers.
*   `options.provider.clientVersion` <string> **Optional**. Optional MCP client version used while connecting to MCP servers.
*   `options.provider.defaultQuery|default_query` <object> **Optional**. Optional default query parameters passed to the AI provider client.
*   `options.provider.headers` <object> **Optional**. Optional extra HTTP headers sent to the AI provider.
*   `options.provider.temperature` <number> **Optional**. Sampling temperature sent to the provider.
*   `options.provider.maxTokens|max_tokens` <integer> **Optional**. Maximum output tokens for the completion.
*   `options.provider.toolChoice|tool_choice` <string|object> **Optional**. Optional tool selection policy passed to the provider when MCP tools are available.
*   `options.provider.timeout` <integer> **Optional**. Default: `60000`. HTTP timeout in milliseconds for provider requests.
*   `options.provider.responseTimeout|responseTimeoutMs|runTimeout` <integer> **Optional**. Optional overall wait timeout in milliseconds for the AI response cycle. Unlike `timeout`, this aborts the helper run even if the provider SDK itself does not stop promptly.
*   `options.prompts` <string|array> Prompt input. Accepts a string, an array of strings, or an array of structured chat messages like `{ role, content }`.
*   `options.mcpServers` <array<object>> **Optional**. Default: ``. Optional MCP server definitions. Each item can include `name`, `url`, `headers`, `timeout`, and `transportPriority`.
*   `options.mcpServers[].name` <string> **Optional**. Friendly MCP server name used in diagnostics and generated tool aliases.
*   `options.mcpServers[].url` <string> HTTP endpoint of the MCP server. Required for each server entry.
*   `options.mcpServers[].headers` <object> **Optional**. Optional headers for authenticating against the MCP server.
*   `options.mcpServers[].timeout` <integer> **Optional**. Optional timeout in milliseconds for fallback RPC requests.
*   `options.mcpServers[].transportPriority` <array<string>> **Optional**. Optional ordered list of transport strategies, typically `['streamable-http', 'legacy-sse-http']`.
*   `options.maxToolRounds` <integer> **Optional**. Default: `6`. Maximum number of tool-execution rounds before forcing a final answer.
*   `options.includeDiagnostics` <boolean> **Optional**. When true, returns execution metadata including tool calls, messages, and resolved MCP server info.
*   `options.signal` <AbortSignal> **Optional**. Optional AbortSignal used to cancel the provider request.

*   Returns: <string|object> Returns the assistant text by default. When `includeDiagnostics` is true, returns an object with `text`, `provider`, `model`, `messages`, `tools`, `toolExecutions`, and `mcpServers`.

#### Example

```javascript

const body = request.body || {};

// Canonical request body shape:
// {
//   provider: {
//     provider: 'openai-compatible',
//     model: 'gpt-4o-mini',
//     apiKey: '...optional if preset is local...',
//     baseUrl: '...optional override...',
//     temperature: 0.1,
//     timeout: 1800000,
//     responseTimeout: 120000
//   },
//   mcpServers: [{ name, url, headers?, timeout?, transportPriority? }],
//   prompts: [{ role, content }],
//   includeDiagnostics: true,
//   maxToolRounds: 6
// }

if (!body.provider?.model) {
  $_EXCEPTION_('The request body must include provider.model.', { body }, 400);
}

if (!(body.prompts ?? body.prompt ?? body.messages)) {
  $_EXCEPTION_('The request body must include prompts, prompt, or messages.', { body }, 400);
}

const result = await askAIWithTools({
  provider: {
    provider: body.provider?.provider ?? 'openai-compatible',
    model: body.provider?.model ?? 'gpt-4o-mini',
    apiKey: body.provider?.apiKey ?? $_APP_VARS_['$_VAR_AI_API_KEY'],
    baseUrl: body.provider?.baseUrl,
    temperature: body.provider?.temperature ?? 0.1,
    timeout: body.provider?.timeout ?? 1800000,
    responseTimeout: body.provider?.responseTimeout ?? body.provider?.responseTimeoutMs ?? body.provider?.runTimeout ?? 120000,
  },
  mcpServers: Array.isArray(body.mcpServers) ? body.mcpServers : [],
  prompts: body.prompts ?? body.prompt ?? body.messages,
  includeDiagnostics: body.includeDiagnostics ?? true,
  maxToolRounds: body.maxToolRounds ?? 6,
});

$_RETURN_DATA_ = result;

// Azure OpenAI example
const azureResult = await askAIWithTools({
  provider: {
    provider: 'azure-openai',
    model: 'gpt-4o-mini',
    baseUrl: 'https://your-resource.cognitiveservices.azure.com/openai',
    apiVersion: '2025-01-01-preview',
    azureApiKey: $_APP_VARS_['$_VAR_AZURE_OPENAI_API_KEY'],
  },
  prompts: [{ role: 'user', content: 'Hola' }],
});

// Native OpenAI example
const openAIResult = await askAIWithTools({
  provider: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: $_APP_VARS_['$_VAR_OPENAI_API_KEY'],
    responseTimeout: 120000,
  },
  prompts: [{ role: 'user', content: 'Hola desde OpenAI' }],
});

// Ollama example
const ollamaResult = await askAIWithTools({
  provider: {
    provider: 'ollama',
    model: 'qwen2.5-coder:1.5b',
    baseUrl: 'http://localhost:11434',
    temperature: 0.1,
    timeout: 1800000,
    responseTimeout: 120000,
  },
  prompts: [{ role: 'user', content: 'Hola desde Ollama' }],
});

// Native Anthropic example
const claudeResult = await askAIWithTools({
  provider: {
    provider: 'claude',
    model: 'claude-3-7-sonnet-latest',
    apiKey: $_APP_VARS_['$_VAR_ANTHROPIC_API_KEY'],
    responseTimeout: 120000,
  },
  prompts: [{ role: 'user', content: 'Hola desde Claude nativo' }],
});

// Google Gemini example
const geminiResult = await askAIWithTools({
  provider: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKey: $_APP_VARS_['$_VAR_GOOGLE_GENAI_API_KEY'],
    responseTimeout: 120000,
  },
  prompts: [{ role: 'user', content: 'Hola desde Gemini' }],
});
      
```

---

### `askIAWithMCP(options.ai, [options.ai.modelProvider], options.ai.model, [options.ai.baseUrl|baseURL], [options.ai.apiKey|api_key], [options.ai.azureApiKey|azure_api_key], [options.ai.apiVersion|api_version|api-version], [options.ai.defaultQuery|default_query], [options.ai.temperature], [options.ai.maxTokens|max_tokens], [options.ai.toolChoice|tool_choice], [options.ai.headers], [options.ai.organization], [options.ai.project], [options.ai.timeout], [options.ai.responseTimeout|responseTimeoutMs|runTimeout], options.prompts, [options.mcpServers], [options.mcpServers[].name], options.mcpServers[].url, [options.mcpServers[].headers], [options.mcpServers[].timeout], [options.mcpServers[].transportPriority], [options.maxToolRounds], [options.includeDiagnostics], [options.signal])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Legacy compatibility wrapper over askAIWithTools. It accepts `options.ai` instead of `options.provider`, then runs a chat completion and can connect the model to MCP servers so it can discover and invoke tools during the conversation.

**Notes**

- This helper is intended to be called from the JS handler. It is no longer tied to a dedicated handler.
- For new work, prefer askAIWithTools. This wrapper exists so older endpoints that already pass `ai` continue working without code changes.
- `askIAWithProviderMCP` is the clearer modern name when you want a provider-first function signature without the legacy `ai` wrapper field.
- The wrapper maps `options.ai` to the new generic `options.provider` contract internally.
- Built-in provider presets currently available in this repo are: `openai`, `openai-compatible`, `azure-openai` (alias `azure`), `ollama`, `anthropic` (alias `claude`), and `google-gemini` (aliases `google` and `gemini`).
- For local Ollama, a common config is `{ modelProvider: 'ollama', model: 'qwen2.5-coder:1.5b', baseUrl: 'http://localhost:11434', temperature: 0.1, timeout: 1800000, responseTimeout: 120000 }`.
- For Azure OpenAI, set `modelProvider: 'azure-openai'`, use the Azure OpenAI base URL, and provide `apiVersion` or `defaultQuery: { 'api-version': '...' }`.
- If `baseUrl` is present and `apiKey` is omitted, the helper injects a placeholder key so local OpenAI-compatible servers can still be called.
- Native Anthropic support is available through the `anthropic` or `claude` provider preset and requires an Anthropic API key plus a valid Anthropic model name.
- Native Google support is available through the `google`, `gemini`, or `google-gemini` provider preset and requires a Google GenAI API key or Vertex AI settings. If `model` is omitted there, the helper defaults to `gemini-2.5-flash`.
- `timeout` controls the provider client's HTTP timeout. `responseTimeout` or `runTimeout` can also be set when you want a hard deadline for the overall AI response wait.
- MCP tools are exposed to the model as OpenAI function tools. The helper will connect, list tools, execute tool calls, and continue the conversation until it reaches a final answer or the round limit.
- Prompt roles should normally be `system`, `user`, `assistant`, and the helper itself manages `tool` messages internally during tool rounds.
- For GET endpoints, prompt arrays usually arrive as a JSON string in `request.query.prompts`, so parse them before calling this helper.
- When the output looks inconsistent, enable `includeDiagnostics` and inspect `messages`, `tools`, and `toolExecutions` before assuming hidden state.

**Agent Guidance**

- Use this only when you must preserve the old `ai` field shape. Otherwise use askAIWithTools.
- If you are generating new handler code from scratch, prefer askIAWithProviderMCP or askAIWithTools instead of this legacy wrapper.
- Use this helper when the endpoint needs an AI response and may need tool access through one or more MCP servers.
- For plain OpenAI, use `modelProvider: 'openai'` with `apiKey` and an OpenAI model such as `gpt-4o-mini`.
- For custom OpenAI-compatible gateways, use `modelProvider: 'openai-compatible'` and set `baseUrl` explicitly.
- For Azure OpenAI, use `modelProvider: 'azure-openai'` or `azure`, set the deployment name in `model`, and provide `baseUrl` plus `apiVersion`.
- For Ollama, use `modelProvider: 'ollama'`, a local model name, and optionally a custom `baseUrl` if it is not running on the default host.
- For Anthropic, use `modelProvider: 'anthropic'` or `claude`, plus `apiKey` and a native Anthropic model name such as `claude-3-7-sonnet-latest`.
- For Google Gemini, use `modelProvider: 'google'`, `gemini`, or `google-gemini`, plus `apiKey` and a Gemini model such as `gemini-2.5-flash`.
- Use aliases intentionally: `azure` resolves to `azure-openai`, `claude` resolves to `anthropic`, and `google` or `gemini` resolve to `google-gemini`.
- Prefer passing prompts as structured messages when system or multi-turn context matters.
- If MCP capabilities are unknown, call `listMcpTools` first and only then call `askIAWithMCP` with the chosen servers.
- For JS endpoints that rely on Application Variables, prefer `$_APP_VARS_['$_VAR_NAME']` in generated code because it is explicit and avoids scope-name ambiguity.
- If the task is informational, provide only read-only MCP servers or read-only tools when possible.

*   `options.ai` <object> AI provider configuration. Must include at least `model`. Built-in presets currently available in this repo are `openai`, `openai-compatible`, `azure-openai`, `ollama`, `anthropic`, `claude`, `google`, `gemini`, and `google-gemini`.
*   `options.ai.modelProvider` <string> **Optional**. Provider preset selector. Supported values are `openai`, `openai-compatible`, `azure-openai`, `azure`, `ollama`, `anthropic`, `claude`, `google`, `gemini`, and `google-gemini`.
*   `options.ai.model` <string> Exact model name to invoke. This field is required.
*   `options.ai.baseUrl|baseURL` <string> **Optional**. Optional OpenAI-compatible base URL. Example: `http://localhost:11434` for Ollama. For Azure OpenAI, use the Azure resource OpenAI path such as `https://your-resource.openai.azure.com/openai` or the matching `cognitiveservices.azure.com/openai` endpoint.
*   `options.ai.apiKey|api_key` <string> **Optional**. Provider API key when required. If omitted and `baseUrl` is present, the helper uses a placeholder key for local OpenAI-compatible servers.
*   `options.ai.azureApiKey|azure_api_key` <string> **Optional**. Optional Azure OpenAI API key. When present, the helper also injects it into the `api-key` header expected by Azure OpenAI.
*   `options.ai.apiVersion|api_version|api-version` <string> **Optional**. Optional Azure OpenAI API version. When provided, the helper sends it as `defaultQuery['api-version']`.
*   `options.ai.defaultQuery|default_query` <object> **Optional**. Optional default query parameters passed to the AI provider HTTP client. This is especially useful for Azure OpenAI preview versions.
*   `options.ai.temperature` <number> **Optional**. Sampling temperature sent to the provider.
*   `options.ai.maxTokens|max_tokens` <integer> **Optional**. Maximum output tokens for the completion.
*   `options.ai.toolChoice|tool_choice` <string|object> **Optional**. Optional tool selection policy passed to the provider when MCP tools are available.
*   `options.ai.headers` <object> **Optional**. Optional extra HTTP headers sent to the AI provider.
*   `options.ai.organization` <string> **Optional**. Optional provider organization identifier.
*   `options.ai.project` <string> **Optional**. Optional provider project identifier.
*   `options.ai.timeout` <integer> **Optional**. Default: `60000`. HTTP timeout in milliseconds for provider requests.
*   `options.ai.responseTimeout|responseTimeoutMs|runTimeout` <integer> **Optional**. Optional overall wait timeout in milliseconds for the AI response cycle. Unlike `timeout`, this aborts the helper run even if the provider SDK itself does not stop promptly.
*   `options.prompts` <string|array> Prompt input. Accepts a string, an array of strings, or an array of chat messages like `{ role, content }`. Structured messages are preferred when system instructions or multi-turn context matter.
*   `options.mcpServers` <array<object>> **Optional**. Default: ``. Optional MCP server definitions. Each item can include `name`, `url`, `headers`, `timeout`, and `transportPriority`.
*   `options.mcpServers[].name` <string> **Optional**. Friendly MCP server name used in diagnostics and tool aliases.
*   `options.mcpServers[].url` <string> HTTP endpoint of the MCP server. Required for each server entry.
*   `options.mcpServers[].headers` <object> **Optional**. Optional headers for authenticating against the MCP server.
*   `options.mcpServers[].timeout` <integer> **Optional**. Optional timeout in milliseconds for fallback RPC requests.
*   `options.mcpServers[].transportPriority` <array<string>> **Optional**. Optional ordered list of transport strategies, typically `['streamable-http', 'legacy-sse-http']`.
*   `options.maxToolRounds` <integer> **Optional**. Default: `6`. Maximum number of tool-execution rounds before forcing a final answer.
*   `options.includeDiagnostics` <boolean> **Optional**. When true, returns execution metadata including tool calls, messages, and resolved MCP server info.
*   `options.signal` <AbortSignal> **Optional**. Optional AbortSignal used to cancel the provider request.

*   Returns: <string|object> Returns the assistant text by default. When `includeDiagnostics` is true, returns an object with `text`, `provider`, `model`, `messages`, `tools`, `toolExecutions`, and `mcpServers`.

#### Example

```javascript

const result = await askIAWithMCP({
  ai: {
    modelProvider: 'ollama',
    model: 'qwen2.5-coder:1.5b',
    baseUrl: 'http://localhost:11434',
    temperature: 0.1,
    timeout: 1800000,
    responseTimeout: 120000,
  },
  mcpServers: [
    {
      name: 'openfusion_system_remote_prd',
      url: 'https://example.com/api/system/mcp/server/prd',
    },
  ],
  prompts: [
    {
      role: 'user',
      content: 'List the available applications using MCP tools if needed.',
    },
  ],
  includeDiagnostics: true,
});

$_RETURN_DATA_ = result;
// Azure OpenAI example
const result = await askIAWithMCP({
  ai: {
    modelProvider: 'azure-openai',
    model: 'gpt-4o-mini',
    baseUrl: 'https://diegomperezcentralus-resource.cognitiveservices.azure.com/openai',
    apiVersion: '2025-01-01-preview',
    azureApiKey: $_APP_VARS_['$_VAR_AZURE_OPENAI_API_KEY'],
    timeout: 1800000,
    responseTimeout: 120000,
  },
  prompts: [
    {
      role: 'user',
      content: 'Hola',
    },
  ],
});

$_RETURN_DATA_ = result;

// Native Anthropic example
const anthropicResult = await askIAWithMCP({
  ai: {
    modelProvider: 'anthropic',
    model: 'claude-3-7-sonnet-latest',
    apiKey: $_APP_VARS_['$_VAR_ANTHROPIC_API_KEY'],
    responseTimeout: 120000,
  },
  prompts: [{ role: 'user', content: 'Hola desde Anthropic' }],
});

$_RETURN_DATA_ = anthropicResult;

// Google Gemini example
const geminiResult = await askIAWithMCP({
  ai: {
    modelProvider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKey: $_APP_VARS_['$_VAR_GOOGLE_GENAI_API_KEY'],
    responseTimeout: 120000,
  },
  prompts: [{ role: 'user', content: 'Hola desde Gemini' }],
});

$_RETURN_DATA_ = geminiResult;
      
```

---

### `askIAWithProviderMCP(options.provider, [options.provider.provider|modelProvider|name|vendor], options.provider.model, [options.provider.baseUrl|baseURL], [options.provider.apiKey|api_key], [options.provider.azureApiKey|azure_api_key], [options.provider.apiVersion|api_version|api-version], [options.provider.temperature], [options.provider.maxTokens|max_tokens], [options.provider.toolChoice|tool_choice], [options.provider.timeout], [options.provider.responseTimeout|responseTimeoutMs|runTimeout], options.prompts, [options.mcpServers], [options.maxToolRounds], [options.includeDiagnostics], [options.signal])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Primary provider-first AI helper for JS handlers. It accepts `options.provider`, can connect to one or more MCP servers, exposes those tools to the model, executes tool calls, and returns either the final text or rich diagnostics.

**Notes**

- This is the canonical provider-first helper in `ia.js`. Use it when you want the function name itself to make the provider+MCP contract explicit.
- It shares the same runtime behavior as `askAIWithTools`; the difference is naming and intent clarity, not capability.
- If you do not need MCP, you can still call this helper with only `provider + prompts`.
- If you do need MCP, pass `mcpServers` and the helper will discover tools, expose them to the model, execute them, and continue until the model returns a final answer or the round limit is reached.
- Use `includeDiagnostics` when you need to inspect `toolExecutions` or message flow before changing prompts or provider settings.
- Use `responseTimeout` or `runTimeout` when you need a hard deadline for the overall AI wait, especially with slower local or remote providers.

**Agent Guidance**

- Prefer this helper when you are writing new JS handler code and want the name to communicate clearly that both the provider and MCP servers are configurable inputs.
- Use `askAIWithTools` interchangeably only when brevity matters. Treat both functions as the same runtime capability.
- Use `askIAWithMCP` only when you must preserve legacy payloads that already send `ai` instead of `provider`.
- If the provider is unknown or controlled by request/App Vars, this helper is usually the clearest option for generated endpoint code.
- If MCP capabilities are unknown, call `listMcpTools` first and then call this helper with the selected MCP servers.
- If the task is informational, prefer read-only MCP servers or read-only tools and keep `maxToolRounds` low unless the workflow genuinely needs multiple tool steps.

*   `options.provider` <object> Provider configuration. Must include at least `model`. Built-in presets currently available in this repo are `openai`, `openai-compatible`, `azure-openai`, `ollama`, `anthropic`, `claude`, `google`, `gemini`, and `google-gemini`.
*   `options.provider.provider|modelProvider|name|vendor` <string> **Optional**. Provider preset selector. Supported values are `openai`, `openai-compatible`, `azure-openai`, `azure`, `ollama`, `anthropic`, `claude`, `google`, `gemini`, and `google-gemini`. If omitted, the helper assumes `openai-compatible`.
*   `options.provider.model` <string> Exact model or deployment name to invoke. This field is always required. For Azure OpenAI, pass the deployment name here.
*   `options.provider.baseUrl|baseURL` <string> **Optional**. Optional provider base URL override. Use this for custom OpenAI-compatible hosts, Ollama, or Azure OpenAI resource paths.
*   `options.provider.apiKey|api_key` <string> **Optional**. Provider API key for OpenAI-compatible or native providers when required. Local Ollama can work without a real key when `baseUrl` is set.
*   `options.provider.azureApiKey|azure_api_key` <string> **Optional**. Azure OpenAI API key when using the Azure provider preset.
*   `options.provider.apiVersion|api_version|api-version` <string> **Optional**. Azure OpenAI API version. Recommended whenever the provider is Azure OpenAI.
*   `options.provider.temperature` <number> **Optional**. Sampling temperature sent to the provider.
*   `options.provider.maxTokens|max_tokens` <integer> **Optional**. Maximum output tokens for the completion.
*   `options.provider.toolChoice|tool_choice` <string|object> **Optional**. Optional tool selection policy passed to the provider when MCP tools are available.
*   `options.provider.timeout` <integer> **Optional**. Default: `60000`. HTTP timeout in milliseconds for provider requests.
*   `options.provider.responseTimeout|responseTimeoutMs|runTimeout` <integer> **Optional**. Optional overall wait timeout in milliseconds for the AI response cycle. Unlike `timeout`, this aborts the helper run even if the provider SDK itself does not stop promptly.
*   `options.prompts` <string|array> Prompt input. Accepts a string, an array of strings, or an array of structured chat messages like `{ role, content }`.
*   `options.mcpServers` <array<object>> **Optional**. Default: ``. Optional MCP server definitions. Each item can include `name`, `url`, `headers`, `timeout`, and `transportPriority`.
*   `options.maxToolRounds` <integer> **Optional**. Default: `6`. Maximum number of tool-execution rounds before forcing a final answer.
*   `options.includeDiagnostics` <boolean> **Optional**. When true, returns execution metadata including tool calls, messages, and resolved MCP server info.
*   `options.signal` <AbortSignal> **Optional**. Optional AbortSignal used to cancel the provider request.

*   Returns: <string|object> Returns the assistant text by default. When `includeDiagnostics` is true, returns an object with `text`, `provider`, `model`, `messages`, `toolExecutions`, and `mcpServers`.

#### Example

```javascript

const result = await askIAWithProviderMCP({
  provider: {
    provider: 'azure-openai',
    model: 'gpt-4o-mini',
    baseUrl: 'https://your-resource.cognitiveservices.azure.com/openai',
    apiVersion: '2025-01-01-preview',
    azureApiKey: $_APP_VARS_['$_VAR_AZURE_OPENAI_API_KEY'],
    responseTimeout: 120000,
  },
  mcpServers: [
    {
      name: 'exa',
      url: 'https://mcp.exa.ai/mcp',
    },
  ],
  prompts: [
    {
      role: 'user',
      content: 'Use MCP if needed and answer with the official Exa MCP page title only.',
    },
  ],
  includeDiagnostics: true,
  maxToolRounds: 4,
});

$_RETURN_DATA_ = result;
      
```

---

### `createAIProviderMCPClient(options.provider, [options.mcpServers])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Low-level MCP-aware AI client factory. Use this when you need explicit connect/list/run/close control instead of a single helper call.

**Notes**

- This is for advanced handler logic such as custom retries, preflight tool inspection, or manual MCP fallback execution.
- Always close the client in a finally block to release MCP transports cleanly.

**Agent Guidance**

- Prefer askIAWithProviderMCP for normal one-shot AI+MCP calls.
- Use this client only when the handler must inspect tool catalogs, retry with custom logic, or execute a fallback flow after a model fails to use tools correctly.

*   `options.provider` <object> Provider configuration with the same shape accepted by askIAWithProviderMCP.
*   `options.mcpServers` <array<object>> **Optional**. Default: ``. MCP server list to connect before running or listing tools.

*   Returns: <AIProviderMCPClient> Client instance with connect(), listTools(), run(), close(), and runtime access for advanced flows.

#### Example

```javascript

const client = createAIProviderMCPClient({
  provider: {
    provider: 'ollama',
    model: 'qwen2.5-coder:1.5b',
    baseUrl: 'http://localhost:11434',
  },
  mcpServers: [{ name: 'exa', url: 'https://mcp.exa.ai/mcp' }],
});

try {
  await client.connect();
  const tools = await client.listTools();
  const result = await client.run({
    prompts: [{ role: 'user', content: 'Usa MCP si hace falta.' }],
    includeDiagnostics: true,
  });

  $_RETURN_DATA_ = { tools, result };
} finally {
  await client.close();
}
      
```

---

### `createImageFromHTML([html], [url], [type], [quality], [fullPage])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Renders HTML content or a URL into an image buffer.

**Notes**

- Pass either html or url. If both are provided, your wrapper implementation defines precedence.

**Agent Guidance**

- Use this when the endpoint must return a screenshot-like image artifact generated on demand.

*   `html` <string> **Optional**. String HTML
*   `url` <string> **Optional**. URL resource
*   `type` <string> **Optional**. Default: `png`. Output type
*   `quality` <integer> **Optional**. Default: `90`. quality
*   `fullPage` <boolean> **Optional**. Default: `true`. fullPage

*   Returns: NodeJS.ArrayBufferView

#### Example

```javascript

const image = await createImageFromHTML('<html><body><h1>Hello</h1></body></html>', '', 'png');

$_CUSTOM_HEADERS_.set("Content-Type", "image/png");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.png"',
);

$_RETURN_DATA_ = image;
      
```

---

### `createPDFFromHTML([html], [url], [format], [landscape], [margin], [printBackground])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Generates a PDF document from an HTML string or a URL.

**Notes**

- Pass either html or url depending on whether the content is already available in memory.

**Agent Guidance**

- Use this for report exports, tickets, or printable documents assembled inside the handler.

*   `html` <string> **Optional**. Raw HTML content to render.
*   `url` <string> **Optional**. URL of the page to convert to PDF.
*   `format` <string> **Optional**. Default: `A4`. Paper format (e.g., 'A4', 'Letter').
*   `landscape` <boolean> **Optional**. Whether to print in landscape mode.
*   `margin` <string> **Optional**. Default: `10mm`. Page margins (e.g., '10mm').
*   `printBackground` <boolean> **Optional**. Default: `true`. Whether to print background graphics.

*   Returns: NodeJS.ArrayBufferView

#### Example

```javascript

const pdf = await createPDFFromHTML('<html><body><h1>Monthly Report</h1></body></html>');

$_CUSTOM_HEADERS_.set("Content-Type", "application/pdf");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.pdf"',
);

$_RETURN_DATA_ = pdf;
      
```

---

### `crypto`

[External Documentation](https://nodejs.org/api/crypto.html) 

Node.js crypto module

*   Returns: Read documentation

#### Example

```javascript

const hash = crypto.createHash('sha256');
hash.update('hello world');
const hex = hash.digest('hex');
$_RETURN_DATA_ = hex;
      
```

---

### `dnsPromises`

[External Documentation](https://nodejs.org/api/dns.html) 

The DNS module enables name resolution functions. It contains methods for performing DNS queries of various types, as well as utility functions for converting between IP addresses in text and binary forms.

*   Returns: Read documentation

#### Example

```javascript

const addresses = await dnsPromises.resolve4('example.com');
$_RETURN_DATA_ = addresses;
      
```

---

### `forge`

[External Documentation](https://github.com/digitalbazaar/forge) 

A native implementation of TLS (and various other cryptographic tools) in JavaScript.

*   Returns: Read documentation

#### Example

```javascript

const pki = forge.pki;
const keys = pki.rsa.generateKeyPair(2048);
const pem = pki.encryptRsaPrivateKey(keys.privateKey, 'password');
$_RETURN_DATA_ = pem;
      
```

---

### `json_to_xlsx_buffer([data])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Builds an XLSX workbook in memory and returns the binary buffer plus download metadata.

**Notes**

- This helper does not send the file by itself; you still need to assign headers and return the buffer.

**Agent Guidance**

- If the endpoint should download a file, set $_CUSTOM_HEADERS_ from the returned metadata and assign only result.buffer to $_RETURN_DATA_.

*   `data` <object> **Optional**. Workbook definition. Example: { filename: 'report.xlsx', sheets: [{ sheet: 'Sheet1', data: [{ id: 1 }] }] }

*   Returns: <object> Workbook binary and download metadata.

    **Result Structure:**

    *   `buffer` <Buffer> XLSX binary content.
    *   `filename` <string> Suggested filename.
    *   `contentDisposition` <string> Download header value.
    *   `ContentType` <string> MIME type for XLSX.

#### Example

```javascript

const data = {
  filename: 'users.xlsx',
  sheets: [
    {
      sheet: 'Users',
      data: [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ],
    },
  ],
};

const result = json_to_xlsx_buffer(data);

$_CUSTOM_HEADERS_.set('Content-Type', result.ContentType);
$_CUSTOM_HEADERS_.set('Content-Disposition', result.contentDisposition);

$_RETURN_DATA_ = result.buffer;
      
```

---

### `jwt`

[External Documentation](https://github.com/auth0/node-jsonwebtoken) 

An implementation of JSON Web Tokens.

#### Example

```javascript

      const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
      $_RETURN_DATA_ = token;
      
```

---

### `listMcpTools(options.mcpServers, [options.clientName], [options.clientVersion])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Connects to one or more MCP servers and returns the discovered tools without running an AI conversation.

**Notes**

- Use this for diagnostics, capability discovery, or to verify that a remote MCP server exposes the expected tools before calling askIAWithMCP.

*   `options.mcpServers` <array<object>> List of MCP server definitions to inspect.
*   `options.clientName` <string> **Optional**. Optional MCP client name used during connection.
*   `options.clientVersion` <string> **Optional**. Optional MCP client version used during connection.

*   Returns: Array of MCP server descriptors with their resolved tool list.

#### Example

```javascript

const tools = await listMcpTools({
  mcpServers: [
    {
      name: 'openfusion_system_remote_prd',
      url: 'https://example.com/api/system/mcp/server/prd',
    },
  ],
});

$_RETURN_DATA_ = tools;
      
```

---

### `luxon`

[External Documentation](https://moment.github.io/luxon) 

Friendly wrapper for JavaScript dates and times

#### Example

```javascript

      const dt = luxon.DateTime.now();
      $_RETURN_DATA_ = dt;
      
```

---

### `mongoose`

[External Documentation](https://mongoosejs.com) 

MongoDB ODM for defining schemas, models, and queries with validation support.

**Notes**

- Long-lived connections should be reused carefully; close temporary connections when the job is done.

**Agent Guidance**

- Prefer MONGODB handlers for direct data access endpoints; use mongoose in JS handlers when you need schema logic, orchestration, or mixed business rules.

#### Example

```javascript

await mongoose.connect('mongodb://127.0.0.1:27017/test');

const Cat = mongoose.model('Cat', { name: String });
await Cat.create({ name: 'Zildjian' });

const cats = await Cat.find().lean();
await mongoose.disconnect();

$_RETURN_DATA_ = cats;
      
```

---

### `nodemailer`

[External Documentation](https://nodemailer.com/) 

Nodemailer makes sending email from a Node.js application straightforward and secure, without pulling in a single runtime dependency.

**Notes**

- The runtime wrapper strips mailOptions.envelope.size before sendMail() so untrusted request bodies cannot inject that SMTP parameter.

#### Example

```javascript

      const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'username',
          pass: 'password'
        }
      });
      const mailOptions = {
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'This is a test email sent using Nodemailer.'
      };
      const info = await transporter.sendMail(mailOptions);
      $_RETURN_DATA_ = info;
      
```

---

### `ofapi`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

OpenFusionAPI runtime helpers exposed to JS handlers.

**Notes**

- Use ofapi.throw when you need a structured HTTP error from JS handler code.

*   Returns: <object> Utility object with server context and helper methods.

    **Result Structure:**

    *   `server` <object> Runtime server information when available.
    *   `genToken` <function> Signs a JWT token for OpenFusionAPI usage.
    *   `throw` <function> Throws a controlled HTTP exception.

---

### `pdfjs`

[External Documentation](https://mozilla.github.io/pdf.js/) 

PDF parsing library for reading text, metadata, and page structure from PDF documents.

**Notes**

- This is useful for extraction and inspection, not for generating PDFs.

**Agent Guidance**

- Use this when the endpoint must inspect uploaded or downloaded PDFs; do not use it for PDF generation workflows.

#### Example

```javascript

const fileResponse = await fetch('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

const doc = await pdfjs.getDocument({ data: fileBuffer }).promise;
const page = await doc.getPage(1);
const content = await page.getTextContent();

$_RETURN_DATA_ = {
  pages: doc.numPages,
  firstPageTextItems: content.items.length,
};
      
```

---

### `reply`

[External Documentation](https://fastify.dev/docs/latest/Reference/Reply/#introduction) 

Fastify Reply object for low-level response control.

**Notes**

- Once you send a response manually with reply.send(), avoid also assigning a different value to $_RETURN_DATA_.

**Agent Guidance**

- Use reply directly only when $_RETURN_DATA_ and $_CUSTOM_HEADERS_ are not enough for the desired response behavior.

*   Returns: Fastify Reply object

#### Example

```javascript

reply.code(200).send({ name: 'John', age: 30 });
      
```

---

### `request`

[External Documentation](https://fastify.dev/docs/latest/Reference/Request/) 

Fastify Request object with body, query, headers, params, and request metadata.

**Notes**

- For GET endpoints, use request.query. For JSON POST endpoints, use request.body.

*   Returns: Fastify Request object

#### Example

```javascript

$_RETURN_DATA_ = {
  query: request.query,
  body: request.body,
  headers: request.headers,
};
      
```

---

### `request_xlsx_body_to_json(request)`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Reads uploaded XLSX files from a multipart/form-data request and converts their sheets into JSON rows.

**Notes**

- Only multipart file fields are processed; regular text fields remain available on request.body.

**Agent Guidance**

- Use this helper only when the endpoint receives an uploaded spreadsheet; do not use it for plain JSON requests.

*   `request` <object> Fastify request object containing multipart form-data files.

*   Returns: Array of objects with the data of each sheet of each Excel file.

#### Example

```javascript

const files = await request_xlsx_body_to_json(request);
const firstWorkbook = files[0];

$_RETURN_DATA_ = {
  filename: firstWorkbook?.filename,
  sheets: firstWorkbook?.sheets,
};
      
```

---

### `sequelize`

[External Documentation](https://sequelize.org/) 

Sequelize is a modern TypeScript and Node.js ORM for Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more.

**Notes**

- Useful for ad hoc relational DB operations inside JS handlers, but prefer the SQL handler when the endpoint is mostly a database proxy.

**Agent Guidance**

- Choose sequelize here only when you need transactions, model logic, or multi-step orchestration in JS instead of a single SQL statement.

#### Example

```javascript

const seq = new sequelize.Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

try {
  await seq.authenticate();
  await seq.query("CREATE TABLE users (iduser INTEGER PRIMARY KEY, name TEXT, email TEXT);");
  await seq.query("INSERT INTO users (iduser, name, email) VALUES (1, 'Juan', 'juan@mail.com'), (2, 'Ana', 'ana@mail.com');");

  const result = await seq.query(
    "SELECT * FROM users WHERE iduser = $iduser",
    {
      bind: { iduser: 1 },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  $_RETURN_DATA_ = result;
} finally {
  await seq.close();
}

      
```

---

### `sequentialPromises`

[External Documentation](https://github.com/edwinspire/sequential-promises) 

Legacy alias of PromiseSequence kept for backward compatibility.

**Notes**

- Deprecated alias. Prefer PromiseSequence in new endpoint code.

#### Example

```javascript

const result = await sequentialPromises.ByBlocks(async (item) => item, 2, [1, 2, 3, 4]);
$_RETURN_DATA_ = result;
      
```

---

### `uFetch([constructor(url?, redirect_in_unauthorized?)], [request(url, method, data, headers, options)], [get|post|put|patch|delete({ url, data, headers, options })], [batch(items, config)])`

[External Documentation](https://github.com/edwinspire/universal-fetch) 

Universal HTTP client for Node.js and browsers. Primary use is standard fetch-style requests (get/post/put/patch/delete); batch adds controlled parallel processing for large input sets.

**Notes**

- Use uFetch when the target URL is absolute or belongs to another system.
- Primary workflow: use get/post/put/patch/delete for single requests or simple request chains.
- Quick decision: one request => get/post/put/patch/delete.
- Quick decision: list/lote of requests with controlled parallel workers => batch(items, { concurrency, ... }).
- For GET or HEAD, data is serialized as query string. For non-GET methods, object data is serialized as JSON automatically.
- Use batch() when you must process many calls from a list and split the workload into concurrent workers/blocks.
- batch() returns per-item result objects and is designed to continue even if some items fail; always inspect isError per item.
- batch() signature: batch(items, { concurrency, method, buildRequest, onProgress }).
- Each batch result item has shape: { isError, httpCode, response?, error? }.
- Authorization helpers persist at instance level. Create a fresh instance when different credentials must be isolated.

**Agent Guidance**

- For internal OpenFusionAPI endpoints in the same instance, prefer uFetchAutoEnv instead of hardcoding dev/qa/prd URLs.
- Start with get/post/put/patch/delete and switch to batch only when you have a collection of inputs to process concurrently.
- If you need per-item fault tolerance and progress in a large workload, prefer batch over Promise.all.
- Prefer method wrappers with opts object for readability: get/post/put/patch/delete({ url, data, headers, options }).
- Use request(url, method, data, headers, options) only when method must be computed dynamically.
- For bulk operations, prefer batch() over Promise.all to avoid failing the full operation due to a single request error.

*   `constructor(url?, redirect_in_unauthorized?)` <function> **Optional**. Creates an instance with optional base URL for relative paths. In browser mode, redirect_in_unauthorized can redirect on 401.
*   `request(url, method, data, headers, options)` <function> **Optional**. Low-level request method used by all wrappers.
*   `get|post|put|patch|delete({ url, data, headers, options })` <function> **Optional**. Convenience wrappers for common HTTP methods.
*   `batch(items, config)` <function> **Optional**. Parallel fail-safe processor. Uses config.buildRequest(item) to create each request and returns one result per item without failing the whole batch.

*   Returns: <object> uFetch instance with request wrappers and auth helpers.

    **Result Structure:**

    *   `request` <function> Core request primitive.
    *   `get|post|put|patch|delete` <function> HTTP method wrappers using opts object.
    *   `batch` <function> Fail-safe batch execution with configurable concurrency.
    *   `setBasicAuthorization` <function> Sets persistent Basic auth header for the instance.
    *   `setBearerAuthorization` <function> Sets persistent Bearer auth header for the instance.
    *   `abort` <function> Aborts active in-flight requests for this instance.

#### Example

```javascript

const api = new uFetch('https://api.example.com');

api.setBearerAuthorization(endpointEnv.API_TOKEN);

const usersRes = await api.get({
  url: '/users',
  data: { role: 'admin', page: 1 },
});

const createRes = await api.post({
  url: '/users',
  data: { username: 'johndoe' },
});

const batchResults = await api.batch([
  { username: 'a' },
  { username: 'b' },
  { username: 'c' },
], {
  concurrency: 5,
  method: 'POST',
  buildRequest: (item) => ({
    url: '/users',
    data: item,
  }),
});

$_RETURN_DATA_ = {
  users: await usersRes.json(),
  created: await createRes.json(),
  batch: batchResults.map((r) => ({
    isError: r.isError,
    httpCode: r.httpCode,
    hasResponse: !!r.response,
  })),
};
      
```

---

### `uFetchAutoEnv([create(url, shouldApplyAuto = true)], [auto(url)])`

[External Documentation](https://github.com/edwinspire/universal-fetch) 

OpenFusionAPI helper that wraps uFetch for same-instance calls. Use it mainly with get/post/put/patch/delete and optionally with batch for parallelized internal fan-out. It resolves /auto or /env suffixes to the current runtime environment.

**Notes**

- For relative paths, this helper builds a full URL using current base URL and server port.
- If the path contains /auto or /env suffix before query/hash, it is replaced by the current environment (dev, qa, prd).
- Absolute URLs bypass environment replacement and are sent as-is.
- Most endpoints should start with get/post/put/patch/delete; batch is for list-driven parallel calls with controlled concurrency.
- Quick decision: if you need N calls to the same internal endpoint with a lote, use create('/api/.../auto') + batch(items, { concurrency, buildRequest }).
- create()/auto() return a uFetch instance, so batch(items, config) is also available for internal fan-out calls.
- Request trace header ofapi-trace-id is propagated automatically when available.

**Agent Guidance**

- Prefer relative internal URLs such as /api/myapp/resource/auto instead of hardcoded localhost URLs.
- Use auto() for environment-agnostic internal calls and keep endpoint code portable across dev/qa/prd.
- Use create(path, false) when you must preserve a literal path and avoid automatic /auto or /env replacement.
- After obtaining the uFetch instance, use standard uFetch methods like get/post/put/patch/delete with opts object.

*   `create(url, shouldApplyAuto = true)` <function> **Optional**. Creates a uFetch instance for the given URL/path. Relative paths are resolved against current server base URL and port.
*   `auto(url)` <function> **Optional**. Shortcut for create(url, true).

*   Returns: <object> URLAutoEnvironment instance exposing create() and auto() that return uFetch instances.

    **Result Structure:**

    *   `create` <function> Builds uFetch instance from relative/absolute URL with optional environment replacement.
    *   `auto` <function> Always applies environment suffix replacement for /auto and /env.

#### Example

```javascript

const sumFetch = uFetchAutoEnv.auto('/api/datetime_app/sum-array/auto');
const sumResponse = await sumFetch.post({
  data: { numbers: [4, 12, 9] },
});

const usersFetch = uFetchAutoEnv.create('/api/myapp/users/env?active=true#view');
const usersResponse = await usersFetch.get();

const soapFetch = uFetchAutoEnv.create('/api/demo/ofapi/soap/example01/auto');
const items = Array.from({ length: 40 }, (_, i) => ({ dNum: i + 1 }));
const batch = await soapFetch.batch(items, {
  concurrency: 5,
  method: 'GET',
  buildRequest: (item) => ({
    data: { dNum: item.dNum },
  }),
});

$_RETURN_DATA_ = {
  sum: await sumResponse.json(),
  users: await usersResponse.json(),
  batchSummary: batch.map((r) => ({ isError: r.isError, httpCode: r.httpCode })),
};
      
```

---

### `uuid`

[External Documentation](https://www.npmjs.com/package/uuid) 

UUID package to generate RFC4122 UUIDs.

#### Example

```javascript

const result_uuid = uuid.v4();
$_RETURN_DATA_ = result_uuid;
      
```

---

### `xlsx`

[External Documentation](https://docs.sheetjs.com/docs/) 

SheetJS Community Edition offers battle-tested open-source solutions for extracting useful data from almost any complex spreadsheet and generating new spreadsheets that will work with legacy and modern software alike.

**Agent Guidance**

- Use xlsx when you need direct workbook/worksheet operations. Use json_to_xlsx_buffer when you only need a quick downloadable XLSX file.

#### Example

```javascript

const rows = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
];

const worksheet = xlsx.utils.json_to_sheet(rows);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');

const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

$_CUSTOM_HEADERS_.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
$_CUSTOM_HEADERS_.set('Content-Disposition', 'attachment; filename="users.xlsx"');
$_RETURN_DATA_ = Buffer.from(buffer);
      
```

---

### `xlsx_style`

[External Documentation](https://github.com/gitbrent/xlsx-js-style) 

Styled XLSX builder based on SheetJS, useful when the exported workbook needs fonts, fills, borders, or alignment.

**Notes**

- Prefer xlsx_style over xlsx when presentation matters in the generated spreadsheet.

#### Example

```javascript

const wb = xlsx_style.utils.book_new();

let row = [
	{ v: "Courier: 24", t: "s", s: { font: { name: "Courier", sz: 24 } } },
	{ v: "bold & color", t: "s", s: { font: { bold: true, color: { rgb: "FF0000" } } } },
	{ v: "fill: color", t: "s", s: { fill: { fgColor: { rgb: "E9E9E9" } } } },
	{ v: "line
break", t: "s", s: { alignment: { wrapText: true } } },
];
const ws = xlsx_style.utils.aoa_to_sheet([row]);
xlsx_style.utils.book_append_sheet(wb, ws, "Styled Demo");

const buffer = xlsx_style.write(wb, { type: 'buffer', bookType: 'xlsx' });

$_CUSTOM_HEADERS_.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
$_CUSTOM_HEADERS_.set('Content-Disposition', 'attachment; filename="styled-demo.xlsx"');
$_RETURN_DATA_ = Buffer.from(buffer);
      
```

---

### `xml2js`

[External Documentation](https://github.com/Leonidas-from-XIV/node-xml2js) 

Simple XML to JavaScript object converter. It supports bi-directional conversion.

*   Returns: Read documentation

#### Example

```javascript

const parser = new xml2js.Parser();
const result = await parser.parseStringPromise('<root><child>Hello</child></root>');
$_RETURN_DATA_ = result;
      
```

---

### `xmlCrypto`

[External Documentation](https://github.com/node-saml/xml-crypto) 

It is a Node.js package that allows working with XML digital signatures, facilitating the signing and verification of XML documents using the XML Signature specification, ideal for applications that handle security and data validation in this format, using private and public keys.

*   Returns: Read documentation

#### Example

```javascript

const xml = fs.readFileSync('my-xml-doc.xml');
const sig = new xmlCrypto.SignedXml();

sig.addReference(
  '//*[local-name(.)="Invoice"]',
  ['http://www.w3.org/2000/09/xmldsig#enveloped-signature'],
  'http://www.w3.org/2001/10/xml-exc-c14n#'
);

sig.loadXml(xml);

const key = fs.readFileSync('my-key.pem');
sig.signingKey = key;

sig.computeSignature();

const signedXml = sig.getSignedXml();
$_RETURN_DATA_ = signedXml;
      
```

---

### `xmlFormatter`

[External Documentation](https://github.com/chrisbottin/xml-formatter) 

Formats XML into a readable, pretty-printed string.

**Notes**

- Useful for debugging SOAP/XML payloads before returning them or saving them to logs.

*   Returns: Formatted XML string

#### Example

```javascript

const xml = '<root><child>Hello</child></root>';
const formattedXml = xmlFormatter(xml, { indentation: '  ' });
$_RETURN_DATA_ = formattedXml;
      
```

---

### `xmldom`

[External Documentation](https://github.com/xmldom/xmldom) 

A JavaScript implementation of W3C DOM for Node.js, Rhino and the browser. Fully compatible with W3C DOM level2; and some compatible with level3.

*   Returns: Read documentation

#### Example

```javascript

const parser = new xmldom.DOMParser();
const doc = parser.parseFromString('<root><child>Hello</child></root>', 'text/xml');
$_RETURN_DATA_ = doc;
      
```

---

### `z`

[External Documentation](https://zod.dev/?id=introduction) 

Zod schema builder and validator, exposed in the JS handler as the variable z.

**Notes**

- The runtime key is z, even though the imported module is named Zod in this source file.

#### Example

```javascript

const schema = z.object({
  name: z.string(),
  age: z.number().int().nonnegative(),
});

const result = schema.parse({ name: 'John', age: 30 });
$_RETURN_DATA_ = result;
      
```

---

