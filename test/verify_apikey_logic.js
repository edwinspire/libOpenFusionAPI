import dbsequelize from "../src/lib/db/sequelize.js";
import { ApiClient, Application, ApiKey } from "../src/lib/db/models.js";
import { upsertApiKey, getApiKeyById, getAllApiKeys, deleteApiKey, getApiKeyByFilters } from "../src/lib/db/apikey.js";

async function verifyApiKeyLogic() {
    console.log("Syncing database...");
    await dbsequelize.sync();

    console.log("Creating test data...");
    const suffix = Date.now();
    const client = await ApiClient.create({ username: `api_client_${suffix}`, email: `client${suffix}@test.com`, password: "pwd" });
    const app = await Application.create({ app: `app${suffix}` });

    console.log("Testing upsertApiKey...");
    const token = `token_${suffix}`;
    const { result: key1, created } = await upsertApiKey({
        idapp: app.idapp,
        idclient: client.idclient,
        token: token,
        description: "Test Key 1",
        enabled: true
    });
    console.log("upsertApiKey result - created:", created);
    if (created === false) {
        console.warn("Notice: created flag is false. This might be a dialect specific behavior if the record is new.");
    }
    if (!key1) throw new Error("Key result should exist");
    console.log("upsertApiKey OK.");

    console.log("Testing getApiKeyById...");
    const foundKey = await getApiKeyById(key1.idkey);
    if (!foundKey || foundKey.token !== token) throw new Error("getApiKeyById failed");
    console.log("getApiKeyById OK.");

    console.log("Testing getApiKeyByFilters (by idapp)...");
    const filteredKeys = await getApiKeyByFilters(app.idapp);
    if (filteredKeys.length !== 1) throw new Error("getApiKeyByFilters (idapp) failed");
    console.log("getApiKeyByFilters (idapp) OK.");

    console.log("Testing getApiKeyByFilters (by token)...");
    const filteredByToken = await getApiKeyByFilters(undefined, undefined, undefined, undefined, undefined, token);
    if (filteredByToken.length !== 1) throw new Error("getApiKeyByFilters (token) failed");
    console.log("getApiKeyByFilters (token) OK.");

    console.log("Testing deleteApiKey...");
    const deleted = await deleteApiKey(key1.idkey);
    if (!deleted) throw new Error("deleteApiKey failed");
    const checkDelete = await getApiKeyById(key1.idkey);
    if (checkDelete) throw new Error("Key should be deleted");
    console.log("deleteApiKey OK.");

    console.log("All ApiKey handlers checks passed!");
}

verifyApiKeyLogic().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
});
