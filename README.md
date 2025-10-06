# 🚀 **OpenFusionAPI – Handlers Overview**

Welcome to **OpenFusionAPI Handlers Documentation**, a comprehensive reference designed for developers who want to extend, connect, and automate systems efficiently.  
Each *handler* in OpenFusionAPI is a modular execution layer that provides specific functionality — from database access to SOAP integrations, AI tool serving (MCP), and more.  
Use this page as the main entry point to explore each handler and understand its capabilities and practical uses.

---

## 🧩 **Handlers List (A–Z)**

<details>
<summary>⚙️ **FETCH Handler**</summary>

**Purpose:**  
Executes HTTP requests to external APIs or services.

**Use Case:**  
Ideal for consuming REST APIs, internal microservices, or external data providers returning JSON, XML, or text.

**Key Features:**  
- Supports all HTTP methods (GET, POST, PUT, DELETE, etc.)  
- Allows custom headers and query parameters  
- Integrated caching and logging  
- Can be combined with other handlers for data pipelines  
</details>

---

<details>
<summary>💡 **JAVASCRIPT Handler**</summary>

**Purpose:**  
Executes JavaScript logic directly inside OpenFusionAPI.

**Use Case:**  
Perfect for dynamic data transformation, validation, or building advanced flow control without modifying backend code.

**Key Features:**  
- Built-in JavaScript editor  
- Supports isolated execution contexts  
- Can invoke other endpoints programmatically  
- Includes internal helper libraries  
</details>

---

<details>
<summary>🌐 **MCP Handler (Model Context Protocol)**</summary>

**Purpose:**  
Creates an MCP server that exposes OpenFusionAPI endpoints as AI-accessible tools through the Model Context Protocol.

**Use Case:**  
Enables AI assistants and automation systems to interact with your APIs naturally.

**Key Features:**  
- Uses `@modelcontextprotocol/sdk` internally  
- Detects all MCP-enabled endpoints automatically  
- Returns MCP-standard metadata responses  
- Compatible with MCP clients such as *Inspector* and others  
</details>

---

<details>
<summary>🍃 **MONGODB Handler**</summary>

**Purpose:**  
Provides connectivity to MongoDB databases using the Mongoose library.

**Use Case:**  
Integrates OpenFusionAPI endpoints with MongoDB collections for CRUD operations.

**Key Features:**  
- Connection via inline or environment variables  
- Uses the same caching and logging system as other handlers  
- Executes custom logic via embedded JavaScript  
- Opens and closes the connection automatically per request  
</details>

---

<details>
<summary>🧮 **SAP HANA Handler**</summary>

**Purpose:**  
Executes SQL commands on SAP HANA databases.

**Use Case:**  
Bridges enterprise SAP environments with web APIs or automation tools.

**Key Features:**  
- Full SQL support for SAP HANA  
- Parameterized authentication and connection settings  
- Returns data as JSON  
- Handles caching, logging, and error control consistently  
</details>

---

<details>
<summary>🧱 **SOAP Handler**</summary>

**Purpose:**  
Handles SOAP-based services and WSDL integration.

**Use Case:**  
Perfect for enterprise or legacy system integrations requiring SOAP communication.

**Key Features:**  
- Parameterized authentication for SOAP requests  
- Auto-generates clients based on WSDL  
- Returns results as JSON  
- Fully compatible with fastify and Node.js standards  
</details>

---

<details>
<summary>💾 **SQL Handler**</summary>

**Purpose:**  
Executes standard SQL operations across supported databases via Sequelize.

**Use Case:**  
Ideal for CRUD operations, analytics, and reporting endpoints.

**Key Features:**  
- Compatible with MySQL, PostgreSQL, MSSQL, SQLite  
- Accepts dynamic queries and parameters  
- Returns query results in JSON format  
- Includes caching and unified logging  
</details>

---

<details>
<summary>📦 **SQL BULK INSERT Handler**</summary>

**Purpose:**  
Performs efficient bulk insert operations on supported SQL databases.

**Use Case:**  
Used for high-performance data imports or synchronization.

**Key Features:**  
- Requires table name and data array in JSON  
- Ignores non-existing fields automatically  
- Returns number of inserted rows  
- May lock the table depending on the database engine  
</details>

---

<details>
<summary>🧾 **TEXT Handler**</summary>

**Purpose:**  
Delivers static text or files via HTTP responses.

**Use Case:**  
Best suited for serving static data, help content, or configuration scripts.

**Key Features:**  
- Supports multiple MIME types  
- Fully configurable content source  
- Optional caching in seconds  
- Lightweight and efficient  
</details>

---

## 🧠 **Why Handlers Matter**

Handlers are the foundation of **OpenFusionAPI**, providing modular logic to manage different integration and execution scenarios efficiently.  
They abstract complexity and allow developers to focus on orchestration rather than infrastructure.

---

## ⚙️ **Recommended Usage**

| Handler | Ideal For | Main Benefit |
|----------|------------|--------------|
| **FETCH** | REST APIs | Flexible data integration |
| **JAVASCRIPT** | Logic and transformation | Execute custom logic inline |
| **MCP** | AI integration | Expose APIs as AI tools |
| **MONGODB** | NoSQL storage | Simplified database access |
| **SAP HANA** | SAP data | Enterprise-grade integration |
| **SOAP** | Legacy systems | SOAP → JSON conversion |
| **SQL** | Relational databases | Query and reporting |
| **SQL BULK INSERT** | Data ingestion | Efficient mass insertions |
| **TEXT** | Static content | Lightweight responses |

---

## 🧭 **Next Steps**

Explore each handler’s dedicated documentation to configure connections, define caching strategies, and learn best practices.  
> 💡 **Pro Tip:** Combine multiple handlers — for instance, use **FETCH** to retrieve data, **JAVASCRIPT** to process it, and **SQL** to store it.

