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
        console.log("Calling list_api_endpoints_catalog_system...");
        const result = await callMcp("tools/call", {
            name: "list_api_endpoints_catalog_system",
            arguments: {}
        });
        
        if (result.error) {
            console.error("MCP Error:", result.error);
            return;
        }

        const content = result.result.content[0].text;
        console.log("Endpoints Catalog:\n", content);

        // Parse endpoints from the markdown table
        // Format: | Tool Name | Method | Resource Path | Handler |
        const endpoints = [];
        const lines = content.split("\n");
        for (const line of lines) {
            if (line.includes("|") && !line.includes("Tool Name") && !line.includes("---")) {
                const parts = line.split("|").map(p => p.trim()).filter(p => p !== "");
                if (parts.length >= 3) {
                    endpoints.push({
                        method: parts[1],
                        path: parts[2]
                    });
                }
            }
        }

        console.log(`Found ${endpoints.length} endpoints to test.`);

        for (const ep of endpoints) {
            // Correct URL construction: /api/system + resource + /prd
            const url = `http://localhost:3000/api/system${ep.path}/prd`;
            console.log(`Testing ${ep.method} ${url}...`);
            try {
                const testRes = await fetch(url, {
                    method: ep.method,
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                console.log(`Response: ${testRes.status} ${testRes.statusText}`);
                if (testRes.status === 404) {
                    console.error(`ERROR: Endpoint ${url} returned 404!`);
                }
            } catch (err) {
                console.error(`Error testing ${url}:`, err.message);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
