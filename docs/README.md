# Open Fusion API

## Documentation Notes

- Handler docs index: see [handlers/README.md](handlers/README.md).
- SQL scope: [handlers/SQL/README.md](handlers/SQL/README.md) documents the generic relational handler that runs through Sequelize.
- HANA scope: [handlers/HANA/README.md](handlers/HANA/README.md) documents the dedicated SAP HANA handler that uses `@sap/hana-client`.
- Cross-engine caution: behavior validated for MSSQL / T-SQL should not be assumed on PostgreSQL, MySQL, MariaDB, SQLite, or HANA without testing on that engine.