# Development & Debugging Tools

This folder contains development, testing, and debugging tools for libOpenFusionAPI. It is organized into two subfolders:

## Structure

- **[test/](./test/)** - Automated test suite and MCP validators
- **[scratch/](./scratch/)** - Ad-hoc diagnostic and debugging scripts

## When to use each folder

### test/
Use this folder for:
- Automated system validations
- Tests that run as part of CI/CD
- MCP compatibility verification
- Integration testing

### scratch/
Use this folder for:
- Point-in-time problem diagnosis
- Quick validation of changes
- Debugging scripts that are not part of the standard flow
- Investigation of specific issues

## For AI Agents

**How to run tests from scripts:**
```bash
npm test                  # Complete suite
npm run test:mcp-docs    # Validates MCP tool descriptions
npm run test:mcp-names   # Detects MCP name collisions
npm run test:smoke       # Runtime smoke test
npm run test:integration # Integration tests
```

**How to run scratch scripts directly:**
```bash
node ./dev/scratch/check_mcp_name_uniqueness.js [args]
node ./dev/scratch/validate_all_system_endpoints.js [args]
node ./dev/scratch/list_mcp_tools.js [args]
```

**Decision criteria:**
- If you need quick endpoint validation → use scratch/
- If you need confirmation the system works → use npm test
- If you need to validate MCP tools specifically → use test/mcp_tool_descriptions.js

## Expected file structure

```
dev/
├── test/
│   ├── index.js                      # Main test runner
│   ├── integration_test.js           # Integration tests
│   ├── mcp_tool_descriptions.js      # MCP tools validator
│   ├── mcp_schema_conversion.js      # Schema conversion validator
│   └── smoke_runtime.js              # Quick runtime tests
├── scratch/
│   ├── check_mcp_name_uniqueness.js
│   ├── validate_all_system_endpoints.js
│   ├── list_mcp_tools.js
│   ├── test_success.js
│   └── ... (more diagnostic scripts)
├── README.md                         # This file
```

## Notes

- These files and folders are **for development/debugging only**
- Not included in production builds
- Test scripts may require an active OpenFusion server
- Some scripts may require MCP credentials (check file comments)
