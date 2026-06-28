# SQL BULK INSERT Handler – High Performance Data Loading

The **SQL BULK INSERT handler** (`SQL_BULK_I`) is a specialized handler optimized for inserting large volumes of data into a relational database within a single transaction.

---

<details>
<summary>🧠 How It Works</summary>

When an endpoint is configured with the **SQL_BULK_I** handler:
1.  **Configuration**: Reads target table info and DB connection settings.
2.  **Pool Management**: Reuses database connections via an LRU pool (shared mechanism with the standard SQL handler).
3.  **Transaction**: Initiates a database transaction.
4.  **Bulk Operation**: Executes a high-performance `bulkInsert` command (via Sequelize) for the provided array of data rows.
5.  **Commit/Rollback**: Commits the transaction if successful, or rolls back entirely if any error occurs to ensure data integrity.

</details>

---

<details>
<summary>⚙️ Endpoint Configuration</summary>

The configuration must be a valid **JSON object**.

**Required Fields**:
-   `table_name`: Target table (can include schema, e.g., `schema.table`).
-   `config`: Database connection details.
-   `ignoreDuplicates`: (Optional) Boolean to ignore duplicate key errors.

**Example**:
```json
{
  "table_name": "inventory.logs",
  "ignoreDuplicates": true,
  "config": {
    "database": "warehouse_db",
    "username": "writer_svc",
    "password": "secure_password",
    "options": {
      "host": "192.168.1.50",
      "dialect": "postgres"
    }
  }
}
```

</details>

---

<details>
<summary>📥 Data Payload</summary>

The data to insert must be sent in the request (usually `POST` body) as an array under the `data` key.

**Request Body**:
```json
{
  "data": [
    { "id": 1, "item": "Widget A", "qty": 100 },
    { "id": 2, "item": "Widget B", "qty": 50 },
    { "id": 3, "item": "Widget C", "qty": 200 }
  ]
}
```

</details>

---

<details>
<summary>📊 Capability Summary</summary>

| Feature | Supported |
|---|---:|
| Transactional Integrity | ✅ (All or Nothing) |
| Schema Support | ✅ |
| Ignore Duplicates | ✅ |
| Connection Pooling | ✅ |
| High Performance | ✅ (Batch Insert) |

</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
