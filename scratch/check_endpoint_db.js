import "dotenv/config";
import { Endpoint } from "../src/lib/db/models.js";

async function test() {
    try {
        const resource = "/api/endpoint/source/summary";
        const method = "POST";
        const environment = "prd";
        const app = "system";

        console.log(`Searching for endpoint: ${method} ${resource} in ${app}/${environment}`);
        
        const ep = await Endpoint.findOne({
            where: {
                resource: resource,
                method: method,
                environment: environment
            }
        });

        if (ep) {
            console.log("Endpoint found in database!");
            console.log(JSON.stringify(ep.toJSON(), null, 2));
        } else {
            console.log("Endpoint NOT found in database.");
            
            // Let's see all endpoints for system to see if there's a typo
            const all = await Endpoint.findAll({
                where: {
                    environment: environment,
                    method: method
                }
            });
            console.log("Other endpoints for system/prd/POST:");
            all.forEach(e => console.log(`- ${e.resource}`));
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
