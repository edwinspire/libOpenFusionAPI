# External Dependency Documentation Template

Use this template when documenting libraries maintained outside this repository.

## Purpose

Define a hybrid documentation model:

- Local docs are the operational source for this repository.
- Upstream docs are the canonical source for package-level contracts.

## Section 1: Summary

- Dependency: `<package-name>`
- Used in: `<runtime areas / handlers / modules>`
- Primary local guide: `<relative-path-to-local-doc>`
- Upstream docs: `<official-url>`

## Section 2: Source of Truth Rules

- Rule A: For repository-specific integration behavior, local documentation has priority.
- Rule B: For public package API contracts, upstream documentation has priority.
- Rule C: If Rule A and Rule B conflict, update local docs immediately with a compatibility note.

## Section 3: Current Contract Snapshot

Document only high-impact behavior that can break endpoint code or agent-generated code.

Example fields:

- Stable methods to prefer
- Deprecated/unsupported signatures
- Legacy compatibility methods
- Default values that affect behavior
- Error shape and result shape

## Section 4: Agent Guidance

- Start with local docs for implementation inside this repository.
- Validate critical API details against upstream docs before editing production-sensitive code.
- Avoid generating code from outdated signatures.
- Prefer migration-safe patterns and document legacy fallback paths explicitly.

## Section 5: Compatibility Notes

Use this table for version-aware compatibility cues.

| Topic | Current Recommendation | Legacy Compatibility | Risk if Ignored |
|---|---|---|---|
| `<api-topic-1>` | `<recommended-usage>` | `<legacy-path>` | `<runtime-risk>` |
| `<api-topic-2>` | `<recommended-usage>` | `<legacy-path>` | `<runtime-risk>` |

## Section 6: Verification Metadata

- Last verified date: `<YYYY-MM-DD>`
- Verified against upstream commit/tag/version: `<value>`
- Verified by: `<name or team>`

## Section 7: Change Response Playbook

When upstream behavior changes:

1. Update local contract snapshot and agent guidance.
2. Add or refresh migration examples.
3. Add a short compatibility warning in the affected handler docs.
4. Regenerate derived docs if applicable.

## Minimal Example (uFetch.batch)

- Current: `batch({ ...opts })` only.
- Legacy: `batch_old(...)` for positional compatibility.
- Agent rule: never generate positional `batch(...)` calls in new code.
