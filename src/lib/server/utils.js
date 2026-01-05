import { createHmac, createHash, randomUUID } from "crypto";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Buffer } from "node:buffer";
import jwt from "jsonwebtoken";
import { internal_url_post_hooks } from "./utils_path.js"; //
//import { v4 as uuidv4 } from "uuid";
import * as uuid from "uuid";
import uFetch from "@edwinspire/universal-fetch";
import sequentialPromises from "@edwinspire/sequential-promises";
import mongoose from "mongoose";
import * as luxon from "luxon";
import * as sequelize from "sequelize";
import Zod from "zod";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import * as XLSX from "xlsx";
import nodemailer from "nodemailer";
import * as xmlCrypto from "xml-crypto";
import * as xmldom from "xmldom";
import * as forge from "node-forge";
import {
  createImage as createImageFromHTML,
  createPDF as createPDFFromHTML,
} from "../server/pdf-generator.js";

import { isValidHttpStatusCode } from "../handler/utils.js";

const { PORT, PATH_API_HOOKS, JWT_KEY } = process.env;
// Pre-compilamos el Regex fuera para mejorar el rendimiento en llamadas frecuentes
const ENV_SUFFIX_REGEX = /\/(auto|env)$/;
const errors = {
  1: { code: 1, message: "You must enter the same password twice" },
  2: { code: 2, message: "Invalid credentials" },
};

const jwtKey = JWT_KEY ?? 'oy8632rcv"$/8';

// Definimos el esquema
export const webhookSchema = Zod.object({
  host: Zod.string().min(1, { message: "Host is required." }),
  database: Zod.string().min(1, { message: "Database is required." }),
  schema: Zod.string().min(0, { message: "Schema is required." }),
  model: Zod.string().min(1, { message: "Model is required." }),
  action: Zod.enum(
    ["insert", "update", "delete", "upsert", "afterUpsert", "afterCreate"],
    {
      message:
        "Valid options: 'insert', 'update', 'delete', 'bulk_insert', 'bulk_update', 'upsert'",
    }
  ),
  data: Zod.record(Zod.any()).optional(), // Puede ser un objeto vacío o contener datos dinámicos
});
// Función para obtener los datos según el método
export const getRequestData = (request) => {
  const method = request.method.toUpperCase();

  switch (method) {
    case "GET":
    case "DELETE":
      return request.query;
    case "POST":
    case "PUT":
    case "PATCH":
      return request.body;
    case "OPTIONS":
      return {}; // Normalmente no lleva datos
    default:
      return {}; // Fallback para métodos no esperados
  }
};

export async function emitHook(data) {
  try {
    const fnUrlae = new URLAutoEnvironment("prd", PORT);
    const uF = fnUrlae.create(internal_url_post_hooks, false);

    let r = await uF.POST({ data: data });
    return await r.json();
  } catch (error) {
    console.error(error);
    return { error: "Error validating webhook data", data: error };
  }
}

export const getUUID = () => {
  return uuid.v4();
};

export function getIPFromRequest(req) {
  const ip =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // Puedes manipular la IP según tus necesidades
  return ip;
}

/**
 * @param {string} token
 */
