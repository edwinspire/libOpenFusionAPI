import { sqlHana } from "./src/lib/handler/sqlHana.js";

// Mock objects for Fastify request/reply
const mockRequest = {
    method: "POST",
    body: {
        connection: {
            uid: "FARMA01",
            pwd: "Farma.2022"
        }
    }
};

const mockReply = {
    code: (status) => ({
        send: (data) => {
            console.log(`[TEST] Status: ${status}`);
            if (status === 200) {
                console.log("[TEST] Success! Data:", data);
            } else {
                console.error("[TEST] Error:", data);
            }
        }
    }),
    header: () => { }
};

// Mock paramsSQL with the serverNode (since client can't override it anymore)
const mockMethod = {
    code: JSON.stringify({
        conexion: {
            serverNode: "192.168.78.25:30241"
        },
        query: "SELECT 1 as \"ConnectionTest\" FROM DUMMY"
    })
};

console.log("Starting HANA Connection Test...");
sqlHana(mockRequest, mockReply, mockMethod).catch(err => {
    console.error("[TEST] Uncaught Exception:", err);
});
