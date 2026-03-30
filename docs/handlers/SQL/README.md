# SQL Handler – Universal Database Connector

The **SQL handler** allows OpenFusionAPI to execute SQL queries against various relational databases (MySQL, PostgreSQL, MSSQL, SQLite, etc.) using the Sequelize ORM.

---

<details>
<summary>🧠 How It Works</summary>

When an endpoint is configured with the **SQL** handler:
1.  **Configuration**: It reads the SQL query from the endpoint `code` and the database connection settings from `custom_data`.
2.  **Connection Pooling**: It uses an internal Least Recently Used (LRU) mechanism to manage and reuse database connection pools, ensuring high performance and resource efficiency (limit: 50 active pools).
3.  **Binding**: It safely binds parameters from the HTTP request (GET query params or POST body) to the SQL query to prevent SQL Injection.
4.  **Execution**: The query is executed via Sequelize.
5.  **Response**: The result set is returned as a JSON object/array.

</details>

---

<details>
<summary>⚙️ Endpoint Configuration</summary>

For this handler:
-   `code` stores the SQL query string.
-   `custom_data` stores the database connection settings and optional SQL execution metadata.

**`code` example**:
```sql
SELECT * FROM users WHERE id = :id
```

**`custom_data` example**:
```json
{
  "config": {
    "database": "my_db",
    "username": "db_user",
    "password": "db_password",
    "options": {
      "host": "localhost",
      "port": 5432,
      "dialect": "postgres"
    }
  },
  "query_type": "SELECT"
}
```

**Note**: Connection details can be dynamically merged from the request (see "Dynamic Connection" below) or stored in Application Variables. Avoid wrapping both `config` and `query` together inside `code` for new integrations.

</details>

---

<details>
<summary>🌐 Parameter Binding</summary>

The handler supports two methods for passing parameters from the HTTP request to the SQL query:

1.  **Named Replacements (`:param`)**:
    Preferred for clarity. Keys in the request body (POST) or query string (GET) map directly to `:key` in the SQL.

    **SQL**: `SELECT * FROM products WHERE category = :category`
    **Request**: `?category=electronics`

2.  **Bind Parameters (`$param`)**:
    Alternative binding syntax supported by some dialects.

**Payload Structure (POST)**:
Use `bind` or `replacements` objects in your JSON body to be explicit, though flattened bodies are often automatically mapped.

</details>

---

<details>
<summary>🔌 Dynamic Connection</summary>

You can override or provide connection details at runtime by sending a `connection` object in the request body (POST only). This is useful for multi-tenant applications connecting to different databases based on the user context.

**Request Body**:
```json
{
  "connection": {
    "database": "tenant_123",
    "username": "custom_user",
    "password": "custom_password"
  },
  "bind": {
    "id": 50
  }
}
```

</details>

---

<details>
<summary>📤 Example Requests</summary>

**Simple Selection**

Endpoint `code`: `SELECT * FROM customers WHERE country = :country`

Endpoint `custom_data`:

```json
{
  "config": {
    "database": "crm",
    "username": "readonly",
    "password": "secret",
    "options": {
      "host": "db.internal",
      "port": 5432,
      "dialect": "postgres"
    }
  },
  "query_type": "SELECT"
}
```

```bash
curl -X GET "https://your-server.com/api/sql/customers?country=USA"
```

**Response**:
```json
[
  { "id": 1, "name": "Acme Corp", "country": "USA" },
  { "id": 2, "name": "Globex", "country": "USA" }
]
```

</details>

---

<details>
<summary>📊 Capability Summary</summary>

| Feature | Supported |
|---|---:|
| Multiple Dialects (PG, MySQL, MSSQL) | ✅ (Sequelize) |
| Connection Pooling | ✅ (LRU Cache) |
| Parameter Binding | ✅ (Replacements/Bind) |
| Dynamic Connections | ✅ (Per-request override) |
| CRUD Operations | ✅ |
| Caching | ✅ (OpenFusion Standard) |

</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
