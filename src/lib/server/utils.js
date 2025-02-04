//const { createHmac } = await import('node:crypto');
import { createHmac, createHash } from "crypto";
import fs from "fs";
import path from "path";
import { Buffer } from "node:buffer";
import jwt from "jsonwebtoken";
import uFetch from "@edwinspire/universal-fetch";
import { internal_url_post_hooks } from "./utils_path.js"; //
import { v4 as uuidv4 } from "uuid";
import $_UFETCH_ from "@edwinspire/universal-fetch";
import $_SECUENTIAL_PROMISES_ from "@edwinspire/sequential-promises";
import mongoose from "mongoose";
import * as LUXON from "luxon";
import * as SEQUELIZE from "sequelize";

const { PORT, PATH_API_HOOKS, JWT_KEY } = process.env;

const errors = {
  1: { code: 1, message: "You must enter the same password twice" },
  2: { code: 2, message: "Invalid credentials" },
};

const jwtKey = JWT_KEY || 'oy8632rcv"$/8';

/**
 * @param {any} data
 */
export async function emitHook(data) {
  //	console.log('---------------------> hookUpsert', modelName);
  const urlHooks = "http://localhost:" + PORT + internal_url_post_hooks;
  const uF = new uFetch(urlHooks);
  let r = await uF.POST({ data: data });
  await r.json();
  //console.log("::::::::::>> emitHook :::>", urlHooks, data, await r.json());
}

export const getUUID = () => {
  return uuidv4();
};

/**
 * @param {import("express-serve-static-core").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>} req
 */
