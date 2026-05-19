import "dotenv/config";
import { Application, Endpoint, AppVars } from "../src/lib/db/models.js";

async function test() {
    try {
        const appWhere = { app: "system", enabled: true };
        const endpointWhere = {
            enabled: true,
            environment: "prd",
            method: "POST",
            resource: "/api/endpoint/source/summary"
        };

        console.log("Searching with Application.findOne and include...");
        const data = await Application.findOne({
            where: appWhere,
            include: [
                {
                    model: AppVars,
                    as: "vrs",
                    required: false,
                },
                {
                    model: Endpoint,
                    as: "endpoints",
                    required: true,
                    where: endpointWhere,
                },
            ],
        });

        if (data) {
            console.log("Application found with matching endpoints!");
            console.log("Endpoints count:", data.endpoints.length);
        } else {
            console.log("NOT FOUND with the full query.");
            
            // Check why it failed
            const app = await Application.findOne({ where: appWhere });
            if (!app) {
                console.log("- Application itself not found or disabled.");
            } else {
                console.log("- Application found. Checking endpoints separately...");
                const eps = await Endpoint.findAll({
                    where: {
                        idapp: app.idapp,
                        ...endpointWhere
                    }
                });
                console.log("- Endpoints matching filters:", eps.length);
                if (eps.length === 0) {
                    console.log("- No endpoints matched the filters.");
                    // Check individual filters
                    const allEps = await Endpoint.findAll({ where: { idapp: app.idapp } });
                    console.log("- Total endpoints for this app:", allEps.length);
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
