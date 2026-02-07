# JS Handler API Reference

> Auto-generated documentation for the JavaScript Handler environment.

## Table of Contents

- [\$_CUSTOM_HEADERS_](#_custom_headers_)
- [\$_EXCEPTION_](#_exception_)
- [\$_RETURN_DATA_](#_return_data_)
- [createImageFromHTML](#createimagefromhtml)
- [createPDFFromHTML](#createpdffromhtml)
- [crypto](#crypto)
- [dnsPromises](#dnspromises)
- [forge](#forge)
- [json_to_xlsx_buffer](#json_to_xlsx_buffer)
- [jwt](#jwt)
- [luxon](#luxon)
- [mongoose](#mongoose)
- [nodemailer](#nodemailer)
- [ofapi](#ofapi)
- [openai](#openai)
- [pdfjs](#pdfjs)
- [reply](#reply)
- [request](#request)
- [request_xlsx_body_to_json](#request_xlsx_body_to_json)
- [sequelize](#sequelize)
- [sequentialPromises](#sequentialpromises)
- [uFetch](#ufetch)
- [uFetchAutoEnv](#ufetchautoenv)
- [uuid](#uuid)
- [xlsx](#xlsx)
- [xml2js](#xml2js)
- [xmlCrypto](#xmlcrypto)
- [xmlFormatter](#xmlformatter)
- [xmldom](#xmldom)
- [z](#z)

---

### `$_CUSTOM_HEADERS_`

[External Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 

Custom headers to send in the reply.

*   Returns: Map object

---

### `$_EXCEPTION_(message, [data], [statusCode])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Interrupts the program flow and throws an exception with a specific message and status code.

*   `message` <string> The error message to display.
*   `data` <any> **Optional**. Additional context data for the error.
*   `statusCode` <integer> **Optional**. Default: `500`. HTTP Status Code for the response.

*   Returns: <void> Throws an exception object that stops execution.

    **Result Structure:**

    *   `message` <string> The error message.
    *   `data` <any> Context data.
    *   `statusCode` <integer> HTTP Status Code.

#### Example

```javascript
// simple usage
$_EXCEPTION_("Invalid input parameter");

// with data and status code
$_EXCEPTION_("User not found", { userId: 123 }, 404);
```

---

### `$_RETURN_DATA_`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Value or object that will be returned by the endpoint.

*   Returns: data and headers

---

### `createImageFromHTML([html], [url], [type], [quality], [fullPage])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Create a Image from HTML code or URL

*   `html` <string> **Optional**. String HTML
*   `url` <string> **Optional**. URL resource
*   `type` <string> **Optional**. Default: `png`. Output type
*   `quality` <integer> **Optional**. Default: `90`. quality
*   `fullPage` <boolean> **Optional**. Default: `true`. fullPage

*   Returns: NodeJS.ArrayBufferView

---

### `createPDFFromHTML([html], [url], [format], [landscape], [margin], [printBackground])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Generates a PDF document from an HTML string or a URL.

*   `html` <string> **Optional**. Raw HTML content to render.
*   `url` <string> **Optional**. URL of the page to convert to PDF.
*   `format` <string> **Optional**. Default: `A4`. Paper format (e.g., 'A4', 'Letter').
*   `landscape` <boolean> **Optional**. Whether to print in landscape mode.
*   `margin` <string> **Optional**. Default: `10mm`. Page margins (e.g., '10mm').
*   `printBackground` <boolean> **Optional**. Default: `true`. Whether to print background graphics.

*   Returns: <NodeJS.ArrayBufferView> Buffer containing the generated PDF.

---

### `crypto`

[External Documentation](https://nodejs.org/api/crypto.html) 

Node.js crypto module

---

### `dnsPromises`

The DNS module enables name resolution functions. It contains methods for performing DNS queries of various types, as well as utility functions for converting between IP addresses in text and binary forms.

---

### `forge`

[External Documentation](https://github.com/digitalbazaar/forge) 

A native implementation of TLS (and various other cryptographic tools) in JavaScript.

*   Returns: Read documentation

---

### `json_to_xlsx_buffer([data])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Converts an array of JSON objects to an XLSX buffer. Each object represents a sheet with its data.

*   `data` <object> **Optional**. An object with the filename and an array of sheets. Each sheet is an object with a name and data. { filename: 'file', sheets: [{ sheet: Sheet1', data: [] }] }

*   Returns: Buffer with the XLSX file content and ContentType

---

### `jwt`

[External Documentation](https://github.com/auth0/node-jsonwebtoken) 

An implementation of JSON Web Tokens.

---

### `luxon`

[External Documentation](https://moment.github.io/luxon) 

Friendly wrapper for JavaScript dates and times

---

### `mongoose`

[External Documentation](https://mongoosejs.com) 

 Mongoose provides a straight-forward, schema-based solution to model your MongoDB.

---

### `nodemailer`

[External Documentation](https://nodemailer.com/) 

Nodemailer makes sending email from a Node.js application straightforward and secure, without pulling in a single runtime dependency.

---

### `ofapi`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Utilities and services of OpenFusionAPI. Contains server info, token generator, and exception thrower.

*   Returns: Any funtions or objects

---

### `openai`

[External Documentation](https://github.com/openai/openai-node) 

This library provides convenient access to the OpenAI REST API from TypeScript or JavaScript.

*   Returns: Any funtions or objects

---

### `pdfjs`

[External Documentation](https://mozilla.github.io/pdf.js/) 

PDF.js is a Portable Document Format (PDF) viewer that is built with HTML5.

---

### `reply`

[External Documentation](https://fastify.dev/docs/latest/Reference/Reply/#introduction) 

Fastify Reply. Is the object used to send a response to the client.

---

### `request`

[External Documentation](https://fastify.dev/docs/latest/Reference/Request/) 

Fastify Request. Stores all information about the request

---

### `request_xlsx_body_to_json`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Converts the body of a request to a JSON object. It supports multipart/form-data with Excel files.

*   Returns: Array of objects with the data of each sheet of each Excel file.

---

### `sequelize`

[External Documentation](https://sequelize.org/) 

Sequelize is a modern TypeScript and Node.js ORM for Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more.

---

### `sequentialPromises`

[External Documentation](https://github.com/edwinspire/sequential-promises) 

PromiseSequence class. More information at sequential-promises.

---

### `uFetch`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Instance of the uFetch class. More information at universal-fetch

---

### `uFetchAutoEnv`

[External Documentation](https://github.com/edwinspire/universal-fetch) 

Create an instance of uFetch. The "auto" method receives the URL as a parameter; if this URL ends in "auto", this function will automatically replace it with the environment in which it is running.

---

### `uuid`

[External Documentation](https://www.npmjs.com/package/uuid) 

UUID package to generate RFC4122 UUIDs.

---

### `xlsx`

[External Documentation](https://docs.sheetjs.com/docs/) 

SheetJS Community Edition offers battle-tested open-source solutions for extracting useful data from almost any complex spreadsheet and generating new spreadsheets that will work with legacy and modern software alike.

---

### `xml2js`

[External Documentation](https://github.com/Leonidas-from-XIV/node-xml2js) 

Simple XML to JavaScript object converter. It supports bi-directional conversion.

*   Returns: Read documentation

---

### `xmlCrypto`

[External Documentation](https://github.com/node-saml/xml-crypto) 

It is a Node.js package that allows working with XML digital signatures, facilitating the signing and verification of XML documents using the XML Signature specification, ideal for applications that handle security and data validation in this format, using private and public keys.

*   Returns: Read documentation

---

### `xmlFormatter`

[External Documentation](https://github.com/chrisbottin/xml-formatter) 

Read documentationConverts XML into a human readable format (pretty print) while respecting the xml:space attribute. Reciprocally, the xml-formatter package can minify pretty printed XML.

---

### `xmldom`

[External Documentation](https://github.com/xmldom/xmldom) 

A JavaScript implementation of W3C DOM for Node.js, Rhino and the browser. Fully compatible with W3C DOM level2; and some compatible with level3.

*   Returns: Read documentation

---

### `z`

[External Documentation](https://zod.dev/?id=introduction) 

Zod is a TypeScript-first schema declaration and validation library. 

---

