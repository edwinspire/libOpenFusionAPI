//const { createHmac } = await import('node:crypto');
import { createHmac, createHash } from "crypto";
import fs from "fs";
import path from "path";
import { Buffer } from "node:buffer";
import jwt from "jsonwebtoken";
import uFetch from "@edwinspire/universal-fetch";
import { internal_url_post_hooks } from "./utils_path.js"; //
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
  console.log(await r.json());
}

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
  let exp =  Math.floor(Date.now() / 1000) + (exp_seconds);
  // Genera un Token
  return jwt.sign({ data: {...data, _rnd_:(Math.random() * (100 - 0.01) + 0.01).toFixed(2)}, exp: Number(exp) }, jwtKey);
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
  }else  if (authHeader && authHeader.startsWith("Bearer")) {
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
