import { createHmac, createHash } from "crypto";
import fs from "fs";
import path from "path";
import { Buffer } from "node:buffer";
import jwt from "jsonwebtoken";
import { internal_url_post_hooks } from "./utils_path.js"; //
import { v4 as uuidv4 } from "uuid";
import $_UFETCH_ from "@edwinspire/universal-fetch";
import $_SECUENTIAL_PROMISES_ from "@edwinspire/sequential-promises";
import mongoose from "mongoose";
import * as LUXON from "luxon";
import * as SEQUELIZE from "sequelize";
import Zod from "zod";
import * as $_PDFJS_ from "pdfjs-dist/legacy/build/pdf.mjs";
import * as XLSX from "xlsx";
import $_NODEMAILER_ from "nodemailer";
import {
  createImage as $_CREATE_IMAGE_FROM_HTML_,
  createPDF as $_CREATE_PDF_FROM_HTML,
} from "../server/pdf-generator.js";

import { isValidHttpStatusCode } from "../handler/utils.js";
const { PORT, PATH_API_HOOKS, JWT_KEY } = process.env;

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
    const fnUrlae = new URLAutoEnvironment("prd");
    const uF = fnUrlae.create(internal_url_post_hooks, false);

    let r = await uF.POST({ data: data });
    return await r.json();
  } catch (error) {
    console.error(error);
    return { error: "Error validating webhook data", data: error };
  }
}

