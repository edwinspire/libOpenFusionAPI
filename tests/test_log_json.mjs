import { LogEntry } from "../src/lib/db/models.js";
import { createLog, getLogs } from "../src/lib/db/log.js";

async function run() {
  try {
    // Save sample log entry
    const sampleLog = {
      timestamp: new Date(),
      idapp: "00000000-0000-0000-0000-000000000000",
      idendpoint: "00000000-0000-0000-0000-000000000000",
      url: "http://test-url/api/test",
      method: "GET",
      status_code: 200,
      log_level: 2,
      req_headers: {
        "content-type": "application/json",
        "authorization": "Bearer token123",
        "custom-metadata": { test: true }
      },
      res_headers: {
        "content-type": "application/json"
      },
      custom_data: { test: true }
    };
    
    console.log("Saving log entry...");
    const createdLog = await createLog(sampleLog);
    
    console.log("Log created with ID:", createdLog.id);
    
    console.log("Retrieving log entry...");
    const logs = await getLogs({ "id": createdLog.id });
    
    if (logs.length > 0) {
      const retrievedLog = logs[0].toJSON();
      console.log("- req_headers type:", typeof retrievedLog.req_headers);
      console.log("- req_headers value:", JSON.stringify(retrievedLog.req_headers, null, 2));
      console.log("- custom_data type:", typeof retrievedLog.custom_data);
      console.log("- custom_data value:", JSON.stringify(retrievedLog.custom_data, null, 2));
      
      const isJsonEqual = typeof retrievedLog.req_headers === typeof retrievedLog.custom_data;
      console.log("Are both treated as JSON identically?", isJsonEqual);
    } else {
        const lastLogs = await LogEntry.findAll({ order: [['timestamp', 'DESC']], limit: 1 });
        if(lastLogs.length > 0) {
            const raw = lastLogs[0].toJSON();
            console.log("Using last log manually...");
            console.log("- req_headers type:", typeof raw.req_headers);
            console.log("- req_headers value:", JSON.stringify(raw.req_headers, null, 2));
        } else {
            console.log("No log found.");
        }
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

run();
