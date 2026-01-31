import crypto from "crypto";
import sequentialPromises from "@edwinspire/sequential-promises";
import mongoose from "mongoose";
import * as luxon from "luxon";
import * as sequelize from "sequelize";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import nodemailer from "nodemailer";
import * as xmlCrypto from "xml-crypto";
import * as xmldom from "xmldom";
import * as forge from "node-forge";
import * as uuid from "uuid";
import Zod, { array } from "zod";
import * as XLSX from "xlsx";
import {
  createImage as createImageFromHTML,
  createPDF as createPDFFromHTML,
} from "../server/pdf-generator.js";
import { isValidHttpStatusCode } from "../handler/utils.js";
import uFetch from "@edwinspire/universal-fetch";
import jwt from "jsonwebtoken";
import xmlFormatter from "xml-formatter";
import xml2js from "xml2js";
import dnsPromises from "dns/promises";

const { PORT, JWT_KEY } = process.env;

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
  constructor(environment, port = 3000, baseUrl = "http://localhost") {
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
    // replace es eficiente aquí, el regex busca solo al final ($)
    return path.replace(ENV_SUFFIX_REGEX, `/${this.environment}`);
  }
}

export const json_to_xlsx_buffer = (sheets = []) => {
  //let resultBuffer = null;
  // Paso 1: Crear un nuevo libro (workbook)
  const workbook = XLSX.utils.book_new();

  if (Array.isArray(sheets)) {
    for (let index = 0; index < sheets.length; index++) {
      const sheetInfo = sheets[index];
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
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = headerStyle;
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
    //compression: true,
  });
  return {
    buffer,
    ContentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
};

export const xlsx_body_to_json = async (request) => {
  let result = [];

  const contentType = request.headers["content-type"];

  // Identifica el tipo de dato que llega y extrae los valores
  if (contentType && contentType.includes("multipart/form-data")) {
    // Multipart (archivos, streams, etc)
    for (let name in request.body) {
      console.log("Processing body field:", name);
      let element = request.body[name];

      if (Array.isArray(element)) {
        // Es una lista de archivos con el mismo nombre
        console.log(`Field ${name} is an array with ${element.length} items.`);

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
        console.log(`Field ${name} is a file of type ${element.mimetype}.`);
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
    xmlFormatter: {
      fn: request && reply ? xmlFormatter : undefined,
      info: "Read documentationConverts XML into a human readable format (pretty print) while respecting the xml:space attribute. Reciprocally, the xml-formatter package can minify pretty printed XML.",
      web: "https://github.com/chrisbottin/xml-formatter",
      return: "",
    },
    xmldom: {
      fn: request && reply ? xmldom : undefined,
      info: "A JavaScript implementation of W3C DOM for Node.js, Rhino and the browser. Fully compatible with W3C DOM level2; and some compatible with level3.",
      web: "https://github.com/xmldom/xmldom",
      return: "Read documentation",
    },
    dnsPromises: {
      fn: request && reply ? dnsPromises : undefined,
      info: "The DNS module enables name resolution functions. It contains methods for performing DNS queries of various types, as well as utility functions for converting between IP addresses in text and binary forms.",
    },
    xml2js: {
      fn: request && reply ? xml2js : undefined,
      info: "Simple XML to JavaScript object converter. It supports bi-directional conversion.",
      web: "https://github.com/Leonidas-from-XIV/node-xml2js",
      return: "Read documentation",
    },
    forge: {
      fn: request && reply ? forge.default : undefined,
      info: "A native implementation of TLS (and various other cryptographic tools) in JavaScript.",
      web: "https://github.com/digitalbazaar/forge",
      return: "Read documentation",
    },
    json_to_xlsx_buffer: {
      fn: request && reply ? json_to_xlsx_buffer : undefined,
      info: "Converts an array of JSON objects to an XLSX buffer. Each object represents a sheet with its data.",
      web: own_repo,
      return: "Buffer with the XLSX file content and ContentType",
    },
    request_xlsx_body_to_json: {
      fn: request && reply ? xlsx_body_to_json : undefined,
      info: "Converts the body of a request to a JSON object. It supports multipart/form-data with Excel files.",
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
