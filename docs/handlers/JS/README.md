# JS Handler – Server-Side JavaScript Execution

The **JS handler** enables the execution of raw JavaScript code on the server. This is the most flexible handler, allowing for complex logic, data transformation, multiple API calls, and custom algorithmic processing.

---

<details>
<summary>🧠 How It Works</summary>

When an endpoint is configured with the **JS** handler:
1.  **Sandboxing**: The code provided in the configuration is wrapped in an async function and executed within a Node.js VM context (using `createFunctionVM`).
2.  **Context Injection**: The function receives a context object providing access to the HTTP request, response helpers, and environment variables.
3.  **Execution**: The script runs, performs its logic, and returns a result object.
4.  **Response**: The `data` property of the result is sent back as the HTTP response body. Headers can also be customized.

</details>

---

<details>
<summary>⚙️ Endpoint Configuration</summary>

The configuration area accepts raw JavaScript code. The code must essentially form the body of an asynchronous function.

**Available Context Variables**:
You have access to a context object (implied) with helper functions injected via `functionsVars`:
-   `$_REQUEST_`: Access headers, body, query, and method.
-   `endpointEnv`: Environment variables for the current endpoint environment.

**Expected Return**:
Your code should return an object with:
-   `data`: The payload to send to the client (JSON object, string, etc.).
-   `headers`: (Optional) A `Map` or object of custom headers to set.

**Simple Example**:
```javascript
// Echo back the request body with a timestamp
const body = $_REQUEST_.body || {};
body.processedAt = new Date().toISOString();

return {
  data: body
};
```

</details>

---

<details>
<summary>📦 Importing Modules</summary>

The JS Handler environment often enables access to standard internal libraries. You can use `import` statements if the environment supports ESM, or rely on globally injected dependencies if configured in the VM setup. _(Note: Check your administrator's configuration for enabled modules)._

</details>

---

<details>
<summary>📤 Example Logic</summary>

**Complex Transformation**

```javascript
// Calculate total value from a list of items in the request
const items = $_REQUEST_.body.items || [];
let total = 0;

for (const item of items) {
  total += (item.price * item.quantity);
}

// Add a custom header
let headers = new Map();
headers.set('X-Calculated-Total', total.toString());

return {
  data: { 
    count: items.length, 
    totalValue: total, 
    currency: "USD" 
  },
  headers: headers
};
```

</details>

---

<details>
<summary>📊 Capability Summary</summary>

| Feature | Supported |
|---|---:|
| Custom Logic | ✅ |
| Access Request Data | ✅ (Body, Query, Headers) |
| Custom Response Headers | ✅ |
| Async/Await | ✅ |
| Environment Variables | ✅ |
| Error Handling | ✅ (Catch & throw) |

</details>

---

<details>
<summary>⚠️ Security & Performance</summary>

-   **Sandboxing**: Code runs in a VM, but infinite loops or heavy computations can impact server performance.
-   **Timeouts**: Execution is typically bounded by a timeout (default or configured per endpoint) to prevent hanging processes.
</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
