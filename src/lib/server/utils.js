import { createHmac, createHash, randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { Buffer } from "node:buffer";
import jwt from "jsonwebtoken";
import { internal_url_post_hooks } from "./utils_path.js"; //
import * as uuid from "uuid";
import uFetch from "@edwinspire/universal-fetch";
import Zod from "zod";
import {
  URLAutoEnvironment,
  functionsVars,
  GenToken,
  JWTKEY,
} from "./functionVars.js";

const { PORT } = process.env;
// Pre-compilamos el Regex fuera para mejorar el rendimiento en llamadas frecuentes

const errors = {
  1: { code: 1, message: "You must enter the same password twice" },
  2: { code: 2, message: "Invalid credentials" },
};

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
    const fnUrlae = new URLAutoEnvironment({ environment: "prd", port: PORT });
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
  return createHmac("sha256", JWTKEY).update(pwd).digest("hex");
}

/**
 * @param {any} token
 */
export function tokenVerify(token) {
  return jwt.verify(token, JWTKEY);
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

/**
 * @param {Array<{environment: string, name: string, value: any}>} app_vars
 */
export const getAppVarsObject = (app_vars) => {

  let appvars_obj = {};

  if (Array.isArray(app_vars)) {

    for (let index = 0; index < app_vars.length; index++) {
      const element = app_vars[index];
      if (!appvars_obj[element.environment]) {
        appvars_obj[element.environment] = {};
      }
      appvars_obj[element.environment][element.name] = element.value;
    }
  }

  return appvars_obj;
}