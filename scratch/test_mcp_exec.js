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
    const lines = text.split("\n");
    for (const line of lines) {
        if (line.startsWith("data: ")) {
            const data = line.slice(6);
            return JSON.parse(data);
        }
    }
    return JSON.parse(text);
}

async function run() {
    try {
        console.log("Calling endpoint_source_summary via MCP...");
        const result = await callMcp("tools/call", {
            name: "endpoint_source_summary",
            arguments: {
                idendpoint: "0f9b28e3-5412-45dd-82f6-c5bf1778d104" // The id from system.js
            }
        });
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
