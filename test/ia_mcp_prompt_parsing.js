import assert from "node:assert/strict";

import { __internalIAForTests } from "../src/lib/server/ia.js";

const {
	parseAssistantToolIntent,
	buildToolUsageGuidance,
	buildToolCallFingerprint,
	resolveResponseTimeoutMs,
	createExecutionSignal,
	runWithAbortSignal,
	OpenAICompatibleAdapter,
	MCPToolRuntime,
} = __internalIAForTests;

const taggedIntent = parseAssistantToolIntent(`
<tools>
{"type":"function","function":{"name":"exa__web_search_exa"}}
</tools>

<response>
{"name":"exa__web_search_exa","arguments":{"query":"official Exa MCP page"}}
</response>
`);

assert.deepEqual(taggedIntent, {
	name: "exa__web_search_exa",
	parameters: {
		query: "official Exa MCP page",
	},
});

const fencedIntent = parseAssistantToolIntent([
	"The tool call is below.",
	"",
	"```json",
	'{"name":"exa__web_fetch_exa","arguments":{"url":"https://exa.ai/mcp"}}',
	"```",
].join("\n"));

assert.deepEqual(fencedIntent, {
	name: "exa__web_fetch_exa",
	parameters: {
		url: "https://exa.ai/mcp",
	},
});

const guidance = buildToolUsageGuidance([
	{
		serverName: "exa",
		serverUrl: "https://mcp.exa.ai/mcp",
		toolName: "web_search_exa",
		title: "Web Search",
		description: "Search the web for information.",
	},
]);

assert.equal(typeof guidance, "string");
assert.ok(guidance.includes("After a tool returns useful data, answer the user with that result instead of calling the same tool again."));
assert.ok(guidance.includes("Do not repeat the same tool call with the same arguments unless the previous result was empty, incomplete, or failed."));

assert.equal(
	buildToolCallFingerprint("web_search_exa", { query: "exa", numResults: 5 }),
	buildToolCallFingerprint("web_search_exa", { numResults: 5, query: "exa" }),
);

assert.equal(resolveResponseTimeoutMs({ responseTimeout: 2500 }), 2500);
assert.equal(resolveResponseTimeoutMs({ responseTimeoutMs: 3000 }), 3000);
assert.equal(resolveResponseTimeoutMs({ runTimeout: 3500 }), 3500);
assert.equal(resolveResponseTimeoutMs({ timeout: 9999 }), undefined);

const azureAdapter = new OpenAICompatibleAdapter({
	provider: "azure-openai",
	model: "gpt-4o-mini",
	baseUrl: "https://example-resource.cognitiveservices.azure.com/openai",
	apiVersion: "2025-01-01-preview",
	azureApiKey: "test-key",
	responseTimeout: 5000,
});

let capturedCompletionArgs;
azureAdapter.client = {
	chat: {
		completions: {
			create: async (...args) => {
				capturedCompletionArgs = args;
				return {
					choices: [{
						message: {
							content: "OK",
							ool_calls: undefined,
						},
					}],
				};
			},
		},
	},
};

await azureAdapter.run({
	prompts: [{ role: "user", content: "Responde exactamente con OK" }],
	runtime: {
		getToolUsageGuidance: () => null,
		getOpenAITools: () => [],
		executionLog: [],
		getDiagnosticsServers: () => [],
	},
	includeDiagnostics: true,
	signal: AbortSignal.timeout(1000),
});

assert.equal(Array.isArray(capturedCompletionArgs), true);
assert.equal(capturedCompletionArgs.length, 2);
assert.equal(Object.prototype.hasOwnProperty.call(capturedCompletionArgs[0], "signal"), false);
assert.ok(capturedCompletionArgs[1]?.signal instanceof AbortSignal);

await assert.rejects(
	runWithAbortSignal(
		() => new Promise(() => {}),
		{
			signal: createExecutionSignal(undefined, 20),
			timeoutMessage: "Timed out waiting for the AI response.",
		},
	),
	(error) => {
		assert.ok(error?.name === "AbortError" || error?.name === "TimeoutError");
		assert.match(error?.message ?? "", /timed out|timeout/i);
		return true;
	},
);

const runtime = new MCPToolRuntime();
let callCount = 0;

runtime.toolRegistry.set("exa__web_search_exa", {
	alias: "exa__web_search_exa",
	toolName: "web_search_exa",
	serverName: "exa",
	serverUrl: "https://mcp.exa.ai/mcp",
	client: {
		callTool: async ({ name, arguments: args }) => {
			callCount += 1;
			return {
				content: `tool=${name};query=${args.query}`,
			};
		},
	},
});

const firstExecutions = await runtime.executeToolCalls([
	{
		id: "call-1",
		name: "exa__web_search_exa",
		arguments: { query: "official Exa MCP page" },
	},
]);

const secondExecutions = await runtime.executeToolCalls([
	{
		id: "call-2",
		name: "exa__web_search_exa",
		arguments: { query: "official Exa MCP page" },
	},
]);

assert.equal(callCount, 1);
assert.equal(firstExecutions[0].deduplicated, false);
assert.equal(secondExecutions[0].deduplicated, true);
assert.equal(secondExecutions[0].duplicateOf, "call-1");
assert.ok(secondExecutions[0].textResult.includes("Duplicate tool call suppressed"));

console.log(JSON.stringify({
	ok: true,
	checked: [
		"tagged tool intent parsing",
		"fenced tool intent parsing",
		"anti-repeat guidance",
		"stable tool call fingerprint",
		"azure signal request option",
		"response timeout resolution",
		"response timeout abort",
		"runtime duplicate tool suppression",
	],
}, null, 2));