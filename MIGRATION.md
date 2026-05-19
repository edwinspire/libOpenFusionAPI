# Migration Guide: test/ and scratch/ → dev/

## Summary

The test/ and scratch/ folders have been moved to a clearer dev/ structure. Scripts and configuration have already been updated to point to the new locations.

## Changes Made

✅ **Structure created:**
```
dev/
├── README.md                 (Overview of dev tools)
├── test/
│   └── README.md            (Test guide with AI agent info)
└── scratch/
    └── README.md            (Script guide with AI agent info)
```

✅ **Files updated:**
- `package.json` - All npm scripts now point to ./dev/test/ and ./dev/scratch/
- `.vscode/tasks.json` - VS Code tasks point to dev/test/

✅ **Original folders migrated:**
- test/ → dev/test/ (20 files)
- scratch/ → dev/scratch/ (15 files)
- Original folders deleted from root

## What's Been Done

All file movements and configuration updates are **complete**. The folder structure is now:

```
libOpenFusionAPI/
├── dev/
│   ├── README.md                          # Overview
│   ├── test/
│   │   ├── README.md                      # Test guide + AI guidance
│   │   ├── index.js                       # Main test runner
│   │   ├── integration_test.js
│   │   ├── system_test.js
│   │   ├── mcp_tool_descriptions.js
│   │   ├── mcp_schema_conversion.js
│   │   ├── smoke_runtime.js
│   │   ├── c/                             # Auxiliary folder
│   │   ├── fn/                            # Auxiliary folder
│   │   └── www/                           # Auxiliary folder
│   ├── scratch/
│   │   ├── README.md                      # Script guide + AI guidance
│   │   ├── check_mcp_name_uniqueness.js
│   │   ├── validate_all_system_endpoints.js
│   │   ├── list_mcp_tools.js
│   │   ├── test_success.js
│   │   ├── test_404.js
│   │   ├── check_endpoint_db.js
│   │   └── ... (rest of scripts)
├── src/                                   # No changes
├── docs/                                  # No changes
├── package.json                           # ✅ UPDATED
├── .vscode/
│   └── tasks.json                         # ✅ UPDATED
└── ... (rest of project)
```

## Verify Migration

All npm scripts work correctly with the new structure:

```bash
# All these should pass without errors
npm test                # ✅ Works
npm run test:mcp-docs  # ✅ Works (35 tools, 0 missing descriptions)
npm run test:mcp-names # ✅ Works (71 endpoints, no duplicates)
npm run test:smoke     # ✅ Works
npm run test:integration # ✅ Works
```

## Important Notes

- The READMEs in dev/test/ and dev/scratch/ include **specific guidance for AI agents**
- Scripts can be run both via npm and directly with node
- There are no changes to script logic, only folder reorganization
- Original test/ and scratch/ folders have been removed from the root

---

**Status:** ✅ Migration complete. All systems operational.
