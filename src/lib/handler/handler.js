import { jsFunction } from "./jsFunction.js";
import { fetchFunction } from "./fetchFunction.js";
import { soapFunction } from "./soapFunction.js";
import { sqlFunction } from "./sqlFunction.js";
import { textFunction } from "./textFunction.js";
import { customFunction } from "./customFunction.js";
import { sqlHana } from "./sqlHana.js";
import { sqlFunctionInsertBulk } from "./sqlFunctionInsertBulk.js";
import { mongodbFunction } from "./mongoDB.js";
import { mcpFunction } from "./mcpFunction.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtiene la ruta del archivo actual (__filename)
const __filename = fileURLToPath(import.meta.url);

// Obtiene el directorio (__dirname)
const __dirname = path.dirname(__filename);

export const Handlers = {
  JS: {
    label: "JavaScript",
    fn: jsFunction,
    description: "Ejecuta código JavaScript personalizado.",
  },
  FETCH: {
    label: "Fetch",
    fn: fetchFunction,
    description:
      "Realiza solicitudes HTTP a servicios externos utilizando la API Fetch.",
  },
  SOAP: {
    label: "SOAP",
    fn: soapFunction,
    description: "Consume servicios web SOAP.",
  },
  SQL: {
    label: "SQL",
    fn: sqlFunction,
    description: "Ejecuta consultas SQL en bases de datos relacionales.",
  },
  TEXT: {
    label: "Text",
    fn: textFunction,
    description: "Devuelve una respuesta de texto plano.",
  },
  SQL_BULK_I: {
    label: "SQL Bulk Insert",
    fn: sqlFunctionInsertBulk,

    description: "Realiza inserciones masivas en bases de datos SQL.",
  },
  HANA: {
    label: "HANA",
    fn: sqlHana,
    description: "Ejecuta consultas SQL en bases de datos SAP HANA.",
  },
  FUNCTION: {
    label: "Function",
    fn: customFunction,
    description: "Llama a una función personalizada definida en el entorno.",
  },
  MONGODB: {
    label: "MongoDB",
    fn: mongodbFunction,
    description: "Interactúa con bases de datos MongoDB.",
  },
  MCP: {
    label: "MCP",
    fn: mcpFunction,
    description:
      "Proporciona funcionalidades de procesamiento de múltiples canales.",
  },
};

export const getHandlerDoc = async (handler) => {
  let doc = {};

  const h = Handlers[handler];

  if (h) {
    try {
      doc.label = h.label;
      doc.description = h.description;

      // Obtener la ruta absoluta del archivo
      const mdPath = path.resolve(
        `${__dirname}/../../../docs/handlers/${handler}/README.md`
      );

      // fs.readFileSync() → BLOQUEA el event loop
      // Leer contenido como string
      //const jsDoc = fs.readFileSync(mdPath, "utf8");
      const markdown = await fs.readFile(mdPath, "utf8");

      doc.markdown = markdown;
      //console.log(jsDoc);
    } catch (error) {
      console.error(error);
    }
  }

  return doc;
};

/* ============================================================
   EJECUTAR HANDLER
   ============================================================ */
export async function runHandler(request, response, method, server_data) {
  try {
    const handler = Handlers[method.handler];

    if (!handler || !handler.fn) {
      response
        .code(404)
        .send({ error: `Handler '${method.handler}' no es válido` });
    }

    await handler.fn(request, response, method, server_data);
  } catch (err) {
    console.error(err);
    response.code(500).send({
      error: `Error to execute Handler: '${method.handler}'`,
      message: err.message,
    });
  }
}
