import crypto from "crypto";
import PromiseSequence from "@edwinspire/sequential-promises";
import mongoose from "mongoose";
import * as luxon from "luxon";
import * as sequelize from "sequelize";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import nodemailer from "nodemailer";
import * as xmlCrypto from "xml-crypto";
import * as xmldom from "@xmldom/xmldom";
import * as forge from "node-forge";
import * as uuid from "uuid";
import Zod from "zod";
import * as XLSX from "xlsx";
//import * as xlsx_style from "xlsx-js-style";
import xlsx_style from "xlsx-js-style";
import { askIAWithMCP, listMcpTools } from "./askIAWithMCP.js";

import {
  createImage as createImageFromHTML,
  createPDF as createPDFFromHTML,
} from "../server/pdf-generator.js";
import { isValidHttpStatusCode } from "../handler/utils.js";
import { default_port } from "./utils_path.js";
import uFetch from "@edwinspire/universal-fetch";
import jwt from "jsonwebtoken";
import xmlFormatter from "xml-formatter";
import xml2js from "xml2js";
import dnsPromises from "dns/promises";
import OpenAI from "openai";

const { PORT, JWT_KEY } = process.env;

if (!process.env.JWT_KEY) {
  if (process.env.NODE_ENV === 'production') {
    console.error("FATAL: JWT_KEY is not defined in production. Refusing to start.");
    process.exit(1);
  }
  console.warn("WARNING: JWT_KEY is not defined. Using insecure fallback key.");
}
export const JWTKEY = JWT_KEY ?? 'oy8632rcv"$/8';

const sanitizeNodemailerMailOptions = (mailOptions) => {
  if (!mailOptions || typeof mailOptions !== "object") {
    return mailOptions;
  }

  if (
    mailOptions.envelope &&
    typeof mailOptions.envelope === "object" &&
    Object.hasOwn(mailOptions.envelope, "size")
  ) {
    const safeEnvelope = { ...mailOptions.envelope };
    delete safeEnvelope.size;
    return { ...mailOptions, envelope: safeEnvelope };
  }

  return mailOptions;
};

const wrapNodemailerTransport = (transporter) => {
  if (!transporter || typeof transporter.sendMail !== "function") {
    return transporter;
  }

  return {
    ...transporter,
    sendMail(mailOptions, ...args) {
      return transporter.sendMail(
        sanitizeNodemailerMailOptions(mailOptions),
        ...args
      );
    },
  };
};

const nodemailerSafe = {
  ...nodemailer,
  createTransport(...args) {
    return wrapNodemailerTransport(nodemailer.createTransport(...args));
  },
};

/**
 * @param {any} data
 */
export function GenToken(data, exp_seconds = 3600 *2 /* 2 horas */, key = JWTKEY) {
  let exp = Math.floor(Date.now() / 1000) + Number(exp_seconds);
  return jwt.sign({ data: { ...data, _rnd_: Math.random() }, exp: exp }, key);
}

/**
 * Genera un JWT firmado con fechas de inicio y fin explícitas.
 * @param {any} data - Datos a incluir en el token.
 * @param {Date|string} [startAt] - Fecha/hora de inicio. Por defecto: ahora.
 * @param {Date|string} [endAt]   - Fecha/hora de expiración. Por defecto: ahora + 1 hora.
 * @param {string} [key]          - Clave de firma. Por defecto: JWTKEY.
 * @returns {string} JWT firmado.
 */
export function GenTokenJWT(data, startAt, endAt, key = JWTKEY) {
  const now = new Date();

  const start = startAt ? new Date(startAt) : now;
  const end = endAt ? new Date(endAt) : new Date(start.getTime() + 3600 * 1000);

  // Validations
  if (isNaN(start.getTime())) {
    throw new Error("startAt is not a valid date");
  }

  if (isNaN(end.getTime())) {
    throw new Error("endAt is not a valid date");
  }

  if (end <= start) {
    throw new Error("endAt must be greater than startAt");
  }

  const iat = Math.floor(start.getTime() / 1000);
  const exp = Math.floor(end.getTime() / 1000);
  const nbf = iat; // actual validity start

  return jwt.sign(
    {
      data: { ...data },
      //iat,
      exp,
      nbf
    },
    key
  );
}

export const jsException = (message, data, http_statusCode = 500) => {
  let status = isValidHttpStatusCode(http_statusCode) ? http_statusCode : 500;
  throw { message, data, date: new Date(), statusCode: status };
};

const ENV_SUFFIX_REGEX = /\/(auto|env)$/;

/**
 * Clase para manejar URLs con entornos auto y env
 */
export class URLAutoEnvironment {

  constructor({ environment, port = default_port, baseUrl = "http://localhost", headers = new Headers() }) {
    this.environment = environment;
    this.base = `${baseUrl}:${port}`;
    this.headers = headers;
  }

