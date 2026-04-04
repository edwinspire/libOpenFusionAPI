# JS Handler API Reference

> Auto-generated documentation for the JavaScript Handler environment.

## Table of Contents

- [\$_CUSTOM_HEADERS_](#_custom_headers_)
- [\$_EXCEPTION_](#_exception_)
- [\$_RETURN_DATA_](#_return_data_)
- [OpenAI](#openai)
- [PromiseSequence](#promisesequence)
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
- [pdfjs](#pdfjs)
- [reply](#reply)
- [request](#request)
- [request_xlsx_body_to_json](#request_xlsx_body_to_json)
- [sequelize](#sequelize)
- [uFetch](#ufetch)
- [uFetchAutoEnv](#ufetchautoenv)
- [uuid](#uuid)
- [xlsx](#xlsx)
- [xlsx_style](#xlsx_style)
- [xml2js](#xml2js)
- [xmlCrypto](#xmlcrypto)
- [xmlFormatter](#xmlformatter)
- [xmldom](#xmldom)
- [z](#z)

---

### `$_CUSTOM_HEADERS_`

[External Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 

Map of custom response headers to send together with $_RETURN_DATA_.

**Notes**

- Useful for downloads, custom content types, caching headers, and content disposition.

**Agent Guidance**

- Set headers here before assigning binary or special response payloads to $_RETURN_DATA_.

*   Returns: Map object with custom headers

#### Example

```javascript

$_CUSTOM_HEADERS_.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.xlsx"',
);
      
```

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

Primary output slot for JS handlers. Assign the final payload here instead of using return.

**Notes**

- This is the supported JS handler response contract.

**Agent Guidance**

- Prefer assigning to $_RETURN_DATA_ over calling reply.send() directly unless you need low-level Fastify control.

*   Returns: Any values

#### Example

```javascript

$_RETURN_DATA_ = { name: 'John', age: 30 };
      
```

---

### `OpenAI`

[External Documentation](https://github.com/openai/openai-node) 

Official OpenAI SDK for calling language, reasoning, and multimodal models from JS handlers.

**Notes**

- Requires a valid API key, typically injected through App Vars or environment variables.
- Outbound network access must be available from the server running the JS handler.

**Agent Guidance**

- Use this when the endpoint must call an external OpenAI model directly instead of delegating to another internal endpoint.
- Return only the relevant subset of the SDK response unless the caller explicitly needs raw provider metadata.

*   Returns: OpenAI client instance

#### Example

```javascript

const client = new OpenAI({
  apiKey: endpointEnv.OPENAI_API_KEY,
});

const response = await client.responses.create({
  model: 'gpt-4.1-mini',
  input: 'Summarize in one sentence what OpenFusionAPI does.',
});

$_RETURN_DATA_ = {
  text: response.output_text,
  id: response.id,
};
      
```

---

### `PromiseSequence`

[External Documentation](https://github.com/edwinspire/sequential-promises) 

Utility for processing async tasks sequentially or in controlled batches.

**Notes**

- Useful when you must avoid flooding an external API or database with too many parallel calls.

**Agent Guidance**

- Use this when order matters or when downstream systems require throttled execution.

#### Example

```javascript

function processBlock(block) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: block * 2 });
    }, 250);
  });
}

const data = [1, 2, 3, 4, 5];
const batchSize = 2;

const result = await PromiseSequence.ByItems(processBlock, batchSize, data);
$_RETURN_DATA_ = result;
      
```

---

### `createImageFromHTML([html], [url], [type], [quality], [fullPage])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Renders HTML content or a URL into an image buffer.

**Notes**

- Pass either html or url. If both are provided, your wrapper implementation defines precedence.

**Agent Guidance**

- Use this when the endpoint must return a screenshot-like image artifact generated on demand.

*   `html` <string> **Optional**. String HTML
*   `url` <string> **Optional**. URL resource
*   `type` <string> **Optional**. Default: `png`. Output type
*   `quality` <integer> **Optional**. Default: `90`. quality
*   `fullPage` <boolean> **Optional**. Default: `true`. fullPage

*   Returns: NodeJS.ArrayBufferView

#### Example

```javascript

const image = await createImageFromHTML('<html><body><h1>Hello</h1></body></html>', '', 'png');

$_CUSTOM_HEADERS_.set("Content-Type", "image/png");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.png"',
);

$_RETURN_DATA_ = image;
      
```

---

### `createPDFFromHTML([html], [url], [format], [landscape], [margin], [printBackground])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Generates a PDF document from an HTML string or a URL.

**Notes**

- Pass either html or url depending on whether the content is already available in memory.

**Agent Guidance**

- Use this for report exports, tickets, or printable documents assembled inside the handler.

*   `html` <string> **Optional**. Raw HTML content to render.
*   `url` <string> **Optional**. URL of the page to convert to PDF.
*   `format` <string> **Optional**. Default: `A4`. Paper format (e.g., 'A4', 'Letter').
*   `landscape` <boolean> **Optional**. Whether to print in landscape mode.
*   `margin` <string> **Optional**. Default: `10mm`. Page margins (e.g., '10mm').
*   `printBackground` <boolean> **Optional**. Default: `true`. Whether to print background graphics.

*   Returns: NodeJS.ArrayBufferView

#### Example

```javascript

const pdf = await createPDFFromHTML('<html><body><h1>Monthly Report</h1></body></html>');

$_CUSTOM_HEADERS_.set("Content-Type", "application/pdf");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.pdf"',
);

$_RETURN_DATA_ = pdf;
      
```

---

### `crypto`

[External Documentation](https://nodejs.org/api/crypto.html) 

Node.js crypto module

*   Returns: Read documentation

#### Example

```javascript

const hash = crypto.createHash('sha256');
hash.update('hello world');
const hex = hash.digest('hex');
$_RETURN_DATA_ = hex;
      
```

---

### `dnsPromises`

[External Documentation](https://nodejs.org/api/dns.html) 

The DNS module enables name resolution functions. It contains methods for performing DNS queries of various types, as well as utility functions for converting between IP addresses in text and binary forms.

*   Returns: Read documentation

#### Example

```javascript

const addresses = await dnsPromises.resolve4('example.com');
$_RETURN_DATA_ = addresses;
      
```

---

### `forge`

[External Documentation](https://github.com/digitalbazaar/forge) 

A native implementation of TLS (and various other cryptographic tools) in JavaScript.

*   Returns: Read documentation

#### Example

```javascript

const pki = forge.pki;
const keys = pki.rsa.generateKeyPair(2048);
const pem = pki.encryptRsaPrivateKey(keys.privateKey, 'password');
$_RETURN_DATA_ = pem;
      
```

---

### `json_to_xlsx_buffer([data])`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Builds an XLSX workbook in memory and returns the binary buffer plus download metadata.

**Notes**

- This helper does not send the file by itself; you still need to assign headers and return the buffer.

**Agent Guidance**

- If the endpoint should download a file, set $_CUSTOM_HEADERS_ from the returned metadata and assign only result.buffer to $_RETURN_DATA_.

*   `data` <object> **Optional**. Workbook definition. Example: { filename: 'report.xlsx', sheets: [{ sheet: 'Sheet1', data: [{ id: 1 }] }] }

*   Returns: <object> Workbook binary and download metadata.

    **Result Structure:**

    *   `buffer` <Buffer> XLSX binary content.
    *   `filename` <string> Suggested filename.
    *   `contentDisposition` <string> Download header value.
    *   `ContentType` <string> MIME type for XLSX.

#### Example

```javascript

const data = {
  filename: 'users.xlsx',
  sheets: [
    {
      sheet: 'Users',
      data: [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ],
    },
  ],
};

const result = json_to_xlsx_buffer(data);

$_CUSTOM_HEADERS_.set('Content-Type', result.ContentType);
$_CUSTOM_HEADERS_.set('Content-Disposition', result.contentDisposition);

$_RETURN_DATA_ = result.buffer;
      
```

---

### `jwt`

[External Documentation](https://github.com/auth0/node-jsonwebtoken) 

An implementation of JSON Web Tokens.

#### Example

```javascript

      const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
      $_RETURN_DATA_ = token;
      
```

---

### `luxon`

[External Documentation](https://moment.github.io/luxon) 

Friendly wrapper for JavaScript dates and times

#### Example

```javascript

      const dt = luxon.DateTime.now();
      $_RETURN_DATA_ = dt;
      
```

---

### `mongoose`

[External Documentation](https://mongoosejs.com) 

MongoDB ODM for defining schemas, models, and queries with validation support.

**Notes**

- Long-lived connections should be reused carefully; close temporary connections when the job is done.

**Agent Guidance**

- Prefer MONGODB handlers for direct data access endpoints; use mongoose in JS handlers when you need schema logic, orchestration, or mixed business rules.

#### Example

```javascript

await mongoose.connect('mongodb://127.0.0.1:27017/test');

const Cat = mongoose.model('Cat', { name: String });
await Cat.create({ name: 'Zildjian' });

const cats = await Cat.find().lean();
await mongoose.disconnect();

$_RETURN_DATA_ = cats;
      
```

---

### `nodemailer`

[External Documentation](https://nodemailer.com/) 

Nodemailer makes sending email from a Node.js application straightforward and secure, without pulling in a single runtime dependency.

**Notes**

- The runtime wrapper strips mailOptions.envelope.size before sendMail() so untrusted request bodies cannot inject that SMTP parameter.

#### Example

```javascript

      const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'username',
          pass: 'password'
        }
      });
      const mailOptions = {
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'This is a test email sent using Nodemailer.'
      };
      const info = await transporter.sendMail(mailOptions);
      $_RETURN_DATA_ = info;
      
```

---

### `ofapi`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

OpenFusionAPI runtime helpers exposed to JS handlers.

**Notes**

- Use ofapi.throw when you need a structured HTTP error from JS handler code.

*   Returns: <object> Utility object with server context and helper methods.

    **Result Structure:**

    *   `server` <object> Runtime server information when available.
    *   `genToken` <function> Signs a JWT token for OpenFusionAPI usage.
    *   `throw` <function> Throws a controlled HTTP exception.

---

### `pdfjs`

[External Documentation](https://mozilla.github.io/pdf.js/) 

PDF parsing library for reading text, metadata, and page structure from PDF documents.

**Notes**

- This is useful for extraction and inspection, not for generating PDFs.

**Agent Guidance**

- Use this when the endpoint must inspect uploaded or downloaded PDFs; do not use it for PDF generation workflows.

#### Example

```javascript

const fileResponse = await fetch('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

const doc = await pdfjs.getDocument({ data: fileBuffer }).promise;
const page = await doc.getPage(1);
const content = await page.getTextContent();

$_RETURN_DATA_ = {
  pages: doc.numPages,
  firstPageTextItems: content.items.length,
};
      
```

---

### `reply`

[External Documentation](https://fastify.dev/docs/latest/Reference/Reply/#introduction) 

Fastify Reply object for low-level response control.

**Notes**

- Once you send a response manually with reply.send(), avoid also assigning a different value to $_RETURN_DATA_.

**Agent Guidance**

- Use reply directly only when $_RETURN_DATA_ and $_CUSTOM_HEADERS_ are not enough for the desired response behavior.

*   Returns: Fastify Reply object

#### Example

```javascript

reply.code(200).send({ name: 'John', age: 30 });
      
```

---

### `request`

[External Documentation](https://fastify.dev/docs/latest/Reference/Request/) 

Fastify Request object with body, query, headers, params, and request metadata.

**Notes**

- For GET endpoints, use request.query. For JSON POST endpoints, use request.body.

*   Returns: Fastify Request object

#### Example

```javascript

$_RETURN_DATA_ = {
  query: request.query,
  body: request.body,
  headers: request.headers,
};
      
```

---

### `request_xlsx_body_to_json(request)`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

Reads uploaded XLSX files from a multipart/form-data request and converts their sheets into JSON rows.

**Notes**

- Only multipart file fields are processed; regular text fields remain available on request.body.

**Agent Guidance**

- Use this helper only when the endpoint receives an uploaded spreadsheet; do not use it for plain JSON requests.

*   `request` <object> Fastify request object containing multipart form-data files.

*   Returns: Array of objects with the data of each sheet of each Excel file.

#### Example

```javascript

const files = await request_xlsx_body_to_json(request);
const firstWorkbook = files[0];

$_RETURN_DATA_ = {
  filename: firstWorkbook?.filename,
  sheets: firstWorkbook?.sheets,
};
      
```

---

### `sequelize`

[External Documentation](https://sequelize.org/) 

Sequelize is a modern TypeScript and Node.js ORM for Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more.

**Notes**

- Useful for ad hoc relational DB operations inside JS handlers, but prefer the SQL handler when the endpoint is mostly a database proxy.

**Agent Guidance**

- Choose sequelize here only when you need transactions, model logic, or multi-step orchestration in JS instead of a single SQL statement.

#### Example

```javascript

const seq = new sequelize.Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

try {
  await seq.authenticate();
  await seq.query("CREATE TABLE users (iduser INTEGER PRIMARY KEY, name TEXT, email TEXT);");
  await seq.query("INSERT INTO users (iduser, name, email) VALUES (1, 'Juan', 'juan@mail.com'), (2, 'Ana', 'ana@mail.com');");

  const result = await seq.query(
    "SELECT * FROM users WHERE iduser = $iduser",
    {
      bind: { iduser: 1 },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  $_RETURN_DATA_ = result;
} finally {
  await seq.close();
}

      
```

---

### `uFetch`

[External Documentation](https://github.com/edwinspire/libOpenFusionAPI) 

HTTP client constructor for calling external or fully-qualified URLs.

**Notes**

- Use uFetch when the target URL is absolute or belongs to another system.
- uFetch evolves frequently, so validate method names and request options against the official documentation or the installed version before publishing new examples or endpoint code.

**Agent Guidance**

- For internal OpenFusionAPI endpoints in the same instance, prefer uFetchAutoEnv instead of hardcoding dev/qa/prd URLs.
- Do not assume older aliases such as uppercase GET or POST remain the preferred API; confirm the current library contract first.

*   Returns: uFetch instance

#### Example

```javascript

const uF = new uFetch('https://jsonplaceholder.typicode.com/todos/1');
const response = await uF.get();
$_RETURN_DATA_ = await response.json();
      
```

---

### `uFetchAutoEnv`

[External Documentation](https://github.com/edwinspire/universal-fetch) 

HTTP helper specialized for calling endpoints in the same OpenFusionAPI instance while preserving the current environment.

**Notes**

- If the path ends in /auto or /env, the helper replaces that suffix with the current runtime environment.
- Because this helper wraps universal-fetch, confirm the current upstream request API before relying on older snippets.

**Agent Guidance**

- Prefer relative internal URLs such as /api/myapp/resource/auto instead of hardcoded localhost URLs.
- When editing seeded endpoints or documentation, keep method casing aligned with the installed universal-fetch version.

#### Example

```javascript

const uF = uFetchAutoEnv.auto('/api/datetime_app/sum-array/auto');
const response = await uF.post({ data: { numbers: [4, 12, 9] } });

$_RETURN_DATA_ = await response.json();
      
```

---

### `uuid`

[External Documentation](https://www.npmjs.com/package/uuid) 

UUID package to generate RFC4122 UUIDs.

#### Example

```javascript

const result_uuid = uuid.v4();
$_RETURN_DATA_ = result_uuid;
      
```

---

### `xlsx`

[External Documentation](https://docs.sheetjs.com/docs/) 

SheetJS Community Edition offers battle-tested open-source solutions for extracting useful data from almost any complex spreadsheet and generating new spreadsheets that will work with legacy and modern software alike.

**Agent Guidance**

- Use xlsx when you need direct workbook/worksheet operations. Use json_to_xlsx_buffer when you only need a quick downloadable XLSX file.

#### Example

```javascript

const rows = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
];

const worksheet = xlsx.utils.json_to_sheet(rows);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');

const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

$_CUSTOM_HEADERS_.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
$_CUSTOM_HEADERS_.set('Content-Disposition', 'attachment; filename="users.xlsx"');
$_RETURN_DATA_ = Buffer.from(buffer);
      
```

---

### `xlsx_style`

[External Documentation](https://github.com/gitbrent/xlsx-js-style) 

Styled XLSX builder based on SheetJS, useful when the exported workbook needs fonts, fills, borders, or alignment.

**Notes**

- Prefer xlsx_style over xlsx when presentation matters in the generated spreadsheet.

#### Example

```javascript

const wb = xlsx_style.utils.book_new();

let row = [
	{ v: "Courier: 24", t: "s", s: { font: { name: "Courier", sz: 24 } } },
	{ v: "bold & color", t: "s", s: { font: { bold: true, color: { rgb: "FF0000" } } } },
	{ v: "fill: color", t: "s", s: { fill: { fgColor: { rgb: "E9E9E9" } } } },
	{ v: "line
break", t: "s", s: { alignment: { wrapText: true } } },
];
const ws = xlsx_style.utils.aoa_to_sheet([row]);
xlsx_style.utils.book_append_sheet(wb, ws, "Styled Demo");

const buffer = xlsx_style.write(wb, { type: 'buffer', bookType: 'xlsx' });

$_CUSTOM_HEADERS_.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
$_CUSTOM_HEADERS_.set('Content-Disposition', 'attachment; filename="styled-demo.xlsx"');
$_RETURN_DATA_ = Buffer.from(buffer);
      
```

---

### `xml2js`

[External Documentation](https://github.com/Leonidas-from-XIV/node-xml2js) 

Simple XML to JavaScript object converter. It supports bi-directional conversion.

*   Returns: Read documentation

#### Example

```javascript

const parser = new xml2js.Parser();
const result = await parser.parseStringPromise('<root><child>Hello</child></root>');
$_RETURN_DATA_ = result;
      
```

---

### `xmlCrypto`

[External Documentation](https://github.com/node-saml/xml-crypto) 

It is a Node.js package that allows working with XML digital signatures, facilitating the signing and verification of XML documents using the XML Signature specification, ideal for applications that handle security and data validation in this format, using private and public keys.

*   Returns: Read documentation

#### Example

```javascript

const xml = fs.readFileSync('my-xml-doc.xml');
const sig = new xmlCrypto.SignedXml();

sig.addReference(
  '//*[local-name(.)="Invoice"]',
  ['http://www.w3.org/2000/09/xmldsig#enveloped-signature'],
  'http://www.w3.org/2001/10/xml-exc-c14n#'
);

sig.loadXml(xml);

const key = fs.readFileSync('my-key.pem');
sig.signingKey = key;

sig.computeSignature();

const signedXml = sig.getSignedXml();
$_RETURN_DATA_ = signedXml;
      
```

---

### `xmlFormatter`

[External Documentation](https://github.com/chrisbottin/xml-formatter) 

Formats XML into a readable, pretty-printed string.

**Notes**

- Useful for debugging SOAP/XML payloads before returning them or saving them to logs.

*   Returns: Formatted XML string

#### Example

```javascript

const xml = '<root><child>Hello</child></root>';
const formattedXml = xmlFormatter(xml, { indentation: '  ' });
$_RETURN_DATA_ = formattedXml;
      
```

---

### `xmldom`

[External Documentation](https://github.com/xmldom/xmldom) 

A JavaScript implementation of W3C DOM for Node.js, Rhino and the browser. Fully compatible with W3C DOM level2; and some compatible with level3.

*   Returns: Read documentation

#### Example

```javascript

const parser = new xmldom.DOMParser();
const doc = parser.parseFromString('<root><child>Hello</child></root>', 'text/xml');
$_RETURN_DATA_ = doc;
      
```

---

### `z`

[External Documentation](https://zod.dev/?id=introduction) 

Zod schema builder and validator, exposed in the JS handler as the variable z.

**Notes**

- The runtime key is z, even though the imported module is named Zod in this source file.

#### Example

```javascript

const schema = z.object({
  name: z.string(),
  age: z.number().int().nonnegative(),
});

const result = schema.parse({ name: 'John', age: 30 });
$_RETURN_DATA_ = result;
      
```

---

