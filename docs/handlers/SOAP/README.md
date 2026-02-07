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

The configuration must be a valid **JSON object**.

**Basic Structure**:
```json
{
  "wsdl": "https://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL",
  "functionName": "NumberToWords",
  "RequestArgs": {
    "ubiNum": 500
  },
  "options": {
    "wsdl_options": {
      "timeout": 5000
    }
  }
}
```

**Override from Request**:
If the HTTP Method is **GET**, `RequestArgs` are taken from the query string.
If the HTTP Method is **POST**, `RequestArgs` are merged with the request body.

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

---

<details>
<summary>📊 Capability Summary</summary>

| Feature | Supported |
|---|---:|
| WSDL Parsing | ✅ |
| Client Caching | ✅ (LRU & TTL) |
| Basic Auth / Bearer Auth | ✅ |
| Dynamic Arguments | ✅ (From Body/Query) |
| Header Forwarding | ✅ |
| Describe / Introspect | ✅ |

</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