  isAbsoluteUrl = (url) => {
    // 1. Filtro rápido: Si no tiene ':', no puede ser absoluta (evita el try/catch)
    if (typeof url !== "string" || !url.includes(":")) return false;

    try {
      // 2. El constructor URL lanza error si no es válida
      // new URL() acepta rutas relativas si se le da una base,
      // pero si solo le pasas un string, valida si parece absoluta.
      // Para ser 100% seguros de que es absoluta, verificamos el protocolo.
      const parsed = new URL(url);
      // ws:, wss:, http:, https:, ftp:, etc.
      return parsed.protocol.length > 0;
    } catch (e) {
      return false;
    }
  };

  /**
   * Punto de entrada principal
   */
  create(url, shouldApplyAuto = true) {
    let uF;
    // Si es absoluta, devolvemos uFetch directo
    if (this.isAbsoluteUrl(url)) {
      uF = new uFetch(url);
    }

    if (!uF) {
      // Si es relativa, procesamos
      const finalPath = shouldApplyAuto ? this._applyEnvironment(url) : url;
      uF = new uFetch(this._buildFullUrl(finalPath));
    }

    if (this.headers) {

      for (const key of this.headers.keys()) {
        uF.addHeader(key, this.headers.get(key));
      }
    }

    return uF;
  }

  auto(url) {
    return this.create(url, true);
  }

  /**
   * Construye la URL completa
   * @private
   */
  _buildFullUrl(path) {
    // Aseguramos que el path empiece con /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${this.base}${normalizedPath}`;
  }

