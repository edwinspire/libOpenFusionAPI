import dbsequelize from "../src/lib/db/sequelize.js";
import { Endpoint, Application } from "../src/lib/db/models.js";
import { v4 as uuidv4 } from "uuid";

async function verifyEndpointUUID() {
    console.log("Syncing database...");
    await dbsequelize.sync();

    console.log("Creating test application...");
    const suffix = Math.random().toString(36).substring(7);
    const app = await Application.create({ app: `uuid_test_app_${suffix}` });

    console.log("Testing with valid UUID...");
    const validUUID = uuidv4();
    const ep1 = await Endpoint.create({
        idendpoint: validUUID,
        idapp: app.idapp,
        resource: "/test-uuid-valid",
        method: "GET",
        handler: "FUNCTION",
        code: "// test",
        environment: "dev"
    });
    if (ep1.idendpoint !== validUUID) throw new Error("Valid UUID was overwritten: " + ep1.idendpoint);
    console.log("Valid UUID OK.");

    console.log("Testing with invalid UUID string...");
    const ep2 = await Endpoint.create({
        idendpoint: "invalid-uuid-string",
        idapp: app.idapp,
        resource: "/test-uuid-invalid",
        method: "GET",
        handler: "FUNCTION",
        code: "// test",
        environment: "dev"
    });
    console.log("Generated UUID for invalid string:", ep2.idendpoint);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ep2.idendpoint)) throw new Error("Invalid UUID generated: " + ep2.idendpoint);
    console.log("Invalid string handled OK.");

    console.log("Testing with null/undefined UUID...");
    const ep3 = await Endpoint.create({
        idapp: app.idapp,
        resource: "/test-uuid-null",
        method: "GET",
        handler: "FUNCTION",
        code: "// test",
        environment: "dev"
    });
    console.log("Generated UUID for null:", ep3.idendpoint);
    if (!uuidRegex.test(ep3.idendpoint)) throw new Error("Null UUID not handled correctly: " + ep3.idendpoint);
    console.log("Null handling OK.");

    console.log("All Endpoint UUID validation checks passed!");
}

verifyEndpointUUID().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
});
