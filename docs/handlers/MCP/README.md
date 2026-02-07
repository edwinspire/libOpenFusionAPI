# MCP Handler – Model Context Protocol

The **MCP Handler** allows your OpenFusionAPI application to act as a **Model Context Protocol (MCP)** server. This enables AI models (like Claude, ChatGPT, etc.) to discover and interact with your defined API endpoints as "Tools".

---

<details>
<summary>🧠 How It Works</summary>

When an endpoint utilizes the **MCP** handler:
1.  **Tool Registration**: It scans the application for endpoints where `mcp.enabled` is true.
2.  **Server Generation**: It dynamically builds an MCP Server instance (`StreamableHTTPServerTransport`) that exposes these endpoints as tools.
3.  **Schema Conversion**: It converts your endpoint's JSON Schemas (input validation) into Zod schemas required by the MCP specification.
4.  **Transport**: It handles the MCP JSON-RPC communication over HTTP, allowing external AI clients to "call" your API functions naturally.

</details>

---

<details>
<summary>⚙️ Endpoint Configuration</summary>

The MCP handler is unique because it's usually configured on a single "Gateway" endpoint that serves as the entry point for the MCP protocol.

**Handler Type**: `MCP`

**Code Config**:
Typically requires no specific code in the editor if using the default factory, as the logic is handled by `server_mcp` factory which aggregates *other* endpoints.

**Enabling Tools**:
To make *other* endpoints visible to this MCP server, you must configure the **MCP** settings in their respective "Advanced" tabs:
-   **Enable MCP**: Checked
-   **Name**: Unique tool name (e.g., `get_weather`).
-   **Description**: Description for the AI model to understand when to use this tool.

</details>

---

<details>
<summary>🔌 Internal Architecture</summary>

The handler dynamically internalizes calls. When an AI invokes a tool:
1.  The MCP Server receives the request.
2.  It identifies the corresponding internal OpenFusionAPI endpoint.
3.  It executes an internal HTTP request (`uFetch`) to that endpoint using `localhost`.
4.  It formats the response (text/json) back into the MCP `content` format expected by the AI.

</details>

---

<details>
<summary>📊 Capability Summary</summary>

| Feature | Supported |
|---|---:|
| MCP Tool Discovery | ✅ (Auto from App config) |
| JSON Schema to Zod | ✅ |
| JSON-RPC Transport | ✅ |
| HTTP Transport | ✅ |
| SSE Transport | ❌ (Current impl is HTTP Req/Res) |

</details>

---

<details>
<summary>💡 Typical Use Cases</summary>

-   **AI Integration**: Connect your business logic (SQL queries, Scripts) to an LLM.
-   **Chatbot Context**: Allow a chatbot to "lookup" user data or "perform" actions via your existing API.
</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
