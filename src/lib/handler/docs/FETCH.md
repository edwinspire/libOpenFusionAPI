# FETCH Handler

## Overview

The **FETCH** handler in **OpenFusionAPI** provides a simple and direct way to proxy HTTP requests from your OpenFusionAPI server to any external REST service.  
Internally, it is built on top of Node.js’ native `fetch` API, allowing you to redirect a request received by OpenFusionAPI to another configured URL with minimal setup.

This handler is particularly useful when you want to expose an external service under the same authentication, logging, or monitoring context of OpenFusionAPI, effectively working as a lightweight **reverse proxy**.

---

<details>
<summary>🧠 How It Works</summary>

When a client performs a request to an OpenFusionAPI endpoint configured with the `FETCH` handler, the handler:
1. Takes the incoming request (method, headers, body, query parameters).
2. Sends the request to the **target URL** configured by the user.
3. Returns the **exact same response** from the external service to the client.

The operation is fully transparent to the user and mirrors the behavior of a proxy service.
</details>

---

<details>
<summary>⚙️ Configuration</summary>

In the web interface of OpenFusionAPI, navigate to the **Configuration** tab of your endpoint, then enter the **target URL** for the request.

> Example configuration in the GUI:
> ```
> Url to make the request. The operation is similar to a proxy.
> Url: https://api.github.com/users/edwinspire
> ```

Each endpoint belongs to an **application (app)** and can have different environment configurations:  
- `Development`  
- `Quality`  
- `Production`

Each environment may define its own **application variables** (App Vars), which can be referenced within the configuration.
</details>

---

<details>
<summary>📘 Example</summary>

### Example Endpoint Definition

If you create an endpoint:
```
GET /api/demo/ofapi/fetch/using_app_vars/dev
```

Configured with:
```
Url: https://api.github.com/users/edwinspire
```

Then calling this endpoint from a client:

```bash
curl -X GET https://your-openfusionapi-server/api/demo/ofapi/fetch/using_app_vars/dev
```

OpenFusionAPI will internally call:

```bash
https://api.github.com/users/edwinspire
```

and return its exact response to the client.
</details>

---

<details>
<summary>🌐 Supported HTTP Methods</summary>

The FETCH handler supports **all HTTP methods**:
- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`
- `HEAD`

The method used by the client is preserved in the proxied request.
</details>

---

<details>
<summary>🔧 Request Parameters</summary>

| Parameter | Type | Required | Description |
|------------|------|-----------|--------------|
| `url` | `string` | ✅ | The target URL to which the request will be redirected. |
| `headers` | `object` | Optional | Additional headers to be sent with the request. |
| `query params` | `object` | Optional | Query parameters can be passed as part of the original request. |
| `body` | `any` | Optional | For methods like POST or PUT, the request body is forwarded. |
| `cacheSeconds` | `integer` | Optional | Defines how long (in seconds) the response should be cached. |

**Note:** Timeout handling is globally defined in OpenFusionAPI. Retries are not performed automatically.
</details>

---

<details>
<summary>📤 Response</summary>

The response from the external service is returned **exactly as received**.  
This includes:
- Status code  
- Headers  
- Body (JSON, text, XML, binary, etc.)

No transformation or parsing is applied by the FETCH handler.
</details>

---

<details>
<summary>🔐 Authentication</summary>

Each endpoint in OpenFusionAPI can be configured as:
- **Public** – accessible without authentication  
- **Token-based authentication** – using JWT tokens  
- **Basic authentication**

FETCH itself does not handle authentication to the target service; however, you can include authentication headers (e.g., API keys, Bearer tokens) within the configured URL or the headers section.

Example with authentication header:
```bash
curl -X GET https://your-openfusionapi-server/api/demo/external/users   -H "Authorization: Bearer YOUR_API_TOKEN"
```
</details>

---

<details>
<summary>🏗️ Application Variables and Environments</summary>

Endpoints are organized within **applications (apps)**.  
Each application can define **Application Variables** that can be referenced by the FETCH handler in its configuration.

OpenFusionAPI supports three environments:
- **Development**
- **Quality**
- **Production**

Each environment has its own set of variables, allowing environment-specific configurations for external service URLs, tokens, or keys.

Example:
```text
DEV_API_URL = https://dev.api.externalservice.com
PROD_API_URL = https://api.externalservice.com
```
</details>

---

<details>
<summary>📜 Logs</summary>

All HTTP requests handled by OpenFusionAPI — regardless of the handler — are logged in a **global log system**.  
For FETCH endpoints, this includes:
- Timestamp  
- HTTP method  
- Endpoint path  
- Target URL  
- Response status code  
- Execution time (ms)

Logs can be reviewed from the **Logs** section of the OpenFusionAPI dashboard.
</details>

---

<details>
<summary>❗ Error Handling</summary>

The FETCH handler propagates errors from the external service as-is.  
If the target service responds with an error (e.g., `404`, `500`), the same status code and message are returned to the client.

If OpenFusionAPI cannot reach the target URL (network error, timeout, etc.), a response with an appropriate HTTP error code is generated by the server (typically `502 Bad Gateway` or `504 Gateway Timeout`).
</details>

---

<details>
<summary>📊 Summary</summary>

| Feature | Supported |
|----------|------------|
| HTTP Methods | ✅ All |
| Headers | ✅ |
| Query Params | ✅ |
| Body Forwarding | ✅ |
| Timeout | 🔧 Defined globally |
| Retries | ❌ Not supported |
| Cache | ✅ (configurable per endpoint) |
| Auth Modes | Public / Token / Basic |
| Integration with other modules | ❌ Independent |
| Logging | ✅ Global logs per request |
</details>

---

<details>
<summary>💡 Example Use Cases</summary>

- **Expose an external REST service** under your own domain.  
- **Standardize authentication and logging** for third-party APIs.  
- **Quickly wrap public APIs** into a controlled and secured environment.  
</details>

---

<details>
<summary>📌 Notes</summary>

- The FETCH handler does **not** modify responses in any way.  
- It is ideal for proxying or wrapping existing APIs.  
- For transforming or enriching responses, use other handlers (e.g., `FUNCTION` or `JS`).
</details>

---

© OpenFusionAPI — Created and maintained by [edwinspire](https://github.com/edwinspire)