export function getIPFromRequest(req) {
  const ip =
    // @ts-ignore
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    // @ts-ignore
    req.socket.remoteAddress ||
    // @ts-ignore
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

    // @ts-ignore
    if (decodedToken && decodedToken.data) {
      // @ts-ignore
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
  // @ts-ignore
  if (errors[code]) {
    // @ts-ignore
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
export function GenToken(
  data,
  exp_seconds = Math.floor(Date.now() / 1000) + 60 * 60
) {
  console.log("GenToken > ", data);
  let exp = Math.floor(Date.now() / 1000) + exp_seconds;
  // Genera un Token
  return jwt.sign(
    {
      data: {
        ...data,
        _rnd_: (Math.random() * (100 - 0.01) + 0.01).toFixed(2),
      },
      exp: Number(exp),
    },
    jwtKey
  );
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
  const authHeader = req.headers.authorization;

  let username, token, password, data_token;

  if (authHeader && authHeader.startsWith("Basic")) {
    const encodedCredentials = authHeader.split(" ")[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      "base64"
    ).toString("utf-8");
    [username, password] = decodedCredentials.split(":");
  } else if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    data_token = checkToken(token);
  }

  return {
    Basic: { username: username, password: password },
    Bearer: { token: token, data: data_token },
  };
}

/**
 * @param {any} socket
 */
export function websocketUnauthorized(socket) {
  // Si el cliente no está autenticado, responder con un error 401 Unauthorized
  socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  socket.destroy();
}

export function createAPIKey() {
  const caracteres =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@-|#/=¿.!:*$&";
  let cadena = "";
  while (cadena.length < 50) {
    const caracterAleatorio =
      caracteres[Math.floor(Math.random() * caracteres.length)];
    if (cadena.indexOf(caracterAleatorio) === -1) {
      cadena += caracterAleatorio;
    }
  }
  return cadena;
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

    // @ts-ignore
    if (data && data.app && data.env) {
      // Verificar que el app corresponda a la data que está en el jwtoken
      // @ts-ignore
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
  const part = path_file.split("/");
  const last_parts = part.slice(-3);
  //return last_parts;
  return {
    appName: last_parts[0],
    environment: last_parts[1],
    file: last_parts[2],
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

export const roughSizeOfMap = (map, visited = new Set()) => {
  let bytes = 0;

  function sizeOf(value) {
    if (value === null || value === undefined) {
      return 0;
    }

    switch (typeof value) {
      case "number":
        return 8;
      case "string":
        return value.length * 2;
      case "boolean":
        return 4;
      case "object":
        if (visited.has(value)) {
          return 0;
        }
        visited.add(value);

        let objectBytes = 0;
        if (Array.isArray(value)) {
          value.forEach((element) => {
            objectBytes += sizeOf(element);
          });
        } else {
          for (const key in value) {
            if (Object.hasOwnProperty.call(value, key)) {
              objectBytes += sizeOf(key);
              objectBytes += sizeOf(value[key]);
            }
          }
        }
        return objectBytes;
      default:
        return 0;
    }
  }

  for (let [key, value] of map) {
    bytes += sizeOf(key);
    bytes += sizeOf(value);
  }

  return bytes;
};

export const jsException = (message, data, http_statusCode = 500) => {
  let status = isValidHttpStatusCode(http_statusCode) ? http_statusCode : 500;
  throw { message, data, date: new Date(), statusCode: status };
};

export const functionsVars = (request, reply, environment) => {
  const BuildInternalURL = new InternalURL(environment);

  return {
    $_REPLY_: reply,
    $_REQUEST_: request,
    $_UFETCH_: $_UFETCH_,
    $_SECUENTIAL_PROMISES_: $_SECUENTIAL_PROMISES_,
    $_GEN_TOKEN_: GenToken,
    $_GET_INTERNAL_URL_: getInternalURL,
    $_FETCH_OFAPI_: fetchOFAPI,
    $_MONGOOSE_: mongoose,
    $_EXCEPTION_: jsException,
    $_LUXON_: LUXON,
    $_SEQUELIZE_: SEQUELIZE,
    $_BUILD_INTERNAL_URL: BuildInternalURL,
  };
};

export const createFunction = (
  /** @type {string} */ code,
  /** @type {string} */ app_vars
) => {
  let app_vars_string = "";

  let fn = new Function("$_VARS_", "throw new Error('No code to execute');");

  try {
    if (app_vars && typeof app_vars === "object") {
      app_vars_string = `const $_VARS_APP = ${JSON.stringify(
        app_vars,
        null,
        2
      )}`;
    }

    let vars = Object.keys(functionsVars(true, true, true)).join(", ");

    let codefunction = `
return async()=>{
  ${app_vars_string}  
  const {${vars}} = $_VARS_;
  let $_RETURN_DATA_ = {};
  ${code}
  return $_RETURN_DATA_;  
}
`;

    /*
    let codefunction = `
return async()=>{
  ${app_vars_string}  
  const {$_REQUEST_, $_UFETCH_, $_SECUENTIAL_PROMISES_, $_REPLY_, $_GEN_TOKEN_, $_GET_INTERNAL_URL_, $_FETCH_OFAPI_,  $_MONGOOSE_, $_EXCEPTION_, $_LUXON_, $_SEQUELIZE_, $_BUILD_INTERNAL_URL} = $_VARS_;
  let $_RETURN_DATA_ = {};
  ${code}
  return $_RETURN_DATA_;  
}
`;
*/

    fn = new Function("$_VARS_", codefunction);
  } catch (error) {
    fn = new Function("", "throw new Error('Error creating function');");
  }

  return fn;
};

export const sizeOfMapInKB = (map) => {
  const bytes = roughSizeOfMap(map);
  const kilobytes = bytes / 1024;
  return kilobytes;
};

export class InternalURL {
  constructor(environment) {
    this.environment = environment;
  }
  direct(relative_path) {
    return `http://localhost:${PORT}${relative_path}`;
  }
  autoEnvironment(relative_path) {
    return this.direct(
      relative_path.replace(/\/(prd|qa|dev)$/, `/${this.environment}`)
    );
  }
}

export const getInternalURL = (relative_path) => {
  console.warn("Decrepted getInternalURL!!!!!\n" + relative_path);
  return `http://localhost:${PORT}${relative_path}`;
};

export const fetchOFAPI = (url) => {
  url = isAbsoluteUrl(url) ? url : getInternalURL(url);

  // console.log('\n\n>>>>>>>>>>>>>>>> '+url);

  return new uFetch(url);
};

const isAbsoluteUrl = (url) => {
  // Expresión regular para verificar si es una URL absoluta
  const absoluteUrlPattern = /^(?:[a-zA-Z]+:)?\/\//;

  // Si la URL coincide con el patrón, es absoluta
  return absoluteUrlPattern.test(url);
};