  /**
   * Aplica la lógica de reemplazo de sufijos
   * @private
   */
  _applyEnvironment(path) {
    // Reemplaza /auto o /env permitiendo query strings o hash al final
    // Ejemplo: /api/auto?q=1 -> /api/prd?q=1
    return path.replace(/\/(auto|env)(\?|#|$)/, `/${this.environment}$2`);
  }
}

export const json_to_xlsx_buffer = (
  data = { filename: "file", sheets: [{ sheet: "Sheet1", data: [] }] },
) => {
  try {
    //let resultBuffer = null;
    // Paso 1: Crear un nuevo libro (workbook)
    const workbook = XLSX.utils.book_new();

    if (Array.isArray(data.sheets)) {
      for (let index = 0; index < data.sheets.length; index++) {
        const sheetInfo = data.sheets[index];
        const sheetName = sheetInfo.sheet || `Sheet${index + 1}`;
        const jsonData = sheetInfo.data || [];
        // Convertir el array de objetos a una hoja de cálculo (worksheet)
        // - `json_to_sheet` convierte automáticamente los objetos a una hoja.
        // - Property names (a, b) become the column headers.
        const worksheet = XLSX.utils.json_to_sheet(jsonData);

        // Definir los estilos
        const headerStyle = {
          fill: {
            fgColor: { rgb: "D3D3D3" }, // Fondo gris claro para el encabezado
          },
          font: {
            bold: true,
          },
        };

        // Aplicar estilo al encabezado (primera fila)
        if (worksheet["!ref"]) {
          const range = XLSX.utils.decode_range(worksheet["!ref"]);
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (worksheet[cellAddress]) {
              worksheet[cellAddress].s = headerStyle;
            }
          }
        }

        // Añadir la hoja al libro
        // - Primer parámetro: la hoja creada
        // - Segundo parámetro: el nombre de la hoja (aparecerá en la pestaña abajo)
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    }

    // Obtenemos el Buffer directamente en memoria, sin guardar nada en disco
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
      compression: true,
    });
    return {
      buffer: Buffer.from(buffer),
      filename: data.filename || "data.xlsx",
      contentDisposition: `attachment; filename="${data.filename || "data.xlsx"}"`,
      ContentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  } catch (error) {
    console.error("Error generating XLSX:", error);
    // Return empty buffer or handle as needed, for now just returning error structure or similar might be better but 
    // strictly, the caller expects a buffer object. Let's return a safe failure object or rethrow.
    // Given the context (likely used in an API response), returning specific error might be handled by caller if they check properties.
    // But to be safe and consistent with previous behavior (which crashed), let's swallow and return null or throw. 
    // The previous code crashed. Rethrowing with a clearer message is better.
    throw new Error("Failed to generate XLSX: " + error.message);
  }
};

export const xlsx_body_to_json = async (request) => {
  let result = [];

  const contentType = request.headers["content-type"];

  // Identifica el tipo de dato que llega y extrae los valores
  if (contentType && contentType.includes("multipart/form-data")) {
    // Multipart (archivos, streams, etc)
    for (let name in request.body) {
      //console.log("Processing body field:", name);
      let element = request.body[name];

      if (Array.isArray(element)) {
        // Es una lista de archivos con el mismo nombre
        //console.log(`Field ${name} is an array with ${element.length} items.`);

        for (let index = 0; index < element.length; index++) {
          const file = element[index];
          if (file && file.type === "file") {
            let buffer = await file.toBuffer();
            result.push({
              filename: file.filename,
              sheets: xlsx_buffer_to_json(buffer),
            });
          }
        }
      } else if (element && element.type === "file") {
        //console.log(`Field ${name} is a file of type ${element.mimetype}.`);
        let buffer = await element.toBuffer();
        result.push({
          filename: element.filename,
          sheets: xlsx_buffer_to_json(buffer),
        });
      }
    }
  }

  return result;
};

const xlsx_buffer_to_json = (buffer) => {
  let sheets = [];
  try {
    let workbook = XLSX.read(buffer, { type: "buffer" });

    let sheet_names = workbook.SheetNames;
    for (let index = 0; index < sheet_names.length; index++) {
      let sheet_name = sheet_names[index];
      const worksheet = workbook.Sheets[sheet_name];
      let out_json = XLSX.utils.sheet_to_json(worksheet, {
        header: 0,
        raw: false,
      });
      sheets.push({ sheet: sheet_name, data: out_json });
    }
  } catch (error) {
    console.error("Error processing XLSX buffer:", error);
  }

  return sheets;
};

export const functionsVars = (request, reply, environment) => {
  let fnVars = listFunctionsVars(request, reply, environment);
  let fnResult = {};
  let keys = Object.keys(fnVars);

  try {
    for (let index = 0; index < keys.length; index++) {
      const k = keys[index];
      fnResult[k] = fnVars[k].fn;
    }
  } catch (error) {
    console.error(error);
  }

  return fnResult;
};

export const listFunctionsVars = (request, reply, environment) => {

  let headers = new Headers();

  if (request) {
    let trace_id = request.headers?.["ofapi-trace-id"];
    if (trace_id) {
      headers.append("ofapi-trace-id", trace_id);
    }
  }

  const fnUrlae = new URLAutoEnvironment({ environment, port: PORT, headers });

  const own_repo = "https://github.com/edwinspire/libOpenFusionAPI";

  const ofapi = {
    server: reply ? reply?.openfusionapi?.server : undefined,
    genToken: request && reply ? GenToken : undefined,

    throw: (message, http_statusCode = 500, data = null) => {
      let status = isValidHttpStatusCode(http_statusCode)
        ? http_statusCode
        : 500;
      throw { message, data, date: new Date(), statusCode: status };
    },
  };

  return {
    OpenAI: {
      fn: request && reply ? OpenAI : undefined,
      description: "Official OpenAI SDK for calling language, reasoning, and multimodal models from JS handlers.",
      web: "https://github.com/openai/openai-node",
      return: "OpenAI client instance",
      notes: [
        "Requires a valid API key, typically injected through App Vars or environment variables.",
        "Outbound network access must be available from the server running the JS handler.",
      ],
      agentGuidance: [
        "Use this when the endpoint must call an external OpenAI model directly instead of delegating to another internal endpoint.",
        "Return only the relevant subset of the SDK response unless the caller explicitly needs raw provider metadata.",
      ],
      example: `
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
      `,
    },
    ofapi: {
      fn: request && reply ? ofapi : undefined,
      description: "OpenFusionAPI runtime helpers exposed to JS handlers.",
      web: own_repo,
      return: {
        type: "object",
        description: "Utility object with server context and helper methods.",
        object: [
          { name: "server", type: "object", description: "Runtime server information when available." },
          { name: "genToken", type: "function", description: "Signs a JWT token for OpenFusionAPI usage." },
          { name: "throw", type: "function", description: "Throws a controlled HTTP exception." },
        ],
      },
      notes: [
        "Use ofapi.throw when you need a structured HTTP error from JS handler code.",
      ],
    },
    xmlCrypto: {
      fn: request && reply ? xmlCrypto : undefined,
      description: "It is a Node.js package that allows working with XML digital signatures, facilitating the signing and verification of XML documents using the XML Signature specification, ideal for applications that handle security and data validation in this format, using private and public keys.",
      web: "https://github.com/node-saml/xml-crypto",
      return: "Read documentation",
      example: `
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
      `,
    },
    xmlFormatter: {
      fn: request && reply ? xmlFormatter : undefined,
      description: "Formats XML into a readable, pretty-printed string.",
      web: "https://github.com/chrisbottin/xml-formatter",
      return: "Formatted XML string",
      notes: [
        "Useful for debugging SOAP/XML payloads before returning them or saving them to logs.",
      ],
      example: `
const xml = '<root><child>Hello</child></root>';
const formattedXml = xmlFormatter(xml, { indentation: '  ' });
$_RETURN_DATA_ = formattedXml;
      `,
    },
    xmldom: {
      fn: request && reply ? xmldom : undefined,
      description: "A JavaScript implementation of W3C DOM for Node.js, Rhino and the browser. Fully compatible with W3C DOM level2; and some compatible with level3.",
      web: "https://github.com/xmldom/xmldom",
      return: "Read documentation",
      example: `
const parser = new xmldom.DOMParser();
const doc = parser.parseFromString('<root><child>Hello</child></root>', 'text/xml');
$_RETURN_DATA_ = doc;
      `,
    },
    dnsPromises: {
      fn: request && reply ? dnsPromises : undefined,
      description: "The DNS module enables name resolution functions. It contains methods for performing DNS queries of various types, as well as utility functions for converting between IP addresses in text and binary forms.",
      web: "https://nodejs.org/api/dns.html",
      return: "Read documentation",
      example: `
const addresses = await dnsPromises.resolve4('example.com');
$_RETURN_DATA_ = addresses;
      `,
    },
    xml2js: {
      fn: request && reply ? xml2js : undefined,
      description: "Simple XML to JavaScript object converter. It supports bi-directional conversion.",
      web: "https://github.com/Leonidas-from-XIV/node-xml2js",
      return: "Read documentation",
      example: `
const parser = new xml2js.Parser();
const result = await parser.parseStringPromise('<root><child>Hello</child></root>');
$_RETURN_DATA_ = result;
      `,
    },
    forge: {
      fn: request && reply ? forge.default : undefined,
      description: "A native implementation of TLS (and various other cryptographic tools) in JavaScript.",
      web: "https://github.com/digitalbazaar/forge",
      return: "Read documentation",
      example: `
const pki = forge.pki;
const keys = pki.rsa.generateKeyPair(2048);
const pem = pki.encryptRsaPrivateKey(keys.privateKey, 'password');
$_RETURN_DATA_ = pem;
      `,
    },
    json_to_xlsx_buffer: {
      fn: request && reply ? json_to_xlsx_buffer : undefined,
      description: "Builds an XLSX workbook in memory and returns the binary buffer plus download metadata.",
      web: own_repo,
      params: [
        {
          name: "data",
          info: "Workbook definition. Example: { filename: 'report.xlsx', sheets: [{ sheet: 'Sheet1', data: [{ id: 1 }] }] }",
          type: "object",
        },
      ],
      return: {
        type: "object",
        description: "Workbook binary and download metadata.",
        object: [
          { name: "buffer", type: "Buffer", description: "XLSX binary content." },
          { name: "filename", type: "string", description: "Suggested filename." },
          { name: "contentDisposition", type: "string", description: "Download header value." },
          { name: "ContentType", type: "string", description: "MIME type for XLSX." },
        ],
      },
      notes: [
        "This helper does not send the file by itself; you still need to assign headers and return the buffer.",
      ],
      agentGuidance: [
        "If the endpoint should download a file, set $_CUSTOM_HEADERS_ from the returned metadata and assign only result.buffer to $_RETURN_DATA_.",
      ],
      example: `
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
      `,
    },
    request_xlsx_body_to_json: {
      fn: request && reply ? xlsx_body_to_json : undefined,
      description: "Reads uploaded XLSX files from a multipart/form-data request and converts their sheets into JSON rows.",
      web: own_repo,
      params: [
        {
          name: "request",
          description: "Fastify request object containing multipart form-data files.",
          required: true,
          type: "object",
        },
      ],
      return: "Array of objects with the data of each sheet of each Excel file.",
      notes: [
        "Only multipart file fields are processed; regular text fields remain available on request.body.",
      ],
      agentGuidance: [
        "Use this helper only when the endpoint receives an uploaded spreadsheet; do not use it for plain JSON requests.",
      ],
      example: `
const files = await request_xlsx_body_to_json(request);
const firstWorkbook = files[0];

$_RETURN_DATA_ = {
  filename: firstWorkbook?.filename,
  sheets: firstWorkbook?.sheets,
};
      `
    },
    crypto: {
      fn: request && reply ? crypto : undefined,
      description: "Node.js crypto module",
      web: "https://nodejs.org/api/crypto.html",
      return: "Read documentation",
      example: `
const hash = crypto.createHash('sha256');
hash.update('hello world');
const hex = hash.digest('hex');
$_RETURN_DATA_ = hex;
      `,
    },
    $_RETURN_DATA_: {
      fn: {},
      description: "Primary output slot for JS handlers. Assign the final payload here instead of using return.",
      web: own_repo,
      return: "Any values",
      notes: [
        "This is the supported JS handler response contract.",
      ],
      agentGuidance: [
        "Prefer assigning to $_RETURN_DATA_ over calling reply.send() directly unless you need low-level Fastify control.",
      ],
      example: `
$_RETURN_DATA_ = { name: 'John', age: 30 };
      `,
    },
    $_CUSTOM_HEADERS_: {
      fn: new Map(),
      description: "Map of custom response headers to send together with $_RETURN_DATA_.",
      web: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
      return: "Map object with custom headers",
      notes: [
        "Useful for downloads, custom content types, caching headers, and content disposition.",
      ],
      agentGuidance: [
        "Set headers here before assigning binary or special response payloads to $_RETURN_DATA_.",
      ],
      example: `
$_CUSTOM_HEADERS_.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.xlsx"',
);
      `,
    },
    reply: {
      fn: request && reply ? reply : undefined,
      description: "Fastify Reply object for low-level response control.",
      web: "https://fastify.dev/docs/latest/Reference/Reply/#introduction",
      return: "Fastify Reply object",
      notes: [
        "Once you send a response manually with reply.send(), avoid also assigning a different value to $_RETURN_DATA_.",
      ],
      agentGuidance: [
        "Use reply directly only when $_RETURN_DATA_ and $_CUSTOM_HEADERS_ are not enough for the desired response behavior.",
      ],
      example: `
reply.code(200).send({ name: 'John', age: 30 });
      `,
    },
    request: {
      fn: request && reply ? request : undefined,
      description: "Fastify Request object with body, query, headers, params, and request metadata.",
      web: "https://fastify.dev/docs/latest/Reference/Request/",
      return: "Fastify Request object",
      notes: [
        "For GET endpoints, use request.query. For JSON POST endpoints, use request.body.",
      ],
      example: `
$_RETURN_DATA_ = {
  query: request.query,
  body: request.body,
  headers: request.headers,
};
      `,
    },
    uFetch: {
      fn: request && reply ? uFetch : undefined,
      description: "HTTP client constructor for calling external or fully-qualified URLs.",
      web: own_repo,
      return: "uFetch instance",
      notes: [
        "Use uFetch when the target URL is absolute or belongs to another system.",
        "uFetch evolves frequently, so validate method names and request options against the official documentation or the installed version before publishing new examples or endpoint code.",
      ],
      agentGuidance: [
        "For internal OpenFusionAPI endpoints in the same instance, prefer uFetchAutoEnv instead of hardcoding dev/qa/prd URLs.",
        "Do not assume older aliases such as uppercase GET or POST remain the preferred API; confirm the current library contract first.",
      ],
      example: `
const uF = new uFetch('https://jsonplaceholder.typicode.com/todos/1');
const response = await uF.get();
$_RETURN_DATA_ = await response.json();
      `,
    },
    uFetchAutoEnv: {
      fn: request && reply ? fnUrlae : undefined,
      description: `HTTP helper specialized for calling endpoints in the same OpenFusionAPI instance while preserving the current environment.`,
      web: "https://github.com/edwinspire/universal-fetch",
      notes: [
        "If the path ends in /auto or /env, the helper replaces that suffix with the current runtime environment.",
        "Because this helper wraps universal-fetch, confirm the current upstream request API before relying on older snippets.",
      ],
      agentGuidance: [
        "Prefer relative internal URLs such as /api/myapp/resource/auto instead of hardcoded localhost URLs.",
        "When editing seeded endpoints or documentation, keep method casing aligned with the installed universal-fetch version.",
      ],
      example: `
const uF = uFetchAutoEnv.auto('/api/datetime_app/sum-array/auto');
const response = await uF.post({ data: { numbers: [4, 12, 9] } });

$_RETURN_DATA_ = await response.json();
      `,
    },
    PromiseSequence: {
      fn: request && reply ? PromiseSequence : undefined,
      description: "Utility for processing async tasks sequentially or in controlled batches.",
      web: "https://github.com/edwinspire/sequential-promises",
      notes: [
        "Useful when you must avoid flooding an external API or database with too many parallel calls.",
      ],
      agentGuidance: [
        "Use this when order matters or when downstream systems require throttled execution.",
      ],
      example: `
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
      `,
    },
    uuid: {
      fn: request && reply ? uuid : undefined,
      description: "UUID package to generate RFC4122 UUIDs.",
      web: "https://www.npmjs.com/package/uuid",
      example: `
const result_uuid = uuid.v4();
$_RETURN_DATA_ = result_uuid;
      `,
    },
    mongoose: {
      fn: request && reply ? mongoose : undefined,
      description: "MongoDB ODM for defining schemas, models, and queries with validation support.",
      web: "https://mongoosejs.com",
      notes: [
        "Long-lived connections should be reused carefully; close temporary connections when the job is done.",
      ],
      agentGuidance: [
        "Prefer MONGODB handlers for direct data access endpoints; use mongoose in JS handlers when you need schema logic, orchestration, or mixed business rules.",
      ],
      example: `
await mongoose.connect('mongodb://127.0.0.1:27017/test');

const Cat = mongoose.model('Cat', { name: String });
await Cat.create({ name: 'Zildjian' });

const cats = await Cat.find().lean();
await mongoose.disconnect();

$_RETURN_DATA_ = cats;
      `,
    },
    $_EXCEPTION_: {
      fn: request && reply ? jsException : undefined,
      description: "Interrupts the program flow and throws an exception with a specific message and status code.",
      web: own_repo,
      params: [
        {
          name: "message",
          description: "The error message to display.",
          required: true,
          type: "string",
          default: "",
        },
        {
          name: "data",
          description: "Additional context data for the error.",
          required: false,
          type: "any",
          default: null,
        },
        {
          name: "statusCode",
          description: "HTTP Status Code for the response.",
          required: false,
          type: "integer",
          default: 500,
        },
      ],
      return: {
        type: "void",
        description: "Throws an exception object that stops execution.",
        object: [
          {
            name: "message",
            description: "The error message.",
            type: "string",
          },
          {
            name: "data",
            description: "Context data.",
            type: "any",
          },
          {
            name: "statusCode",
            description: "HTTP Status Code.",
            type: "integer",
          },
        ],
      },
      example: `// simple usage
$_EXCEPTION_("Invalid input parameter");

// with data and status code
$_EXCEPTION_("User not found", { userId: 123 }, 404);`,
    },
    jwt: {
      fn: request && reply ? jwt : undefined,
      description: "An implementation of JSON Web Tokens.",
      web: "https://github.com/auth0/node-jsonwebtoken",
      example: `
      const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
      $_RETURN_DATA_ = token;
      `
    },
    luxon: {
      fn: request && reply ? luxon : undefined,
      description: "Friendly wrapper for JavaScript dates and times",
      web: "https://moment.github.io/luxon",
      example: `
      const dt = luxon.DateTime.now();
      $_RETURN_DATA_ = dt;
      `
    },
    pdfjs: {
      fn: request && reply ? pdfjs : undefined,
      description: "PDF parsing library for reading text, metadata, and page structure from PDF documents.",
      web: "https://mozilla.github.io/pdf.js/",
      notes: [
        "This is useful for extraction and inspection, not for generating PDFs.",
      ],
      agentGuidance: [
        "Use this when the endpoint must inspect uploaded or downloaded PDFs; do not use it for PDF generation workflows.",
      ],
      example: `
const fileResponse = await fetch('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

const doc = await pdfjs.getDocument({ data: fileBuffer }).promise;
const page = await doc.getPage(1);
const content = await page.getTextContent();

$_RETURN_DATA_ = {
  pages: doc.numPages,
  firstPageTextItems: content.items.length,
};
      `
    },

    createImageFromHTML: {
      fn: request && reply ? createImageFromHTML : undefined,
      description: "Renders HTML content or a URL into an image buffer.",
      web: own_repo,
      params: [
        {
          name: "html",
          description: "String HTML",
          required: false,
          value_type: "string",
          default_value: "",
        },
        {
          name: "url",
          description: "URL resource",
          required: false,
          value_type: "string",
          default_value: "",
        },
        {
          name: "type",
          description: "Output type",
          required: false,
          value_type: "string",
          default_value: "png",
        },
        {
          name: "quality",
          description: "quality",
          required: false,
          value_type: "integer",
          default_value: 90,
        },
        {
          name: "fullPage",
          description: "fullPage",
          required: false,
          type: "boolean",
          default_value: true,
        },
      ],
      return: "NodeJS.ArrayBufferView",
      notes: [
        "Pass either html or url. If both are provided, your wrapper implementation defines precedence.",
      ],
      agentGuidance: [
        "Use this when the endpoint must return a screenshot-like image artifact generated on demand.",
      ],
      example: `
const image = await createImageFromHTML('<html><body><h1>Hello</h1></body></html>', '', 'png');

$_CUSTOM_HEADERS_.set("Content-Type", "image/png");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.png"',
);

$_RETURN_DATA_ = image;
      `,
    },

    createPDFFromHTML: {
      fn: request && reply ? createPDFFromHTML : undefined,
      description: "Generates a PDF document from an HTML string or a URL.",
      web: own_repo,
      params: [
        {
          name: "html",
          description: "Raw HTML content to render.",
          required: false,
          type: "string",
          default: "",
        },
        {
          name: "url",
          description: "URL of the page to convert to PDF.",
          required: false,
          type: "string",
          default: "",
        },
        {
          name: "format",
          description: "Paper format (e.g., 'A4', 'Letter').",
          required: false,
          type: "string",
          default: "A4",
        },
        {
          name: "landscape",
          description: "Whether to print in landscape mode.",
          required: false,
          type: "boolean",
          default: false,
        },
        {
          name: "margin",
          description: "Page margins (e.g., '10mm').",
          required: false,
          type: "string",
          default: "10mm",
        },
        {
          name: "printBackground",
          description: "Whether to print background graphics.",
          required: false,
          type: "boolean",
          default: true,
        },
      ],
      return: "NodeJS.ArrayBufferView",
      notes: [
        "Pass either html or url depending on whether the content is already available in memory.",
      ],
      agentGuidance: [
        "Use this for report exports, tickets, or printable documents assembled inside the handler.",
      ],
      example: `
const pdf = await createPDFFromHTML('<html><body><h1>Monthly Report</h1></body></html>');

$_CUSTOM_HEADERS_.set("Content-Type", "application/pdf");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.pdf"',
);

$_RETURN_DATA_ = pdf;
      `,
    },

    sequelize: {
      fn: request && reply ? sequelize : undefined,
      description: "Sequelize is a modern TypeScript and Node.js ORM for Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more.",
      web: "https://sequelize.org/",
      notes: [
        "Useful for ad hoc relational DB operations inside JS handlers, but prefer the SQL handler when the endpoint is mostly a database proxy.",
      ],
      agentGuidance: [
        "Choose sequelize here only when you need transactions, model logic, or multi-step orchestration in JS instead of a single SQL statement.",
      ],
      example: `
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

      `
    },
    z: {
      fn: request && reply ? Zod : undefined,
      description: "Zod schema builder and validator, exposed in the JS handler as the variable z.",
      web: "https://zod.dev/?id=introduction",
      notes: [
        "The runtime key is z, even though the imported module is named Zod in this source file.",
      ],
      example: `
const schema = z.object({
  name: z.string(),
  age: z.number().int().nonnegative(),
});

const result = schema.parse({ name: 'John', age: 30 });
$_RETURN_DATA_ = result;
      `
    },
    nodemailer: {
      fn: request && reply ? nodemailerSafe : undefined,
      description: "Nodemailer makes sending email from a Node.js application straightforward and secure, without pulling in a single runtime dependency.",
      web: "https://nodemailer.com/",
      notes: [
        "The runtime wrapper strips mailOptions.envelope.size before sendMail() so untrusted request bodies cannot inject that SMTP parameter.",
      ],
      example: `
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
      `
    },
    xlsx: {
      fn: request && reply ? XLSX : undefined,
      description: "SheetJS Community Edition offers battle-tested open-source solutions for extracting useful data from almost any complex spreadsheet and generating new spreadsheets that will work with legacy and modern software alike.",
      web: "https://docs.sheetjs.com/docs/",
      agentGuidance: [
        "Use xlsx when you need direct workbook/worksheet operations. Use json_to_xlsx_buffer when you only need a quick downloadable XLSX file.",
      ],
      example: `
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
      `
    },
    askIAWithMCP: {
      fn: request && reply ? askIAWithMCP : undefined,
      description: "Runs a chat completion against an OpenAI-compatible provider and can connect the model to MCP servers so it can discover and invoke tools during the conversation.",
      web: own_repo,
      params: [
        {
          name: "options.ai",
          description: "AI provider configuration. Must include at least `model`. Use `baseUrl` for local Ollama or another OpenAI-compatible host, and `apiKey` when the provider requires authentication.",
          required: true,
          type: "object",
        },
        {
          name: "options.ai.modelProvider",
          description: "Provider label for diagnostics or routing conventions, for example `ollama` or `openai-compatible`.",
          required: false,
          type: "string",
        },
        {
          name: "options.ai.model",
          description: "Exact model name to invoke. This field is required.",
          required: true,
          type: "string",
        },
        {
          name: "options.ai.baseUrl|baseURL",
          description: "Optional OpenAI-compatible base URL. Example: `http://localhost:11434` for Ollama.",
          required: false,
          type: "string",
        },
        {
          name: "options.ai.apiKey|api_key",
          description: "Provider API key when required. If omitted and `baseUrl` is present, the helper uses a placeholder key for local OpenAI-compatible servers.",
          required: false,
          type: "string",
        },
        {
          name: "options.ai.temperature",
          description: "Sampling temperature sent to the provider.",
          required: false,
          type: "number",
        },
        {
          name: "options.ai.maxTokens|max_tokens",
          description: "Maximum output tokens for the completion.",
          required: false,
          type: "integer",
        },
        {
          name: "options.ai.toolChoice|tool_choice",
          description: "Optional tool selection policy passed to the provider when MCP tools are available.",
          required: false,
          type: "string|object",
        },
        {
          name: "options.ai.headers",
          description: "Optional extra HTTP headers sent to the AI provider.",
          required: false,
          type: "object",
        },
        {
          name: "options.ai.organization",
          description: "Optional provider organization identifier.",
          required: false,
          type: "string",
        },
        {
          name: "options.ai.project",
          description: "Optional provider project identifier.",
          required: false,
          type: "string",
        },
        {
          name: "options.ai.timeout",
          description: "HTTP timeout in milliseconds for provider requests.",
          required: false,
          type: "integer",
          default: 60000,
        },
        {
          name: "options.prompts",
          description: "Prompt input. Accepts a string, an array of strings, or an array of chat messages like `{ role, content }`. Structured messages are preferred when system instructions or multi-turn context matter.",
          required: true,
          type: "string|array",
        },
        {
          name: "options.mcpServers",
          description: "Optional MCP server definitions. Each item can include `name`, `url`, `headers`, `timeout`, and `transportPriority`.",
          required: false,
          type: "array<object>",
          default: [],
        },
        {
          name: "options.mcpServers[].name",
          description: "Friendly MCP server name used in diagnostics and tool aliases.",
          required: false,
          type: "string",
        },
        {
          name: "options.mcpServers[].url",
          description: "HTTP endpoint of the MCP server. Required for each server entry.",
          required: true,
          type: "string",
        },
        {
          name: "options.mcpServers[].headers",
          description: "Optional headers for authenticating against the MCP server.",
          required: false,
          type: "object",
        },
        {
          name: "options.mcpServers[].timeout",
          description: "Optional timeout in milliseconds for fallback RPC requests.",
          required: false,
          type: "integer",
        },
        {
          name: "options.mcpServers[].transportPriority",
          description: "Optional ordered list of transport strategies, typically `['streamable-http', 'legacy-sse-http']`.",
          required: false,
          type: "array<string>",
        },
        {
          name: "options.maxToolRounds",
          description: "Maximum number of tool-execution rounds before forcing a final answer.",
          required: false,
          type: "integer",
          default: 6,
        },
        {
          name: "options.includeDiagnostics",
          description: "When true, returns execution metadata including tool calls, messages, and resolved MCP server info.",
          required: false,
          type: "boolean",
          default: false,
        },
        {
          name: "options.signal",
          description: "Optional AbortSignal used to cancel the provider request.",
          required: false,
          type: "AbortSignal",
        },
      ],
      return: {
        type: "string|object",
        description: "Returns the assistant text by default. When `includeDiagnostics` is true, returns an object with `text`, `provider`, `model`, `messages`, `tools`, `toolExecutions`, and `mcpServers`.",
      },
      notes: [
        "This helper is intended to be called from the JS handler. It is no longer tied to a dedicated handler.",
        "For local Ollama, a common config is `{ modelProvider: 'ollama', model: 'qwen2.5-coder:1.5b', baseUrl: 'http://localhost:11434', temperature: 0.1, timeout: 1800000 }`.",
        "If `baseUrl` is present and `apiKey` is omitted, the helper injects a placeholder key so local OpenAI-compatible servers can still be called.",
        "MCP tools are exposed to the model as OpenAI function tools. The helper will connect, list tools, execute tool calls, and continue the conversation until it reaches a final answer or the round limit.",
        "Prompt roles should normally be `system`, `user`, `assistant`, and the helper itself manages `tool` messages internally during tool rounds.",
        "For GET endpoints, prompt arrays usually arrive as a JSON string in `request.query.prompts`, so parse them before calling this helper.",
        "When the output looks inconsistent, enable `includeDiagnostics` and inspect `messages`, `tools`, and `toolExecutions` before assuming hidden state.",
      ],
      agentGuidance: [
        "Use this helper when the endpoint needs an AI response and may need tool access through one or more MCP servers.",
        "Prefer passing prompts as structured messages when system or multi-turn context matters.",
        "If MCP capabilities are unknown, call `listMcpTools` first and only then call `askIAWithMCP` with the chosen servers.",
        "For JS endpoints that rely on Application Variables, prefer `$_APP_VARS_['$_VAR_NAME']` in generated code because it is explicit and avoids scope-name ambiguity.",
        "If the task is informational, provide only read-only MCP servers or read-only tools when possible.",
      ],
      example: `
const result = await askIAWithMCP({
  ai: {
    modelProvider: 'ollama',
    model: 'qwen2.5-coder:1.5b',
    baseUrl: 'http://localhost:11434',
    temperature: 0.1,
    timeout: 1800000,
  },
  mcpServers: [
    {
      name: 'openfusion_system_remote_prd',
      url: 'https://example.com/api/system/mcp/server/prd',
    },
  ],
  prompts: [
    {
      role: 'user',
      content: 'List the available applications using MCP tools if needed.',
    },
  ],
  includeDiagnostics: true,
});

$_RETURN_DATA_ = result;
      `,
    },
    listMcpTools: {
      fn: request && reply ? listMcpTools : undefined,
      description: "Connects to one or more MCP servers and returns the discovered tools without running an AI conversation.",
      web: own_repo,
      params: [
        {
          name: "options.mcpServers",
          description: "List of MCP server definitions to inspect.",
          required: true,
          type: "array<object>",
        },
        {
          name: "options.clientName",
          description: "Optional MCP client name used during connection.",
          required: false,
          type: "string",
        },
        {
          name: "options.clientVersion",
          description: "Optional MCP client version used during connection.",
          required: false,
          type: "string",
        },
      ],
      return: "Array of MCP server descriptors with their resolved tool list.",
      notes: [
        "Use this for diagnostics, capability discovery, or to verify that a remote MCP server exposes the expected tools before calling askIAWithMCP.",
      ],
      example: `
const tools = await listMcpTools({
  mcpServers: [
    {
      name: 'openfusion_system_remote_prd',
      url: 'https://example.com/api/system/mcp/server/prd',
    },
  ],
});

$_RETURN_DATA_ = tools;
      `,
    },
    xlsx_style: {
      fn: request && reply ? xlsx_style : undefined,
      description: "Styled XLSX builder based on SheetJS, useful when the exported workbook needs fonts, fills, borders, or alignment.",
      web: "https://github.com/gitbrent/xlsx-js-style",
      notes: [
        "Prefer xlsx_style over xlsx when presentation matters in the generated spreadsheet.",
      ],
      example: `
const wb = xlsx_style.utils.book_new();

let row = [
	{ v: "Courier: 24", t: "s", s: { font: { name: "Courier", sz: 24 } } },
	{ v: "bold & color", t: "s", s: { font: { bold: true, color: { rgb: "FF0000" } } } },
	{ v: "fill: color", t: "s", s: { fill: { fgColor: { rgb: "E9E9E9" } } } },
	{ v: "line\nbreak", t: "s", s: { alignment: { wrapText: true } } },
];
const ws = xlsx_style.utils.aoa_to_sheet([row]);
xlsx_style.utils.book_append_sheet(wb, ws, "Styled Demo");

const buffer = xlsx_style.write(wb, { type: 'buffer', bookType: 'xlsx' });

$_CUSTOM_HEADERS_.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
$_CUSTOM_HEADERS_.set('Content-Disposition', 'attachment; filename="styled-demo.xlsx"');
$_RETURN_DATA_ = Buffer.from(buffer);
      `
    },
  };
};
