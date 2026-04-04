# JS Handler – Server-Side JavaScript Execution

The **JS handler** enables the execution of raw JavaScript code on the server. This is the most flexible handler, allowing for complex logic, data transformation, multiple API calls, and custom algorithmic processing.

---

<details>
<summary>🧠 How It Works</summary>

When an endpoint is configured with the **JS** handler:
1.  **Sandboxing**: The code provided in the configuration is wrapped in an async function and executed within a Node.js VM context (using `createFunctionVM`).
2.  **Context Injection**: The function receives a context object providing access to the HTTP request, response helpers, and environment variables.
3.  **Execution**: The script runs inside the VM sandbox with helper variables injected into scope.
4.  **Response**: To send a response you must assign a value to `$_RETURN_DATA_`. Custom headers can be assigned to `$_CUSTOM_HEADERS_`.

</details>

---

<details>
<summary>⚙️ Endpoint Configuration</summary>

The configuration area accepts raw JavaScript code. The code must essentially form the body of an asynchronous function.

**Available Context Variables**:
You have access to a context object (implied) with helper functions injected via `functionsVars`:
-   `request.query` — Query string parameters for GET endpoints (object).
-   `request.body` — Parsed JSON body for POST endpoints; also used for multipart form-data fields.
-   `request.headers` — Incoming HTTP headers.
-   `endpointEnv` — Resolved Application Variables for the current environment. App Vars referenced as `$_VAR_NAME_` in other handlers are accessed directly here (e.g., `endpointEnv.VAR_EMAIL_TRANSPORT`).
-   `$_RETURN_DATA_` — Assign any JSON-serializable value here to send it as the response body.
-   `$_CUSTOM_HEADERS_` — Optional `Map<string, string>` with custom response headers (e.g., for file downloads).
-   `uFetchAutoEnv` — Built-in helper for calling other endpoints within the same OpenFusionAPI instance.
-   `request_xlsx_body_to_json(request)` — Built-in async helper that parses a multipart/form-data XLSX upload into a JSON array.

`uFetch` / `uFetchAutoEnv` note:
- `@edwinspire/universal-fetch` changes over time. Before creating or editing endpoint code that depends on it, verify the current official documentation or the installed package version.
- Do not assume legacy aliases such as `GET()` or `POST()` are still the preferred API.

**Response Contract**:
-   Assign the payload to `$_RETURN_DATA_`.
-   Optionally assign a `Map` to `$_CUSTOM_HEADERS_`.
-   Do **not** use `return` as the response contract.

**Simple Example (GET)**:
```javascript
// Read query params, call another endpoint, return merged result
const { user_name, account_id } = request.query;

const uF = uFetchAutoEnv.auto("/api/myapp/db/user/auto", true);
const resp = await uF.get({ data: { user_name, account_id } });
$_RETURN_DATA_ = await resp.json();
```

**Simple Example (POST)**:
```javascript
// Read POST body fields
const { name, status } = request.body;

const uF = uFetchAutoEnv.auto("/api/myapp/db/entity/auto", true);
const resp = await uF.post({ data: { bind: { name, status } } });
$_RETURN_DATA_ = await resp.json();
```

</details>

---

<details>
<summary>📦 Importing Modules</summary>

The JS Handler environment often enables access to standard internal libraries. You can use `import` statements if the environment supports ESM, or rely on globally injected dependencies if configured in the VM setup. _(Note: Check your administrator's configuration for enabled modules)._

Common pre-injected modules available in many deployments include:
- `nodemailer` — for sending emails
- `xlsx_style` — for generating Excel files (XLSX)
- `uFetchAutoEnv` — for calling internal API endpoints
- `request_xlsx_body_to_json` — for parsing uploaded XLSX files

</details>

---

<details>
<summary>📤 Example Logic</summary>

**Complex Transformation**

```javascript
// Calculate total value from a list of items in the request
const items = request.body.items || [];
let total = 0;

for (const item of items) {
  total += (item.price * item.quantity);
}

// Add a custom header
let headers = new Map();
headers.set('X-Calculated-Total', total.toString());

$_CUSTOM_HEADERS_ = headers;
$_RETURN_DATA_ = {
  count: items.length,
  totalValue: total,
  currency: "USD"
};
```

**XLSX File Upload — parse a multipart/form-data spreadsheet upload**

```javascript
// request.body contains multipart form fields (strings/values)
// request_xlsx_body_to_json parses the attached XLSX file
const sheets = await request_xlsx_body_to_json(request);

if (Array.isArray(sheets) && sheets.length > 0) {
  const rows = sheets[0]?.sheets[0]?.data;

  // Multipart fields are accessed via request.body
  const groupIdType = request.body?.groupIdType?.value;
  const groupId = request.body?.groupId?.value;

  // Process rows and call downstream endpoint
  const uF = uFetchAutoEnv.auto("/api/myapp/data/import/auto", true);
  const resp = await uF.post({
    data: { groupIdType, groupId, rows }
  });
  $_RETURN_DATA_ = await resp.json();
} else {
  $_RETURN_DATA_ = { error: "No rows were found in the uploaded workbook." };
}
```

**XLSX File Download — return a binary spreadsheet**

```javascript
// Generate an XLSX buffer and send it as a download
const rows = [{ column_1: "value_1", column_2: 100 }];
const worksheet = xlsx_style.utils.json_to_sheet(rows);
const workbook  = xlsx_style.utils.book_new();
xlsx_style.utils.book_append_sheet(workbook, worksheet, "Data");

const buffer = xlsx_style.write(workbook, { type: "buffer", bookType: "xlsx" });

$_CUSTOM_HEADERS_ = new Map([
  ["Content-Type",        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["Content-Disposition", 'attachment; filename="report.xlsx"'],
]);
$_RETURN_DATA_ = buffer;
```

**Sending an Email via Application Variable**

The App Var `$_VAR_EMAIL_TRANSPORT` holds the `nodemailer` transporter config. Access it directly in JS code:

```javascript
const transporter = nodemailer.createTransport($_VAR_EMAIL_TRANSPORT);
const info = await transporter.sendMail({
  from:    request.body.from,
  to:      request.body.to,
  subject: request.body.subject,
  html:    request.body.html,
});
$_RETURN_DATA_ = { messageId: info.messageId, accepted: info.accepted };
```

**Orchestration — call multiple internal endpoints and merge results**

```javascript
const urlAccountSummary = "/api/myapp/db/account_summary/auto";
const urlTeamMembers = "/api/myapp/db/team_members/auto";

const uF1 = uFetchAutoEnv.auto(urlAccountSummary, true);
const uF2 = uFetchAutoEnv.auto(urlTeamMembers, true);

const [resp1, resp2] = await Promise.all([
  uF1.get({ data: request.query }),
  uF2.get({ data: request.query }),
]);

const accountSummary = await resp1.json();
const teamMembers = await resp2.json();

$_RETURN_DATA_ = { accountSummary, teamMembers };
```

**Incorrect Example**

```javascript
return { ok: true };
```

The code above may execute, but it is not the supported response contract for this handler. Use `$_RETURN_DATA_` instead.

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
-   **Library drift**: If your script depends on `uFetch` or `uFetchAutoEnv`, verify the current upstream API before copying older snippets from seeds or previous docs.
</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
