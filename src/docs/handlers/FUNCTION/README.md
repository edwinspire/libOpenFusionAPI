# FUNCTION Handler – Internal System Functions

The **FUNCTION handler** is designed to invoke pre-registered internal server functions. Unlike the JS handler which accepts raw code, this handler routes requests to specific named functions defined within the application environment.

---

<details>
<summary>🧠 How It Works</summary>

When an endpoint is configured with the **FUNCTION** handler:
1.  **Lookup**: The system looks up the function name (defined in the `Code` or configuration) within the internal function registry (`fnLocal`).
    -   It first checks the specific **App** environment.
    -   If not found, it checks the **Public** scope.
2.  **Execution**: The function is executed with a standardized context object containing the request, response helpers, and server data.
3.  **Timeout**: Execution is protected by a **5-minute timeout** (AbortController).
4.  **Validation**: The output of the function is strictly validated against a predefined JSON schema (`schema_return_customFunction`) to ensure a consistent response structure.

</details>

---

<details>
<summary>⚙️ Endpoint Configuration</summary>

**Handler Type**: `FUNCTION`

**Code Config**:
The "Code" field should contain the **name** of the registered function to call.

```text
myCustomCalculationFn
```

</details>

---

<details>
<summary>💻 Implementation Interface</summary>

Functions registered to be used by this handler must act on a specific object signature:

```javascript
// Internal function signature
async function myCustomFunction({ 
  request,      // Raw HTTP Request
  user_data,    // Merged Query & Body
  reply,        // Fastify Reply object
  server_data,  // Internal Server Context
  signal        // AbortSignal (for timeout handling)
}) {
  // Logic here...
  return {
    code: 200,
    data: { result: "success" }
  };
}
```

</details>

---

<details>
<summary>📥 Response Format</summary>

The function **must** return an object matching this structure to pass validation:

```json
{
  "code": 200,   // HTTP Status Code
  "data": ...    // The actual response payload (Object, Array, String)
}
```

If the return value does not match the schema, the handler returns HTTP `500` with validation errors.

</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
