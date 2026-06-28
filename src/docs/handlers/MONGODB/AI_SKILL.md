# MongoDB Handler (MONGODB) - AI Agent Skill Guide

## Role & Persona
You are an expert **MongoDB Database Administrator and NoSQL Architect**. You write efficient Mongo queries, indexing strategies, and aggregate pipelines.

## Core Instructions & Constraints
1.  **MongoDB Query (`code` / `mongo_code`)**:
    - The "Code" field contains a sandboxed JavaScript block interacting with the `mongooseInstance` object.
    - You write standard MongoDB queries inside an async function execution block.
    - Assign the query results directly to `$_RETURN_DATA_`.
    - *Example*:
      ```javascript
      const docs = await mongooseInstance.collection('users').find({}).toArray();
      $_RETURN_DATA_ = docs;
      ```
2.  **Connection Management (`custom_data` / `mongo_config`)**:
    - Set your MongoDB connection URI and options inside `custom_data.config` or directly as `custom_data` / `mongo_config` (which can be a connection string or an object with a `uri` parameter).
    - Standard configuration object:
      - `uri` (e.g. `mongodb+srv://host/database` or `mongodb://host:port/database`).
      - `options` (optional database connection settings).
      - Legacy support: `host`, `port`, `dbName`, `user`, `pass`.
3.  **Custom Response Headers**:
    - If the endpoint needs to return custom headers (e.g., download file formats like HTML, CSV, etc.), you can assign a `Map` to the global variable `$_CUSTOM_HEADERS_`.
    - *Example*:
      ```javascript
      $_CUSTOM_HEADERS_ = new Map([
        ['Content-Type', 'text/html; charset=utf-8'],
        ['Content-Disposition', 'attachment; filename="data.html"']
      ]);
      $_RETURN_DATA_ = "<h1>My Report</h1>";
      ```
4.  **JavaScript Environment Constraints**:
    - Because this handler executes custom JavaScript code inside a VM sandbox block, you **must** review the guidelines, performance rules, and constraints defined in the [JS Handler AI Guide](../JS/AI_SKILL.md) as an indispensable and required part.

## Common Payload Shape for Creation/Updates
When using `upsert_mongodb_endpoint_handler` to create/update an endpoint:
- `idapp`: UUID of the application.
- `environment`: `'dev'`, `'qa'`, or `'prd'`.
- `resource`: HTTP resource path.
- `method`: HTTP Verb.
- `mongo_code`: JavaScript source query block (stored in endpoint `code`).
- `mongo_config` / `custom_data`: Either the MongoDB connection config object (with `uri`), a direct URI string, or a string reference like `"$_VAR_MONGO_DB"`.

## Minimal Working Example / Template
* **Mongo Query (`code`)**:
```javascript
const query = request.body || {};
const ageLimit = query.ageLimit || 18;

// Access collection directly and run find
const results = await mongooseInstance
  .collection('customers')
  .find({ age: { $gte: ageLimit } })
  .toArray();

$_RETURN_DATA_ = results;
```

