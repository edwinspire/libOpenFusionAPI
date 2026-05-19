import "dotenv/config";

const mcpUrl = "http://localhost:3000/api/system/mcp/server/prd";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFwaWtleSI6eyJpZGFwcCI6ImNmY2QyMDg0LTk1ZDUtNjVlZi02NmU3LWRmZjlmOTg3NjRkYSIsImlkY2xpZW50IjoiNjE4OWU0MDEtYjdmYS00MGU1LTllODUtYmUwMjhlMTNhNmFlIn19LCJleHAiOjE3ODI5NTA0MDAsIm5iZiI6MTc3ODExMjAwMCwiaWF0IjoxNzc4Mjk5OTY1fQ.FN6vsklPSia4HoAcQCwEHlpa1VQKsu9NzF6qBjylpqM";

async function callMcp(method, params = {}) {
    const response = await fetch(mcpUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: Date.now(),
            method: method,
            params: params
        })
    });
    const text = await response.text();
    // console.log("Raw Response:", text);
    const lines = text.split("\n");
    for (const line of lines) {
        if (line.startsWith("data: ")) {
            const data = line.slice(6);
            return JSON.parse(data);
        }
    }
    return JSON.parse(text); // Fallback if not SSE
}

async function run() {
    try {
        console.log("Listing tools from MCP server...");
        const result = await callMcp("tools/list");
        console.log("Tools found:", JSON.stringify(result, null, 2));

        if (result.error) {
            console.error("MCP Error:", result.error);
            return;
        }

        const tools = result.result.tools || [];
        console.log(`Found ${tools.length} tools.`);

        // In this project, tools usually correspond to endpoints.
        // But the user wants to test endpoints of the "system" application.
        // Let's see if we can find endpoints for the system app.
        // We can use the db to get the list of endpoints if the MCP tools are not enough.
        
        // However, the user said "usa el servidor MCP ... para ver la lista de los endpoints"
        // So I will assume the tools are the endpoints or there is a tool to list endpoints.
        
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