export function checkToken(token) {
  if (token) {
    try {
      // Verificar y decodificar el token
      const decodedToken = tokenVerify(token);

      if (decodedToken && decodedToken.data) {
        return decodedToken.data;
      }

      return false;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
}

// Middleware para validar el token de usuario del systema (Administradores de endpoints)
/**
 * @param {any} req
 * @param { any } res
 * @param {() => void} next
 */
export function ___validateSystemToken(req, res, next) {
  req.headers["data-token"] = ""; // Vacia los datos que llegan en el token
  let dataAuth = getUserPasswordTokenFromRequest(req);

  // Verificar si se proporcionó un token
  if (!dataAuth.token) {
    return res.status(401).json({ error: "Token not found" });
  }

  let data = checkToken(dataAuth.token);

  if (data) {
    if (data.for == "user") {
      req.headers["data-token"] = JSON.stringify(data); // setea los datos del token para usarlo posteriormente
      next();
    } else {
      return res.status(401).json({ error: "Incorrect token" });
    }
  } else {
    return res.status(401).json({ error: "Token invalid" });
  }
}

/**
 * @param {number} code
 * @param {string | any | undefined} [message]
 */
export function customError(code, message) {
  if (errors[code]) {
    let e = { ...errors[code] };
    e.message = message && message.length > 0 ? message : e.message;
    return e;
  } else {
    return { errors: code, message: message };
  }
}

export function CreateRandomPassword(prefix = "rp") {
  const password = prefix + "_" + randomUUID();
  return { password, encrypted: EncryptPwd(password) };
}

/**
 * @param {import("crypto").BinaryLike} pwd
 */
export function EncryptPwd(pwd) {
  return createHmac("sha256", jwtKey).update(pwd).digest("hex");
}

/**
 * @param {any} data
 */
export function GenToken(data, exp_seconds = 3600 /* 1 hora */) {
  const exp = Math.floor(Date.now() / 1000) + Number(exp_seconds);
  return jwt.sign({ data: { ...data, _rnd_: Math.random() }, exp }, jwtKey);
}

/**
 * @param {any} token
 */
export function tokenVerify(token) {
  return jwt.verify(token, jwtKey);
}

/**
 * @param {any} req
 */
export function getUserPasswordTokenFromRequest(req) {
  const authHeader = req.headers?.authorization;
  let username, token, password, data_token;

  if (authHeader?.startsWith("Basic ")) {
    const encoded = authHeader.split(" ")[1] ?? "";
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const idx = decoded.indexOf(":");
    if (idx >= 0) {
      username = decoded.slice(0, idx);
      password = decoded.slice(idx + 1);
    } else {
      username = decoded;
      password = undefined;
    }
  } else if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    try {
      data_token = checkToken(token);
    } catch (e) {
      data_token = null;
    }
  } else {
    // Buscamos en las cookies como ultima alterntiva
    try {
      let token = req.cookies.OFAPI_TOKEN;
      data_token = checkToken(token);
    } catch (e) {
      data_token = null;
    }
  }

  return { Basic: { username, password }, Bearer: { token, data: data_token } };
}

/**
 * @param {any} socket
 */
export function websocketUnauthorized(socket) {
  // Si el cliente no está autenticado, responder con un error 401 Unauthorized
  socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  socket.destroy();
}

/**
 * @param {any} app
 * @param {any} endpointData
 * @param {any} jwtoken
 */
export function checkAPIToken(app, endpointData, jwtoken) {
  //
  try {
    let data = tokenVerify(jwtoken);

    console.log("::::::> checkAPIToken ::: > ", data, endpointData);

    if (data && data.app && data.env) {
      // Verificar que el app corresponda a la data que está en el jwtoken

      return data.app == app && data.env == endpointData.env;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * @param {string} path_file
 */
function getPathParts(path_file) {
  const normalized = path.normalize(path_file);
  const parts = normalized.split(path.sep);
  const last = parts.slice(-3);
  return {
    appName: last[0],
    environment: last[1],
    file: last[2],
  };
}

/**
 * @param {string} fn_path
 */
export const getFunctionsFiles = (fn_path) => {
  /**
   * @type {string[]}
   */
  const jsFiles = [];

  /**
   * @param {string} ruta
   */
  function searchFiles(ruta) {
    const archivos = fs.readdirSync(ruta);

    archivos.forEach((archivo) => {
      const rutaCompleta = path.join(ruta, archivo);

      if (fs.statSync(rutaCompleta).isDirectory()) {
        // Si es un directorio, busca en él de forma recursiva
        searchFiles(rutaCompleta);
      } else {
        // Si es un archivo con extensión .js, agrégalo a la lista
        if (path.extname(archivo) === ".js") {
          jsFiles.push(rutaCompleta);
        }
      }
    });
  }

  searchFiles(fn_path);

  return jsFiles.map((f) => {
    return { file: f, data: getPathParts(f) };
  });
};

export const md5 = (/** @type {any} */ data) => {
  const hash = createHash("md5");
  hash.update(typeof data !== "string" ? JSON.stringify(data) : data);
  return hash.digest("hex");
};

// Une dos objetos json, los valores de obj2 sobreescriben los valores de obj1
export const mergeObjects = (obj1, obj2) => {
  const merged = { ...obj1 };

  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        typeof obj2[key] === "object" &&
        obj2[key] !== null &&
        !Array.isArray(obj2[key])
      ) {
        if (
          typeof obj1[key] === "object" &&
          obj1[key] !== null &&
          !Array.isArray(obj1[key])
        ) {
          merged[key] = mergeObjects(obj1[key], obj2[key]);
        } else {
          merged[key] = obj2[key];
        }
      } else {
        merged[key] = obj2[key];
      }
    }
  }
  //console.log('\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>', obj1, obj2, merged);
  return merged;
};

export const jsException = (message, data, http_statusCode = 500) => {
  let status = isValidHttpStatusCode(http_statusCode) ? http_statusCode : 500;
  throw { message, data, date: new Date(), statusCode: status };
};

export const listFunctionsVars = (request, reply, environment) => {
  const fnUrlae = new URLAutoEnvironment(environment, PORT);
  const own_repo = "https://github.com/edwinspire/libOpenFusionAPI";

  const ofapi = {
    server: reply ? reply?.openfusionapi?.server : undefined,
    telegram: reply?.openfusionapi?.telegram
      ? reply.openfusionapi.telegram
      : undefined,
    genToken: request && reply ? GenToken : undefined,

    throw: (message, http_statusCode = 500, data = null) => {
      let status = isValidHttpStatusCode(http_statusCode)
        ? http_statusCode
        : 500;
      throw { message, data, date: new Date(), statusCode: status };
    },
  };

  return {
    ofapi: {
      fn: request && reply ? ofapi : undefined,
      info: "Utilities and services of OpenFusionAPI. Contains server info, telegram bot, token generator, and exception thrower.",
      web: own_repo,
      return: "Any funtions or objects",
    },
    xmlCrypto: {
      fn: request && reply ? xmlCrypto : undefined,
      info: "It is a Node.js package that allows working with XML digital signatures, facilitating the signing and verification of XML documents using the XML Signature specification, ideal for applications that handle security and data validation in this format, using private and public keys.",
      web: "https://github.com/node-saml/xml-crypto",
      return: "Read documentation",
    },
    xmldom: {
      fn: request && reply ? xmldom : undefined,
      info: "A JavaScript implementation of W3C DOM for Node.js, Rhino and the browser. Fully compatible with W3C DOM level2; and some compatible with level3.",
      web: "https://github.com/xmldom/xmldom",
      return: "Read documentation",
    },
    forge: {
      fn: request && reply ? forge.default : undefined,
      info: "A native implementation of TLS (and various other cryptographic tools) in JavaScript.",
      web: "https://github.com/digitalbazaar/forge",
      return: "Read documentation",
    },
    request_xlsx_body_to_json: {
      fn: request && reply ? xlsx_body_to_json : undefined,
      info: "Converts the body of a request to a JSON object. The body must be a buffer with any Excel files.",
      web: own_repo,
      return:
        "Array of objects with the data of each sheet of each Excel file.",
    },
    crypto: {
      fn: request && reply ? crypto : undefined,
      info: "Node.js crypto module",
      web: "https://nodejs.org/api/crypto.html",
    },
    $_RETURN_DATA_: {
      fn: {},
      info: "Value or object that will be returned by the endpoint.",
      web: own_repo,
      return: "data and headers",
    },
    $_CUSTOM_HEADERS_: {
      fn: new Map(),
      info: "Custom headers to send in the reply.",
      web: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
      return: "Map object",
    },
    reply: {
      fn: request && reply ? reply : undefined,
      info: "Fastify Reply. Is the object used to send a response to the client.",
      web: "https://fastify.dev/docs/latest/Reference/Reply/#introduction",
    },
    request: {
      fn: request && reply ? request : undefined,
      info: "Fastify Request. Stores all information about the request",
      web: "https://fastify.dev/docs/latest/Reference/Request/",
    },
    uFetch: {
      fn: request && reply ? uFetch : undefined,
      info: "Instance of the uFetch class. More information at universal-fetch",
      web: own_repo,
    },
    uFetchAutoEnv: {
      fn: request && reply ? fnUrlae : undefined,
      info: `Create an instance of uFetch. The "auto" method receives the URL as a parameter; if this URL ends in "auto", this function will automatically replace it with the environment in which it is running.`,
      web: "https://github.com/edwinspire/universal-fetch",
    },
    sequentialPromises: {
      fn: request && reply ? sequentialPromises : undefined,
      info: "PromiseSequence class. More information at sequential-promises.",
      web: "https://github.com/edwinspire/sequential-promises",
    },
    uuid: {
      fn: request && reply ? uuid : undefined,
      info: "UUID package to generate RFC4122 UUIDs.",
      web: "https://www.npmjs.com/package/uuid",
    },
    mongoose: {
      fn: request && reply ? mongoose : undefined,
      info: " Mongoose provides a straight-forward, schema-based solution to model your MongoDB.",
      web: "https://mongoosejs.com",
    },
    $_EXCEPTION_: {
      fn: request && reply ? jsException : undefined,
      info: "It interrupts the program flow and throws an exception",
      web: own_repo,
      params: [
        {
          name: "message",
          info: "The message that will be shown to the user.",
          required: true,
          value_type: "string",
          default_value: "",
        },
        {
          name: "data",
          info: "An object of additional data to be sent to the user",
          required: false,
          value_type: "any",
          default_value: "",
        },
        {
          name: "statusCode",
          info: "HTTP Status Code with which the request will be responded to.",
          required: false,
          value_type: "int",
          default_value: 500,
        },
      ],
      return: {
        value_type: "void",
        info: "throw - Stops the execution of the program and returns a oject.",
        object: [
          {
            name: "message",
            info: "The message that will be shown to the user.",
            value_type: "string",
          },
          {
            name: "data",
            info: "An object of additional data to be sent to the user",
            required: false,
            value_type: "any",
            default_value: "",
          },
          {
            name: "statusCode",
            info: "HTTP Status Code with which the request will be responded to.",
            required: false,
            value_type: "",
            default_value: 500,
          },
        ],
      },
      example: `$_EXCEPTION_('A parameter has not been entered', $_REQUEST_.body, 400);`,
    },
    jwt: {
      fn: request && reply ? jwt : undefined,
      info: "An implementation of JSON Web Tokens.",
      web: "https://github.com/auth0/node-jsonwebtoken",
    },
    luxon: {
      fn: request && reply ? luxon : undefined,
      info: "Friendly wrapper for JavaScript dates and times",
      web: "https://moment.github.io/luxon",
    },
    pdfjs: {
      fn: request && reply ? pdfjs : undefined,
      info: "PDF.js is a Portable Document Format (PDF) viewer that is built with HTML5.",
      web: "https://mozilla.github.io/pdf.js/",
    },

    createImageFromHTML: {
      fn: request && reply ? createImageFromHTML : undefined,
      info: "Create a Image from HTML code or URL",
      web: own_repo,
      params: [
        {
          name: "html",
          info: "String HTML",
          required: false,
          value_type: "string",
          default_value: "",
        },
        {
          name: "url",
          info: "URL resource",
          required: false,
          value_type: "string",
          default_value: "",
        },
        {
          name: "type",
          info: "Output type",
          required: false,
          value_type: "string",
          default_value: "png",
        },
        {
          name: "quality",
          info: "quality",
          required: false,
          value_type: "integer",
          default_value: 90,
        },
        {
          name: "fullPage",
          info: "fullPage",
          required: false,
          value_type: "boolean",
          default_value: true,
        },
      ],
      return: "NodeJS.ArrayBufferView",
    },

    createPDFFromHTML: {
      fn: request && reply ? createPDFFromHTML : undefined,
      info: "Create a PDF from HTML code or URL",
      web: own_repo,
      params: [
        {
          name: "html",
          info: "String HTML",
          required: false,
          value_type: "string",
          default_value: "",
        },
        {
          name: "url",
          info: "URL resource",
          required: false,
          value_type: "string",
          default_value: "",
        },
        {
          name: "format",
          info: "Output format",
          required: false,
          value_type: "string",
          default_value: "A4",
        },
        {
          name: "landscape",
          info: "landscape",
          required: false,
          value_type: "boolean",
          default_value: false,
        },
        {
          name: "margin",
          info: "margin on milimeters",
          required: false,
          value_type: "string",
          default_value: "10mm",
        },
        {
          name: "printBackground",
          info: "print Background",
          required: false,
          value_type: "boolean",
          default_value: true,
        },
      ],

      return: "NodeJS.ArrayBufferView",
    },

    sequelize: {
      fn: request && reply ? sequelize : undefined,
      info: "Sequelize is a modern TypeScript and Node.js ORM for Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more.",
      web: "https://sequelize.org/",
    },
    z: {
      fn: request && reply ? Zod : undefined,
      info: "Zod is a TypeScript-first schema declaration and validation library. ",
      web: "https://zod.dev/?id=introduction",
    },
    nodemailer: {
      fn: request && reply ? nodemailer : undefined,
      info: "Nodemailer makes sending email from a Node.js application straightforward and secure, without pulling in a single runtime dependency.",
      web: "https://nodemailer.com/",
    },
    xlsx: {
      fn: request && reply ? XLSX : undefined,
      info: "SheetJS Community Edition offers battle-tested open-source solutions for extracting useful data from almost any complex spreadsheet and generating new spreadsheets that will work with legacy and modern software alike.",
      web: "https://docs.sheetjs.com/docs/",
    },
  };
};

export const xlsx_body_to_json = (request_body) => {
  let result = [];
  //let workbook;
  // Detectar
  if (request_body) {
    for (let name in request_body) {
      let element = request_body[name];

      // Detectar si el elemento es un buffer
      if (Buffer.isBuffer(element)) {
        //let workbook = XLSX.read(element);
        let workbook = XLSX.read(element, { type: "buffer" });

        let sheet_names = workbook.SheetNames;
        let sheets = [];
        for (let index = 0; index < sheet_names.length; index++) {
          let sheet_name = sheet_names[index];
          const worksheet = workbook.Sheets[sheet_name];
          let out_json = XLSX.utils.sheet_to_json(worksheet, {
            header: 0,
            raw: false,
          });
          sheets.push({ sheet: sheet_name, data: out_json });
        }

        result.push({ file: name, sheets: sheets });
      }
    }
  }

  return result;
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

export const createFunction = async (
  /** @type {string} */ code,
  /** @type {string} */ app_vars
) => {
  let app_vars_string = "";
  // TODO: la variable app_vars no se la debería usar ya que al crear el codigo de la función ya se reemplaza el nombre de la variable por el valor que se la ha asignado.
  let fn = new Function("$_VARS_", "throw new Error('No code to execute');");

  try {
    let vars = Object.keys(await functionsVars()).join(", ");

    let codefunction = `
return async()=>{
  ${app_vars_string}  
  let {${vars}} = $_VARS_;
  
  ${code}
  return {data: $_RETURN_DATA_, headers: $_CUSTOM_HEADERS_};  
}
`;

    fn = new Function("$_VARS_", codefunction);
  } catch (error) {
    fn = new Function("", "throw new Error('Error creating function');");
  }

  return fn;
};

export class URLAutoEnvironment {
  /**
   * @param {string} environment - Entorno de destino (ej: 'prd', 'dev')
   * @param {number|string} port - Puerto para localhost
   * @param {string} baseUrl - Base opcional (por defecto localhost)
   */
  constructor(environment, port = 3000, baseUrl = "http://localhost") {
    this.environment = environment;
    this.base = `${baseUrl}:${port}`;
  }

  /**
   * Punto de entrada principal
   */
  create(url, shouldApplyAuto = true) {
    // Si es absoluta, devolvemos uFetch directo
    if (isAbsoluteUrl(url)) {
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
    // replace es eficiente aquí, el regex busca solo al final ($)
    return path.replace(ENV_SUFFIX_REGEX, `/${this.environment}`);
  }
}

export const getInternalURL = (relative_path) => {
  console.warn("Decrepted getInternalURL!!!!!\n" + relative_path + "\n");
  return `http://localhost:${PORT}${relative_path}`;
};

export const fetchOFAPI = (url) => {
  url = isAbsoluteUrl(url) ? url : getInternalURL(url);

  return new uFetch(url);
};

const isAbsoluteUrl = (url) => {
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

export /**
 * Devuelve el método de parsing sugerido basado en el Content-Type.
 * @param {string} contentType
 * @returns {"json" | "text" | "blob" | "urlencoded" | "raw"}
 */
function getParseMethod(contentType = "") {
  // Elimina cualquier parámetro como charset, boundary, etc.
  const mimeType = contentType.split(";")[0].trim().toLowerCase();

  if (mimeType === "application/json") {
    return "json";
  }

  if (mimeType.startsWith("text/")) {
    return "text";
  }

  if (
    mimeType === "application/octet-stream" ||
    mimeType === "application/pdf"
  ) {
    return "blob";
  }

  if (mimeType === "application/x-www-form-urlencoded") {
    return "urlencoded";
  }

  if (mimeType === "multipart/form-data") {
    return "raw"; // requiere plugin multipart
  }

  if (
    mimeType.startsWith("image/") ||
    mimeType.startsWith("audio/") ||
    mimeType.startsWith("video/")
  ) {
    return "blob";
  }

  return "text"; // Fallback genérico
}

// Función que valida el input para permitir solo letras y números
export const validateAppName = (name) => {
  // Expresión regular que permite:
  // - Letras (a-z, A-Z)
  // - Números (0-9)
  // - Caracteres especiales permitidos: - _ . ~
  // - No permite espacios, caracteres especiales no permitidos, ni caracteres no imprimibles
  const regex = /^[a-zA-Z0-9_~.-]+$/;
  return regex.test(name);
};

export const CreateOpenFusionAPIToken = () => {
  // Obtener un token interno para el acceso a los endpoints protegidos
  const token = GenToken(
    {
      admin: {
        username: "openfusionapi",
        first_name: "openfusionapi",
        last_name: "openfusionapi",
        ip: "127.0.0.0",
        enabled: true,
        ctrl: {
          as_admin: true,
        },
      },
    },
    60 * 60 * 24 * 365
  ); // Valido por un año
  process.env.USER_OPENFUSIONAPI_TOKEN = token;
};
