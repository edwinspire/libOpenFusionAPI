# libOpenFusionAPI - Scratch Script Documentation

## Purpose
The scratch scripts in the `dev/scratch/` directory are utility scripts for testing, debugging, and prototyping. They allow direct interaction with libOpenFusctory) | Contains all scratch scripts |
| `scratch/mcp_candidates_report.js` | Generate MCP candidate report from database |
| `scratch/mcp_candidates_report.cjs` | Generate MCP candidate report (CommonJS) |
| `scratch/agent_debug.js` | Debug AI Agent task execution and context |
| `scratch/agent_debug.cjs` | Debug AI Agent (CommonJS) |
| `scratch/agent_run_in_terminal.js` | Run an AI Agent task in a live terminal session |
| `scratch/agent_run_in_terminal.cjs` | Run AI Agent in terminal (CommonJS) |
| `scratch/agent_run_in_terminal_async.js` | Run AI Agent task asynchronously |
| `scratch/agent_run_i` | Run AI Agent in terminal (Co sync+async (CommonJS) |
| `scratch/agent_run_in_terminal_sync_async.cjs` | Run un a scratch script** (in the libOpenFusionAPI root): `node dev//agent_run_in_te For AI Agents
The scratch scripts provide direct access to AI Agent capabilities, including task execution, context inspection, and live termin `.js` (ESM) and `.cjs` (CommonJS) variant. The `.js` files use `import/export` syntax and run with Node.js ESM module loader, while `.cjs` files use `require()` and `module.exports` with the CommonJS loader. Both variants are functionally dev/scratch/agenhe scratch scripts provide direct access to AI Agent capabilities, including task execution, context inspection,gent_debug*` scripts expose agent state and execS) variant. The `.js` files use `import/export` syntax and run with Node.js ESM module loader, while `.cjs` files use `require()` and `module.exports` with the CommonJS loader. Both variants are functionally equivalent and pass the same test results.

