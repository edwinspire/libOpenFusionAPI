import "dotenv/config";
import { Endpoint } from "../src/lib/db/models.js";

async function update() {
    try {
        const [updated] = await Endpoint.update({
            mcp: {
                enabled: true,
                name: "endpoint_source_summary",
                title: "Get Endpoint Source Summary",
                description: "Returns a compact source summary for one endpoint, including code length, line count, and a preview without the full endpoint payload."
            },
            json_schema: {
                in: {
                    enabled: true,
                    schema: {
                        title: "EndpointSourceSummaryRequest",
                        type: "object",
                        additionalProperties: false,
                        required: ["idendpoint"],
                        properties: {
                            idendpoint: { "type": "string", "format": "uuid", "description": "UUID of the endpoint to summarize." },
                            preview_lines: { "type": "integer", "description": "Number of lines to include in the code preview (default: 40).", "minimum": 1, "maximum": 500 }
                        }
                    }
                }
            }
        }, {
            where: { resource: "/api/endpoint/source/summary" }
        });
        console.log(`Updated ${updated} endpoints.`);
    } catch (e) {
        console.error(e);
    }
}

update();
