import "dotenv/config";
import { Endpoint } from "../src/lib/db/models.js";

async function check() {
    try {
        const ep = await Endpoint.findOne({
            where: { resource: "/api/endpoint/source/summary" }
        });
        if (ep) {
            console.log("MCP_VALUE:", JSON.stringify(ep.mcp, null, 2));
            console.log("JSON:", JSON.stringify(ep.toJSON(), null, 2));
        } else {
            console.log("Not found in DB:", process.env.DATABASE_URI_API);
        }
    } catch (e) {
        console.error(e);
    }
}

check();
