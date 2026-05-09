import "dotenv/config";
import { getApplicationTreeByFilters } from "../src/lib/db/app.js";
import { url_key } from "../src/lib/server/utils_path.js";

async function test() {
    try {
        const params = {
            app: "system",
            environment: "prd",
            method: "POST",
            resource: "/api/endpoint/source/summary"
        };

        console.log("Simulating EndpointLoader._loadEndpointsByAPPToCache with params:", params);

        const appData = await getApplicationTreeByFilters({
            app: params.app,
            enabled: true,
            endpoint: {
                enabled: true,
                environment: params.environment,
                method: params.method,
                resource: params.resource,
            },
        });

        if (!appData) {
            console.log("Fetcher returned NULL (Application not found or no matching endpoints)");
            return;
        }

        console.log("Fetcher returned appData. ID:", appData.idapp);
        console.log("Number of endpoints returned:", appData.endpoints ? appData.endpoints.length : 0);

        if (appData.endpoints) {
            appData.endpoints.forEach(ep => {
                const key = url_key(
                    appData.app,
                    ep.resource,
                    ep.environment,
                    ep.method,
                    ep.method === "WS"
                );
                console.log(`- Endpoint in appData: ${ep.method} ${ep.resource} -> Key: ${key}`);
            });
            
            const expectedKey = url_key(params.app, params.resource, params.environment, false);
            console.log(`Expected Key: ${expectedKey}`);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

test();
