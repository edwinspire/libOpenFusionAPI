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

**`custom_data` - Inline config**:
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

**`custom_data` — Application Variable reference** _(recommended for production)_:
Instead of storing credentials in the endpoint, reference an Application Variable by name. The runtime resolves this string to the actual connection config stored in AppVars:
```json
"$_VAR_MAIN_DB"
```
This keeps secrets out of endpoint configuration. Manage AppVars from the application settings panel.

**Note**: Connection details can also be dynamically overridden per request (see "Dynamic Connection" below).

</details>

---

<details>
<summary>🌐 Parameter Binding</summary>

The handler supports two methods for passing parameters from the HTTP request to the SQL query:

1.  **Bind Parameters (`$param`)** _(recommended for MSSQL / T-SQL)_:
    The most common pattern in Microsoft SQL Server. Parameter values from the request are bound by name. Use `$param_name` as the placeholder directly inside `DECLARE` statements to safely receive values and leverage T-SQL type casting.

    **SQL**:
    ```sql
  SET NOCOUNT ON;

  DECLARE
    @account_name NVARCHAR(100) = NULLIF(LTRIM(RTRIM($account_name)), ''),
    @account_id   INT           = TRY_CONVERT(INT, NULLIF(LTRIM(RTRIM($account_id)), ''));

  IF @account_name IS NULL
    THROW 53001, 'The account_name parameter is required.', 1;

  SELECT *
  FROM dbo.accounts
  WHERE account_name = @account_name
    AND account_id = @account_id;
    ```
  **Request (GET)**: `?account_name=acme&account_id=1001`
  **Request (POST body)**: `{"account_name": "acme", "account_id": 1001}`

2.  **Named Replacements (`:param`)**:
    Alternative syntax that works well for simpler inline queries across multiple dialects (MySQL, PostgreSQL, SQLite).

    **SQL**: `SELECT * FROM products WHERE category = :category`
    **Request**: `?category=electronics`

**Payload Structure (POST)**:
Use a `bind` wrapper object in your JSON body if your query expects nested parameter access, though flat bodies are automatically mapped at the top level.

```json
{
  "bind": {
    "account_name": "acme",
    "account_id": 1001
  }
}
```
In the SQL, access with `$account_name` and `$account_id`.

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

**Simple Selection (PostgreSQL / MySQL)**

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

---

**MSSQL — Parameterized Query with Validation**

Endpoint `custom_data`: `"$_VAR_MAIN_DB"`

Endpoint `code`:
```sql
SET NOCOUNT ON;

DECLARE
  @user_name   NVARCHAR(100) = $user_name,
  @account_id  INT           = $account_id;

-- Mandatory parameter validation
IF @user_name IS NULL OR LTRIM(RTRIM(@user_name)) = ''
  THROW 53001, 'The user_name parameter is required.', 1;

IF @account_id IS NULL
  THROW 53002, 'The account_id parameter is required.', 1;

SELECT
  u.user_id,
  u.user_name,
  u.email
FROM [AppDb].[dbo].[users] u WITH (NOLOCK)
INNER JOIN [AppDb].[dbo].[account_users] a WITH (NOLOCK)
  ON u.user_id = a.user_id
WHERE u.user_name = @user_name
  AND a.account_id = @account_id;
```

```bash
curl -X GET "https://your-server.com/api/myapp/endpoint/qa?user_name=alex&account_id=1001"
```

**Response**:
```json
[
  { "user_id": 19, "user_name": "alex", "email": "alex@example.com" }
]
```

---

**MSSQL — UPSERT with Transaction**

Endpoint `custom_data`: `"$_VAR_MAIN_DB"`

Endpoint `code`:
```sql
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRAN;

    DECLARE
        @id        INT            = $id,  -- NULL triggers INSERT
      @name      NVARCHAR(300)  = $name,
      @status    CHAR(1)        = $status,
      @actor     NVARCHAR(100)  = $updated_by;

    IF @id IS NULL
      INSERT INTO [AppDb].[dbo].[entities] (name, status, created_by)
      VALUES (@name, @status, @actor);
    ELSE
      UPDATE [AppDb].[dbo].[entities]
      SET name = @name, status = @status, updated_by = @actor
        WHERE id = @id;

    COMMIT TRAN;
END TRY
BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
END CATCH
```

**POST body**:
```json
{
  "bind": {
    "id": null,
    "name": "Sample Entity",
    "status": "A",
    "updated_by": "system_admin"
  }
}
```

</details>

---

<details>
<summary>MSSQL / T-SQL Best Practices</summary>

When writing T-SQL for production endpoints, these patterns improve correctness and safety:

**Parameter normalization** — strip trailing whitespace and convert empty strings to `NULL`:
```sql
DECLARE
    @text_param  NVARCHAR(100) = NULLIF(LTRIM(RTRIM($text_param)), ''),
    @int_param   INT           = TRY_CONVERT(INT, NULLIF(LTRIM(RTRIM($int_param)), ''));
```

**Mandatory validation with `THROW`** — returns HTTP 500 with the message as `error`:
```sql
IF @text_param IS NULL
  THROW 53001, 'The text_param parameter is required.', 1;
```

**Suppress row counts** to keep JSON output clean:
```sql
SET NOCOUNT ON;
```

**Transactions with automatic rollback on error**:
```sql
SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRAN;
    -- ... DML statements ...
    COMMIT TRAN;
END TRY
BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
END CATCH
```

**`cache_time`** — set on the endpoint (in seconds) to cache the JSON response and avoid repeated identical queries:
- `0` — no cache (default, use for writes and real-time reads)
- `30` – `120` — short-lived cache for frequently-read, rarely-changing data
- `300` – `600` — longer cache for expensive queries on stable master data

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
| Application Variable Reference | ✅ (`"$_VAR_*"` in custom_data) |
| CRUD Operations | ✅ |
| Caching | ✅ (OpenFusion Standard) |

</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