export const getUUID = () => {
  return uuidv4();
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
  // TODO: Tambien buscar el Token en las cookies
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
  const fnUrlae = new URLAutoEnvironment(environment);
  const own_repo = "https://github.com/edwinspire/libOpenFusionAPI";
  return {
    $_SERVER_: {
      fn: reply ? reply?.openfusionapi?.server : undefined,
      info: "Current Server instance.",
      web: own_repo,
      return: "Server instance.",
    },
    $_TELEGRAM_: {
      fn: reply?.openfusionapi?.telegram
        ? reply.openfusionapi.telegram
        : undefined,
      info: "Useful Telegram features.",
      web: own_repo,
      methods: [
        {
          name: "sendMessage",
          params: [
            {
              name: "data",
              value: {
                chatId: "chatId",
                message: "Message to send",
                extra: {
                  message_thread_id: "Message thread id.",
                  parse_mode: "MarkdownV2",
                },
              },
              required: true,
            },
          ],
          return: "None",
        },
      ],
    },
    $_XLSX_BODY_TO_JSON_: {
      fn: xlsx_body_to_json,
      info: "Converts the body of a request to a JSON object. The body must be a buffer with any Excel files.",
      web: own_repo,
      return:
        "Array of objects with the data of each sheet of each Excel file.",
    },
    $_RETURN_DATA_: {
      fn: {},
      info: "Value or object that will be returned by the endpoint.",
      web: own_repo,
      return: "Any",
    },
    $_CUSTOM_HEADERS_: {
      fn: new Map(),
      info: "Custom headers to send in the reply.",
      web: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
      return: "Map object",
    },
    $_REPLY_: {
      fn: reply,
      info: "Fastify Reply. Is the object used to send a response to the client.",
      web: "https://fastify.dev/docs/latest/Reference/Reply/#introduction",
    },
    $_REQUEST_: {
      fn: request,
      info: "Fastify Request. Stores all information about the request",
      web: "https://fastify.dev/docs/latest/Reference/Request/",
    },
    $_UFETCH_: {
      fn: request && reply ? $_UFETCH_ : undefined,
      info: "Instance of the uFetch class. More information at universal-fetch",
      web: "https://github.com/edwinspire/universal-fetch",
    },
    $_SECUENTIAL_PROMISES_: {
      fn: request && reply ? $_SECUENTIAL_PROMISES_ : undefined,
      info: "PromiseSequence class. More information at sequential-promises.",
      web: "https://github.com/edwinspire/sequential-promises",
    },
    $_GEN_TOKEN_: {
      fn: request && reply ? GenToken : undefined,
      info: "Generate a Valid Token.",
      web: own_repo,
      params: [{ name: "data", value: "Data to JWT" }],
    },
    $_GET_INTERNAL_URL_: {
      fn: request && reply ? getInternalURL : undefined,
      info: "Create the absolute url that points to the internal path of the server.",
      web: own_repo,
      warn: "Discontinued. Replaced by $_FETCH_OFAPI_.",
      params: [{ name: "relative_path", info: "Relative path" }],
    },
    $_FETCH_OFAPI_: {
      fn: request && reply ? fetchOFAPI : undefined,
      info: "Build a uFetch intance.",
      web: own_repo,
      warn: "Discontinued. Use $_URL_AUTO_ENV_.",
    },
    $_URL_AUTO_ENV_: {
      fn: request && reply ? fnUrlae : undefined,
      info: 'Automatically change the environment of a relative URL. Replace the original environment prefix with the "auto" prefix to have it replaced by the current environment prefix. Use "create" method',
      web: own_repo,
      params: [
        {
          name: "url",
          info: 'Relative url to use with environment prefix "auto".',
          required: true,
          value_type: "string",
          default_value: "",
        },
        {
          name: "auto_env",
          info: "Apply auto environment.",
          required: false,
          value_type: "boolean",
          default_value: true,
        },
      ],
      return: "uFetch instance.",
    },
    $_MONGOOSE_: {
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
    $_LUXON_: {
      fn: request && reply ? LUXON : undefined,
      info: "Friendly wrapper for JavaScript dates and times",
      web: "https://moment.github.io/luxon",
    },
    $_PDFJS_: {
      fn: request && reply ? $_PDFJS_ : undefined,
      info: "PDF.js is a Portable Document Format (PDF) viewer that is built with HTML5.",
      web: "https://mozilla.github.io/pdf.js/",
    },

    $_CREATE_IMAGE_FROM_HTML_: {
      fn: request && reply ? $_CREATE_IMAGE_FROM_HTML_ : undefined,
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

    $_CREATE_PDF_FROM_HTML: {
      fn: request && reply ? $_CREATE_PDF_FROM_HTML : undefined,
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

    $_SEQUELIZE_: {
      fn: request && reply ? SEQUELIZE : undefined,
      info: "Sequelize is a modern TypeScript and Node.js ORM for Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more.",
      web: "https://sequelize.org/",
    },
    $_ZOD_: {
      fn: request && reply ? Zod : undefined,
      info: "Zod is a TypeScript-first schema declaration and validation library. ",
      web: "https://zod.dev/?id=introduction",
    },
    $_NODEMAILER_: {
      fn: request && reply ? $_NODEMAILER_ : undefined,
      info: "Nodemailer makes sending email from a Node.js application straightforward and secure, without pulling in a single runtime dependency.",
      web: "https://nodemailer.com/",
    },
    $_XLSX_: {
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

export const functionsVars = async (request, reply, environment) => {
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
  constructor(environment) {
    this.environment = environment;
  }

  create(url, auto_environment = true) {
    let new_url = isAbsoluteUrl(url) ? url : this.auto(url, auto_environment);
    return new $_UFETCH_(new_url);
  }

  auto(url, auto_environment = true) {
    return auto_environment ? this._autoEnvironment(url) : this._direct(url);
  }

  _auto(url, auto_environment = true) {
    return this.auto(url, auto_environment);
  }

  _direct(relative_path) {
    return `http://localhost:${PORT}${relative_path}`;
  }
  _autoEnvironment(relative_path) {
    // Reemplaza el ultimo segmento por this.environment cuando la ruta termine en auto o env
    return this._direct(
      relative_path.replace(/\/(auto|env)$/, `/${this.environment}`)
    );
  }
}

export const getInternalURL = (relative_path) => {
  console.warn("Decrepted getInternalURL!!!!!\n" + relative_path + "\n");
  return `http://localhost:${PORT}${relative_path}`;
};

export const fetchOFAPI = (url) => {
  url = isAbsoluteUrl(url) ? url : getInternalURL(url);

  return new $_UFETCH_(url);
};

const isAbsoluteUrl = (url) => {
  // Expresión regular para verificar si es una URL absoluta
  const absoluteUrlPattern = /^(?:[a-zA-Z]+:)?\/\//;

  // Si la URL coincide con el patrón, es absoluta
  return absoluteUrlPattern.test(url);
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
