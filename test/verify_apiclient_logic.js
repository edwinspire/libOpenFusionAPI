import dbsequelize from "../src/lib/db/sequelize.js";
import { ApiClient } from "../src/lib/db/models.js";
import { createApiClient, loginApiClient, updateAPIClientPassword, defaultApiClient } from "../src/lib/db/apiclient.js";
import { EncryptPwd } from "../src/lib/server/utils.js";

async function verifyLogic() {
    console.log("Syncing database...");
    await dbsequelize.sync({ force: true });
    console.log("Database synced.");

    console.log("Testing createApiClient...");
    const createResult = await createApiClient({
        username: "test_api_user",
        email: "test_api@example.com",
        status: "active",
        startAt: new Date(Date.now() - 3600),
    }, false); // random_password = false to use a known one if we wanted, but let's test random first

    const tempPwd = createResult.password;
    console.log("createApiClient OK. Password:", tempPwd);

    console.log("Testing loginApiClient with correct credentials...");
    const loginResult = await loginApiClient("test_api_user", tempPwd);
    if (!loginResult || !loginResult.login) {
        throw new Error("loginApiClient failed with correct credentials");
    }
    console.log("loginApiClient (correct) OK.");

    console.log("Testing loginApiClient with WRONG credentials...");
    const wrongLogin = await loginApiClient("test_api_user", "wrong_pwd");
    if (wrongLogin && wrongLogin.login) {
        throw new Error("loginApiClient succeeded with WRONG credentials!");
    }
    console.log("loginApiClient (wrong) OK.");

    console.log("Testing updateAPIClientPassword...");
    const updateResult = await updateAPIClientPassword({
        username: "test_api_user",
        oldPassword: tempPwd,
        newPassword: "NewSecurePassword123!",
    });

    if (!updateResult.success) {
        throw new Error("updateAPIClientPassword failed: " + updateResult.error);
    }
    console.log("updateAPIClientPassword OK.");

    console.log("Verifying login with NEW password...");
    const newLogin = await loginApiClient("test_api_user", "NewSecurePassword123!");
    if (!newLogin || !newLogin.login) {
        throw new Error("loginApiClient failed with NEW password");
    }
    console.log("New password login OK.");

    console.log("Testing defaultApiClient...");
    const defaultResult = await defaultApiClient();
    if (!defaultResult) {
        throw new Error("defaultApiClient failed");
    }
    const apiUser = await ApiClient.findOne({ where: { username: "apiuser" } });
    if (!apiUser) {
        throw new Error("defaultApiClient did not create apiuser");
    }
    console.log("defaultApiClient OK.");

    console.log("All ApiClient logic checks passed!");
}

verifyLogic().catch(err => {
    console.error("Logic verification failed:", err);
    process.exit(1);
});
