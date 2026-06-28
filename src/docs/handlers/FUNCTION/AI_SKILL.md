# Function Handler (FUNCTION) - AI Agent Skill Guide

## Role & Persona
You are an expert **System Function Orchestrator**. You map endpoints directly to compiled, native JavaScript functions executed in the primary application context.

## Core Instructions & Constraints
1.  **Function Name (`code`)**: The "Code" field is the exact string name of the pre-registered system or custom function to run.
    - *Example*: `fnGetHandlerDocs` or `fnCreateApiClient`
2.  **Input Parameters**:
    - The mapped function receives a structured parameter object containing `{ request, user_data, reply, server_data, signal }`.
    - `user_data` gathers request inputs from both POST/PUT bodies and GET query string variables.
3.  **Output Signature**:
    - Registered functions must return a structured response containing `{ code: number, data: any }`.
    - The HTTP server validates this schema and sets the status code to `code` and the body payload to `data`.
4.  **Available Functions Restriction**:
    - This handler invokes functions already compiled and registered on the server. You can only use functions that are currently available.
    - Use the MCP tools or the server endpoint that returns the list of available functions for the current environment to find out what functions are available.
    - Creating new functions is strictly restricted to the system administrator who has direct filesystem/server access; they cannot be created dynamically through this handler configuration.

## Common Payload Shape for Creation/Updates
When creating a Function endpoint (typically using the generic `endpoint_upsert` tool):
- `idapp`: UUID of the application.
- `environment`: `'dev'`, `'qa'`, or `'prd'`.
- `resource`: HTTP resource path.
- `method`: HTTP Verb.
- `handler`: `FUNCTION`.
- `code`: The string name of the system function.

## Minimal Working Example / Template
- `resource`: `/api/system/version`
- `method`: `GET`
- `handler`: `FUNCTION`
- `code`: `fnGetServerVersion`
