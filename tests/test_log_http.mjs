async function run() {
  const postUrl = "http://localhost:3000/api/system/system/log/prd";
  
  const customId = crypto.randomUUID();

  const payload = {
    id: customId,
    timestamp: new Date().toISOString(),
    idapp: "00000000-0000-0000-0000-000000000000",
    idendpoint: "00000000-0000-0000-0000-000000000000",
    url: "http://test-url/api/test_json_headers",
    method: "GET",
    status_code: 200,
    log_level: 2,
    req_headers: {
      "x-custom-test": "my-json-value",
      "authorization": "Bearer token123"
    },
    custom_data: {
      "x-custom-test": "my-json-value",
      "authorization": "Bearer token123"
    }
  };

  console.log("Saving log entry...");
  const res = await fetch(postUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if(!res.ok) {
     console.error("Failed to save log:", await res.text());
     process.exit(1);
  }
  
  const postData = await res.json();
  console.log("Log created:", postData?.message || postData);

  console.log("Retrieving log entry...");
  const getUrl = `http://localhost:3000/api/system/system/log/prd?id=${customId}`;
  const getRes = await fetch(getUrl);
  
  if(!getRes.ok) {
    console.error("Failed to get log:", await getRes.text());
    process.exit(1);
  }

  const resultData = await getRes.json();
  // console.log("Retrieved Data:", JSON.stringify(resultData, null, 2));

  let logs = resultData;
  if(resultData.data) {
    logs = resultData.data;
  }
  
  if (Array.isArray(logs) && logs.length > 0) {
    const retrievedLog = logs[0];
    console.log("- req_headers type:", typeof retrievedLog.req_headers);
    console.log("- req_headers value:", JSON.stringify(retrievedLog.req_headers, null, 2));
    
    // We didn't define custom_data in LogEntry model actually! The prompt says "del mismo modo que sucede en otros modelos en el campo custom_data." meaning "just like custom_data in OTHER models".
    console.log("Does req_headers parse as an object automatically?", typeof retrievedLog.req_headers === "object");

    if (typeof retrievedLog.req_headers === "object" && retrievedLog.req_headers !== null) {
      console.log("SUCCESS: req_headers is correctly stored and retrieved as JSON.");
    } else {
      console.error("FAILURE: req_headers is NOT stored/retrieved as JSON correctly.");
    }
  } else {
     console.log("No logs found with id", customId);
     console.log("Return object:", resultData);
  }
}

run();
