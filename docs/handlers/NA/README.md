# NA Handler – Internal Default / No-op

The **NA** handler is an internal placeholder used by OpenFusionAPI when an endpoint has no effective handler assigned.

---

<details>
<summary>🧠 Purpose</summary>

-   Preserve backward compatibility with legacy records.
-   Represent "not configured yet" states safely.
-   Avoid accidental execution of incomplete endpoints.

</details>

---

<details>
<summary>⚙️ Behavior</summary>

-   It is **not intended** for business logic.
-   It should be treated as a **no-op / invalid runtime target**.
-   Requests to endpoints configured with `NA` are expected to fail fast until a real handler is selected.

</details>

---

<details>
<summary>✅ Recommended Usage</summary>

-   Use only as a transitional/default value in metadata.
-   Migrate endpoints from `NA` to a concrete handler (`JS`, `FUNCTION`, `FETCH`, `SQL`, etc.) before exposing them.

</details>

---

<details>
<summary>🚫 Do Not Use For</summary>

-   Production endpoint execution.
-   Integrations that require deterministic responses.
-   Public MCP tools.

</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**