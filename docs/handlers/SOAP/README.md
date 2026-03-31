# SOAP Handler – XML Web Services Connector

The **SOAP handler** enables integration with legacy and enterprise SOAP web services. It uses the `node-soap` library to parse WSDLs and execute methods dynamically.

---

<details>
<summary>🧠 How It Works</summary>

When an endpoint is configured with the **SOAP** handler:
1.  **Client Initialization**: It creates a SOAP client based on the provided WSDL URL.
2.  **Caching**: To optimize performance, initialized SOAP clients are cached in memory (LRU Strategy, Max 50 clients, 10-minute TTL) to avoid re-parsing the WSDL on every request.
3.  **Forwarding**: It maps JSON input from the HTTP request to the XML arguments required by the SOAP method.
4.  **Header Forwarding**: Most HTTP headers from the incoming request are forwarded to the SOAP service (excluding specific hop-by-hop headers).
5.  **Execution**: The interaction happens asynchronously, and the result is returned as a JSON object.

</details>

---

<details>
<summary>⚙️ Endpoint Configuration</summary>

The SOAP handler reads the **WSDL URL** (and optional settings) from the endpoint `code` field. Parameters for the SOAP call come from the HTTP request body.

**`code` field — Application Variable reference** _(recommended for production)_:

Store the WSDL URL and any shared config as an Application Variable and reference it by name. The runtime resolves it at call time:

```
$_VAR_SOAP_SERVICE_WSDL
```

The AppVar value should contain the WSDL URL string. Credentials or extra options can be stored in the same variable if needed.

**`code` field — Inline WSDL config**:

For testing or simple integrations you can provide the config inline:

```json
{
  "wsdl": "https://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL",
  "options": {
    "wsdl_options": {
      "timeout": 5000
    }
  }
}
```

**POST Request Body** — how to call a method at runtime:

Send `functionName` and `RequestArgs` in the HTTP request body. `functionName` selects which SOAP method to invoke; `RequestArgs` maps to its input parameters:

```json
{
  "functionName": "NumberToWords",
  "RequestArgs": {
    "ubiNum": 500
  }
}
```

Values in the request body override any defaults set in the `code` config, so you can fix `functionName` in config for single-method endpoints or leave it open for dynamic invocation.

**`custom_data`** is currently unused by the SOAP handler. Use the `code` field for WSDL and options.

</details>

---

<details>
<summary>🔐 Authentication</summary>

The handler supports common SOAP security standards via configuration:

**Basic Authentication**:
```json
{
  "BasicAuthSecurity": {
    "User": "myuser",
    "Password": "mypassword"
  }
}
```

**Bearer Token**:
```json
{
  "BearerSecurity": "your_oauth_token_here"
}
```

</details>

---

<details>
<summary>🔍 Service Discovery</summary>

To inspect a SOAP service and see available methods and inputs, you can include `"describe()": true` in your configuration or passed arguments.

```json
{
  "wsdl": "...",
  "describe()": true
}
```

This returns the client description (methods, inputs, and outputs) directly as the response.

</details>


<details>
<summary>Real-World Example (MCP-enabled SOAP endpoint)</summary>

This shows a production-ready SOAP endpoint pattern. The endpoint is also exposed as an MCP tool so an AI agent can call it.

**Endpoint config**:
- Method: `POST`
- Handler: `SOAP`
- Code: `$_VAR_SOAP_SERVICE_WSDL`
- MCP enabled: yes, name `update_billing_cycle_day`
- MCP description: `Use this tool to update the billing cycle day for a customer group in the external SOAP system.`

**JSON Schema (input validation)**:
```json
{
  "type": "object",
  "required": ["functionName", "RequestArgs"],
  "properties": {
    "functionName": {
      "type": "string",
      "description": "SOAP method name to invoke"
    },
    "RequestArgs": {
      "type": "object",
      "required": ["groupId", "groupIdType", "billingCycleDay"],
      "properties": {
        "groupId": { "type": "string", "description": "Customer group identifier" },
        "groupIdType": { "type": "string", "description": "Customer group identifier type" },
        "billingCycleDay": { "type": "integer", "minimum": 1, "maximum": 31, "description": "New billing cycle day" }
      }
    }
  }
}
```

**HTTP call**:
```bash
curl -X POST https://your-server.com/api/myapp/groups/update_billing_cycle_day/qa \
  -H "Content-Type: application/json" \
  -d '{
    "functionName": "UpdateBillingCycleDay",
    "RequestArgs": {
      "groupId": "GROUP-1001",
      "groupIdType": "ACCOUNT",
      "billingCycleDay": 15
    }
  }'
```

**What happens internally**:
1. The SOAP client loads the WSDL from the `$_VAR_SOAP_SERVICE_WSDL` AppVar.
2. It invokes the `UpdateBillingCycleDay` method with the `RequestArgs`.
3. The XML response is automatically converted to JSON and returned.

</details>

<details>
<summary>📊 Capability Summary</summary>

| Feature | Supported |
|---|---:|
| WSDL Parsing | ✅ |
| Client Caching | ✅ (LRU & TTL) |
| Basic Auth / Bearer Auth | ✅ |
| Application Variable Reference | ✅ (`$_VAR_*` in code field) |
| Dynamic Arguments | ✅ (From Body/Query) |
| Header Forwarding | ✅ |
| Describe / Introspect | ✅ |

</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
