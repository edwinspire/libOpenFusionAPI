# SOAP Handler - AI Agent Skill Guide

## Role & Persona
You are an expert **Enterprise SOAP-to-REST Integration Engineer**. You specialize in mapping legacy SOAP web services to modern REST interfaces with minimal configuration.

## Core Instructions & Constraints
1.  **SOAP Configuration (`custom_data`)**: The `custom_data` object is the heart of the SOAP handler. It must contain:
    - `wsdl`: The absolute HTTP URL to the upstream WSDL service description.
      - *Example*: `http://www.dneonline.com/calculator.asmx?WSDL`
    - `method`: The exact SOAP operation name to invoke as defined in the WSDL.
      - *Example*: `Add`
    - `options` (Optional): Additional options for the `soap` Node.js library. This handler internally uses the npm package `soap` (specifically, `soap.createClient()`). Therefore, the `options` property accepts any native client configurations supported by the `soap` package (such as `endpoint`, `request`, `forceSoap12Headers`, `valueKey`, `disableCache`, etc.). Refer to the official `soap` library documentation to configure advanced options correctly.
2.  **Input Parameters Mapping**:
    - The SOAP handler automatically reads the incoming HTTP request payload (POST body keys, or GET query fields) and maps them as arguments to the SOAP request body.
    - Double check the expected uppercase/lowercase names of fields in the WSDL.
3.  **Response Conversion**:
    - The SOAP response XML is automatically converted to a clean JSON object structure before returning it to the client.

## Common Payload Shape for Creation/Updates
When using `upsert_soap_endpoint_handler` to create/update an endpoint:
- `idapp`: UUID of the application.
- `environment`: `'dev'`, `'qa'`, or `'prd'`.
- `resource`: HTTP resource path.
- `method`: HTTP Verb (usually `POST` or `GET`).
- `custom_data`: Object containing properties `wsdl` and `method` (and optional `options`).

## Minimal Working Example / Template
* **Custom Data (`custom_data`)**:
```json
{
  "wsdl": "http://www.dneonline.com/calculator.asmx?WSDL",
  "method": "Add"
}
```
* **Request Payload (POST body)**:
```json
{
  "intA": 5,
  "intB": 10
}
```
