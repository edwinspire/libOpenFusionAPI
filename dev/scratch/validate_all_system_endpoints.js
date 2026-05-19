import "dotenv/config";
import { Application, Endpoint } from "../src/lib/db/models.js";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFwaWtleSI6eyJpZGFwcCI6ImNmY2QyMDg0LTk1ZDUtNjVlZi02NmU3LWRmZjlmOTg3NjRkYSIsImlkY2xpZW50IjoiNjE4OWU0MDEtYjdmYS00MGU1LTllODUtYmUwMjhlMTNhNmFlIn19LCJleHAiOjE3ODI5NTA0MDAsIm5iZiI6MTc3ODExMjAwMCwiaWF0IjoxNzc4Mjk5OTY1fQ.FN6vsklPSia4HoAcQCwEHlpa1VQKsu9NzF6qBjylpqM";
const baseUrl = "http://localhost:3000";

async function validate() {
    try {
        const app = await Application.findOne({
            where: { app: "system" },
            include: [{
                model: Endpoint,
                as: "endpoints",
                where: { environment: "prd", enabled: true }
            }]
        });

        if (!app) {
            console.error("System app not found");
            return;
        }

        console.log(`Found ${app.endpoints.length} enabled endpoints for system/prd.`);

        const results = [];

        for (const ep of app.endpoints) {
            const url = `${baseUrl}/api/${app.app}${ep.resource.replace(/\/$/, "")}/${ep.environment}`;
            console.log(`Testing ${ep.method} ${url} ...`);

            // Try with empty body/params first
            let response = await fetch(url, {
                method: ep.method,
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0",
                    "Authorization": `Bearer ${token}`
                },
                body: ep.method === "POST" ? "{}" : undefined
            });

            let status = response.status;
            let body = await response.text();

            // If 404, check if it's because of missing parameters (like our previous bug)
            // Or if it's a real routing 404.
            // If it's a real 404, the body usually contains { error: "Endpoint not found" }
            let isRouting404 = false;
            try {
                const json = JSON.parse(body);
                if (status === 404 && json.error === "Endpoint not found") {
                    isRouting404 = true;
                }
            } catch (e) {}

            results.push({
                resource: ep.resource,
                method: ep.method,
                status: status,
                isRouting404: isRouting404,
                bodyPreview: body.substring(0, 100)
            });
        }

        console.table(results);

        const routing404s = results.filter(r => r.isRouting404);
        if (routing404s.length > 0) {
            console.error("CRITICAL: Found routing 404s!");
            process.exit(1);
        } else {
            console.log("All endpoints reached successfully (no routing 404s).");
        }

    } catch (error) {
        console.error("Error during validation:", error);
    }
}

validate();
