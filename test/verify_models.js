import { User, Application, Endpoint, LogEntry, ApiClient, ApiKey } from "../src/lib/db/models.js";

async function verify() {
    console.log("Checking User model...");
    const user = User.build({ username: "testuser" });
    user.ctrl = { role: "admin" };
    if (user.ctrl.role !== "admin") {
        throw new Error("User.ctrl JSON handling failed (getter/setter)");
    }
    console.log("User model OK.");

    console.log("Checking Application model...");
    const app = Application.build({ app: "TestApp" });
    if (app.app !== "testapp") {
        throw new Error("Application name lowercasing failed");
    }
    console.log("Application model OK.");

    console.log("Checking Endpoint model...");
    const endpoint = Endpoint.build({ resource: "/TEST", method: "get", handler: "FUNCTION" });
    if (endpoint.resource !== "/test") {
        throw new Error("Endpoint resource lowercasing failed");
    }
    if (endpoint.method !== "GET") {
        throw new Error("Endpoint method uppercasing failed");
    }
    console.log("Endpoint model OK.");

    console.log("Checking LogEntry model...");
    const log = LogEntry.build({});
    log.req_headers = { "content-type": "application/json" };
    if (log.req_headers["content-type"] !== "application/json") {
        throw new Error("LogEntry JSON handling failed");
    }
    console.log("LogEntry model OK.");

    console.log("Checking ApiClient and ApiKey relations...");
    const client = ApiClient.build({ username: "api_client_test", email: "test@example.com" });
    const key = ApiKey.build({ idclient: client.idclient, token: "test_token" });

    if (!client.idclient) throw new Error("ApiClient idclient not generated");

    console.log("ApiClient and ApiKey build OK.");

    console.log("Checking ApiKey and Application relations...");
    const app2 = Application.build({ app: "test_app" });
    const keyWithApp = ApiKey.build({ idapp: app2.idapp, idclient: client.idclient, token: "app_token" });

    if (!keyWithApp.idapp) throw new Error("ApiKey idapp relation fail");
    console.log("ApiKey and Application build OK.");

    console.log("All basic model checks passed!");
}

verify().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
});
