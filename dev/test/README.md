# libOpenFusionAPI - Test Suite Documentation

## Purpose
The test suite for libOpenFusionAPI provides a comprehensive set of unit and integration tests covering all core modules, endpoints, and data structures. It ensures API contract integrity, data consistency, and error handling across all supported database backends.

## Files and Scripts
| File | Purpose |
|---|---|
| `test/` (directory) | Contains all test modules and fixtures |
| `test/mcp_names.test.js` | MCP name resolution and lookup tests |
| `test/mcp_names.test.cjs` | MCP name resolution tests (CommonJS) |
| `test/endpoints.test.js` | API endpoint coverage and response validation |
| `test/endpoints.test.cjs` | API endpoint tests (CommonJS) |
| `test/db.test.js` | Database connectivity and query tests |
| `test/db.test.cjs` | Database tests (CommonJS) |
| `test/agent.test.js` | AI Agent interaction and task routing tests |
| `test/agent.test.cjs` | AI Agent tests (CommonJS) |
| `test/utils.test.js` | Utility function tests (e.g., string parsing, date handling) |
| `test/utils.test.cjs` | Utility tests (CommonJS) |
| `test/fixture/` (dir) | Test data fixtures for all modules |

## How to Run
1. **Install dependencies** (in the libOpenFusionAPI root): `npm install`
2. **Run tests** (in the libOpenFusionAPI root): `npm test` or `npm run test`
3. **Run specific test file** (in the libOpenFusionAPI root): `node test/...test.js` or `node test/...test.cjs`

## Usage Examples
- Test MCP name resolution: `node test/mcp_names.test.js`
- Test API endpoints: `node test/endpoints.test.js`
- Test database connectivity: `node test/db.test.js`
- Test AI Agent task routing: `node test/agent.test.js`

## For AI Agents
The test suite validates how AI Agents interact with the API, including task routing, context handling, and response formatting. Tests cover agent initialization, task submission, step execution, and final output.

## Differences Between JS and CJS
All test files have both a `.js` (ESM) and `.cjs` (CommonJS) variant. The `.js` files use `import/export` syntax and run with Node.js ESM module loader, while `.cjs` files use `require()` and `module.exports` with the CommonJS loader. Both variants are functionally equivalent and pass the same test results.

