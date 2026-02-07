import crypto from "crypto";
import PromiseSequence from "@edwinspire/sequential-promises";
import mongoose from "mongoose";
import * as luxon from "luxon";
import * as sequelize from "sequelize";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import nodemailer from "nodemailer";
import * as xmlCrypto from "xml-crypto";
import * as xmldom from "xmldom";
import * as forge from "node-forge";
import * as uuid from "uuid";
import Zod from "zod";
import * as XLSX from "xlsx";
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
  console.warn("WARNING: JWT_KEY is not defined. Using insecure fallback key.");
}
export const JWTKEY = JWT_KEY ?? 'oy8632rcv"$/8';

/**
 * @param {any} data
 */
export function GenToken(data, exp_seconds = 3600 /* 1 hora */) {
  const exp = Math.floor(Date.now() / 1000) + Number(exp_seconds);
  return jwt.sign({ data: { ...data, _rnd_: Math.random() }, exp }, JWTKEY);
}

export const jsException = (message, data, http_statusCode = 500) => {
  let status = isValidHttpStatusCode(http_statusCode) ? http_statusCode : 500;
  throw { message, data, date: new Date(), statusCode: status };
};

const ENV_SUFFIX_REGEX = /\/(auto|env)$/;

export class URLAutoEnvironment {
  /**
   * @param {string} environment - Entorno de destino (ej: 'prd', 'dev')
   * @param {number|string} port - Puerto para localhost
   * @param {string} baseUrl - Base opcional (por defecto localhost)
   */
  constructor(environment, port = default_port, baseUrl = "http://localhost") {
    this.environment = environment;
    this.base = `${baseUrl}:${port}`;
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
    // Si es absoluta, devolvemos uFetch directo
    if (this.isAbsoluteUrl(url)) {
      return new uFetch(url);
    }

    // Si es relativa, procesamos
    const finalPath = shouldApplyAuto ? this._applyEnvironment(url) : url;
    return new uFetch(this._buildFullUrl(finalPath));
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
        // - Los nombres de las propiedades (a, b) serán los encabezados de las columnas.
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
  const fnUrlae = new URLAutoEnvironment(environment, PORT);
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
      description: "This library provides convenient access to the OpenAI REST API from TypeScript or JavaScript.",
      web: "https://github.com/openai/openai-node",
      return: "Any functions or objects",
      example: `
const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const completion = await client.chat.completions.create({
  model: 'gpt-5.2',
  messages: [
    { role: 'developer', content: 'Talk like a pirate.' },
    { role: 'user', content: 'Are semicolons optional in JavaScript?' },
  ],
});

console.log(completion.choices[0].message.content);
$_RETURN_DATA_ = completion;
      `,
    },
    ofapi: {
      fn: request && reply ? ofapi : undefined,
      description: "Utilities and services of OpenFusionAPI. Contains server info, token generator, and exception thrower.",
      web: own_repo,
      return: "Any funtions or objects",
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
      description: "Read documentationConverts XML into a human readable format (pretty print) while respecting the xml:space attribute. Reciprocally, the xml-formatter package can minify pretty printed XML.",
      web: "https://github.com/chrisbottin/xml-formatter",
      return: "",
      example: `
const xml = '<root><child>Hello</child></root>';
const formattedXml = xmlFormatter.format(xml);
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
      description: "Converts an array of JSON objects to an XLSX buffer. Each object represents a sheet with its data.",
      web: own_repo,
      params: [
        {
          name: "data",
          info: "An object with the filename and an array of sheets. Each sheet is an object with a name and data. { filename: 'file', sheets: [{ sheet: Sheet1', data: [] }] }",
          type: "object",
        },
      ],
      return: "Buffer with the XLSX file content and ContentType",
      example: `
const data = {
  filename: 'file',
  sheets: [
    {
      sheet: 'Sheet1',
      data: [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ],
    },
  ],
};

$_CUSTOM_HEADERS_.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.xlsx"',
);

const buffer = json_to_xlsx_buffer(data);
$_RETURN_DATA_ = buffer;
      `,
    },
    request_xlsx_body_to_json: {
      fn: request && reply ? xlsx_body_to_json : undefined,
      description: "Converts the body of a request to a JSON object. It supports multipart/form-data with Excel files.",
      web: own_repo,
      return: "Array of objects with the data of each sheet of each Excel file.",
      example: `
      const data = await request_xlsx_body_to_json(request);
      $_RETURN_DATA_ = data;
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
      description: "Value or object that will be returned by the endpoint.",
      web: own_repo,
      return: "Any values",
      example: `
$_RETURN_DATA_ = { name: 'John', age: 30 };
      `,
    },
    $_CUSTOM_HEADERS_: {
      fn: new Map(),
      description: "Custom headers to send in the reply.",
      web: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
      return: "Map object with custom headers",
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
      description: "Fastify Reply. Is the object used to send a response to the client.",
      web: "https://fastify.dev/docs/latest/Reference/Reply/#introduction",
      return: "Fastify Reply object",
      example: `
reply.code(200).send({ name: 'John', age: 30 });
      `,
    },
    request: {
      fn: request && reply ? request : undefined,
      description: "Fastify Request. Stores all information about the request",
      web: "https://fastify.dev/docs/latest/Reference/Request/",
      return: "Fastify Request object",
      example: `
const data = request.body;
$_RETURN_DATA_ = data;
      `,
    },
    uFetch: {
      fn: request && reply ? uFetch : undefined,
      description: "Instance of the uFetch class. More information at universal-fetch",
      web: own_repo,
      return: "uFetch instance",
      example: `
const req1  = await uFetch('https://jsonplaceholder.typicode.com/todos/1');
const resp = await req1.json();
$_RETURN_DATA_ = resp;
      `,
    },
    uFetchAutoEnv: {
      fn: request && reply ? fnUrlae : undefined,
      description: `Create an instance of uFetch. The "auto" method receives the URL as a parameter; if this URL ends in "auto", this function will automatically replace it with the environment in which it is running.`,
      web: "https://github.com/edwinspire/universal-fetch",
      example: `
const uF = uFetchAutoEnv.auto('https://jsonplaceholder.typicode.com/todos/auto', true);
const req1  = await uF.GET();
const resp = await req1.json();
$_RETURN_DATA_ = resp;
      `,
    },
    PromiseSequence: {
      fn: request && reply ? PromiseSequence : undefined,
      description: "PromiseSequence class. More information at sequential-promises.",
      web: "https://github.com/edwinspire/sequential-promises",
      example: `

// Función de ejemplo que simula una tarea costosa
function processBlock(block) {

  return new Promise((resolve) => {

    setTimeout(() => {

      console.log('Block: ', block);
      resolve({ data: block * 2 });
    }, 2500
    + (Math.floor(Math.random() * 1000) + 1)
    );
  });
}

// Lista de datos que queremos procesar
const data = Array.from({ length: 20 }, (_, i) => i + 1); // Genera una matriz de números del 1 al 20

// Número de bloques en los que deseamos dividir los datos
const numeroItems = 10;

let result = await PromiseSequence.ByItems(processBlock, numeroItems, data);
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
      description: " Mongoose provides a straight-forward, schema-based solution to model your MongoDB.",
      web: "https://mongoosejs.com",
      example: `
mongoose.connect('mongodb://127.0.0.1:27017/test');

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
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
      description: "PDF.js is a Portable Document Format (PDF) viewer that is built with HTML5.",
      web: "https://mozilla.github.io/pdf.js/",
      example: `
      
      `
    },

    createImageFromHTML: {
      fn: request && reply ? createImageFromHTML : undefined,
      description: "Create a Image from HTML code or URL",
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
      example: `

      $_CUSTOM_HEADERS_.set("Content-Type", "image/png");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.png"',
);

      const image = await createImageFromHTML("https://example.com/image.html");
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
      example: `
      $_CUSTOM_HEADERS_.set("Content-Type", "application/pdf");
$_CUSTOM_HEADERS_.set(
  "Content-Disposition",
  'attachment; filename="file.pdf"',
);
      const pdf = await createPDFFromHTML("https://example.com/mypage.html");
      $_
      $_RETURN_DATA_ = pdf;
      `,
    },

    sequelize: {
      fn: request && reply ? sequelize : undefined,
      description: "Sequelize is a modern TypeScript and Node.js ORM for Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more.",
      web: "https://sequelize.org/",
      example: `
// Crear conexión a SQLite en memoria
const seq = new sequelize.Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

  try {
    // Probar conexión
    await seq.authenticate();
    console.log("Conectado a SQLite en memoria.");

    // (Opcional) Crear tabla y datos de ejemplo
    await seq.query("CREATE TABLE users (iduser INTEGER PRIMARY KEY, name TEXT, email TEXT);");

    await seq.query("INSERT INTO users (iduser, name, email) VALUES (1, 'Juan', 'juan@mail.com'), (2, 'Ana', 'ana@mail.com');");

    // Query con parámetro
    const sql = "SELECT * FROM users WHERE iduser = $iduser";

    const result = await seq.query(sql, {
      bind: { iduser: 1 },
      type: QueryTypes.SELECT,
    });

    //console.log("Resultado:", result);

    $_RETURN_DATA_ = result;

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await seq.close();
  }

      `
    },
    z: {
      fn: request && reply ? Zod : undefined,
      description: "Zod is a TypeScript-first schema declaration and validation library. ",
      web: "https://zod.dev/?id=introduction",
      example: `
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });
      const data = { name: "John", age: 30 };
      const result = schema.parse(data);
      $_RETURN_DATA_ = result;
      `
    },
    nodemailer: {
      fn: request && reply ? nodemailer : undefined,
      description: "Nodemailer makes sending email from a Node.js application straightforward and secure, without pulling in a single runtime dependency.",
      web: "https://nodemailer.com/",
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
      example: `
  /* fetch JSON data and parse */
  const url = "https://docs.sheetjs.com/executive.json";
  const raw_data = await (await fetch(url)).json();

  /* filter for the Presidents */
  const prez = raw_data.filter(row => row.terms.some(term => term.type === "prez"));

  /* sort by first presidential term */
  prez.forEach(row => row.start = row.terms.find(term => term.type === "prez").start);
  prez.sort((l,r) => l.start.localeCompare(r.start));

  /* flatten objects */
  const rows = prez.map(row => ({
    name: row.name.first + " " + row.name.last,
    birthday: row.bio.birthday
  }));

  /* generate worksheet and workbook */
  const worksheet = xlsx.utils.json_to_sheet(rows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Dates");

  /* fix headers */
  xlsx.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });

  /* calculate column width */
  const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
  worksheet["!cols"] = [ { wch: max_width } ];

      `
    },
  };
};
