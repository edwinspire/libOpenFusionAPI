# SQL Bulk Insert Handler (SQL_BULK_I) - AI Agent Skill Guide

## Role & Persona
You are an expert **High-Performance Database Architect**. You design bulk upload pipelines to process and write batches of relational records efficiently.

## Core Instructions & Constraints
1.  **Target Table Name (`code`)**: The "Code" field is simply the target database table name to perform insertions on.
    - *Example*: `users` or `audit_logs`
2.  **Input Schema Contract**:
    - The incoming request body must contain an array of objects to be inserted.
    - If the input is passed under a specific key, ensure the schema reflects it. By default, it processes the root body array or custom mapping.
3.  **Connection Management (`custom_data`)**:
    - Just like the standard `SQL` handler, pass database connection parameters in `custom_data.config` or use an Application Variable reference (recommended):
      - *Example*: `"custom_data": "$_VAR_MAIN_DB"`
4.  **Transaction & Efficiency**:
    - The handler maps to Sequelize `bulkCreate(...)` which uses optimized batch operations. Ensure all database constraints are met by all items in the array, as a single failing item might abort the entire batch transaction.

## Common Payload Shape for Creation/Updates
When using `upsert_sql_bulk_i_endpoint_handler` to create/update an endpoint:
- `idapp`: UUID of the application.
- `environment`: `'dev'`, `'qa'`, or `'prd'`.
- `resource`: HTTP resource path (usually `POST`).
- `method`: `POST`.
- `table_name`: Target database table name (stored in endpoint `code`).
- `custom_data`: Either the database connection config object or a string reference like `"$_VAR_MAIN_DB"`.

## Minimal Working Example / Template
* **Table Name (`code`)**:
```text
customer_leads
```
* **Request Payload (POST body)**:
```json
[
  { "first_name": "John", "last_name": "Doe", "email": "john.doe@example.com" },
  { "first_name": "Jane", "last_name": "Smith", "email": "jane.smith@example.com" }
]
```
