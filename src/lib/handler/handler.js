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
import { botTelegramFunction } from "./botTelegramFunction.js";
import fs from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";
import { replyException } from "./utils.js";
import { listFunctionsVars } from "../server/functionVars.js";

// Obtiene la ruta del archivo actual (__filename)
const __filename = fileURLToPath(import.meta.url);

// Obtiene el directorio (__dirname)
const __dirname = path.dirname(__filename);

export const Handlers = {
  JS: {
    label: "JavaScript",
    fn: jsFunction,
    css_icon: "fa-brands fa-js",
    css_class: "success",
    description: "It allows you to write JavaScript code that can be executed on the server. Several predefined modules are available for use.",
    modules: listFunctionsVars()
  },
  FETCH: {
    label: "Fetch",
    fn: fetchFunction,
    css_icon: "fa-solid fa-globe",
    css_class: "primary",
    description:
      "It makes HTTP requests to external services using the Fetch API. It functions as an HTTP proxy.",
  },
  SOAP: {
    label: "SOAP",
    fn: soapFunction,
    css_icon: "fa-solid fa-soap",
    css_class: "info",
    description: "It allows you to convert a SOAP web service to a REST service with minimal configuration.",
  },
  SQL: {
    label: "SQL",
    fn: sqlFunction,
    css_icon: "fa-solid fa-database",
    css_class: "link",
    description: "It allows you to connect to the most popular databases (those supported by Sequelize) and perform the operations supported by the library.",
  },
  TEXT: {
    label: "Text",
    fn: textFunction,
    css_icon: "fa-regular fa-file-lines",
    css_class: "warning",
    description: "It allows storing plain text that will be returned by the endpoint with the parameterized mimetype.",
  },
  SQL_BULK_I: {
    label: "SQL Bulk Insert",
    fn: sqlFunctionInsertBulk,
    css_icon: "danger",
    css_class: "fa-solid fa-database",
    description: "It allows for the most efficient bulk uploads to databases supported by Sequelize. The endpoint receives the data to be inserted as parameters and returns the number of records inserted.",
  },
  HANA: {
    label: "HANA",
    fn: sqlHana,
    css_icon: "fa-solid fa-database",
    css_class: "",
    description: "Easily execute SQL queries on SAP HANA databases. The endpoint can receive parameters that will be sent to the query and returns the query result.",
  },
  FUNCTION: {
    label: "Function",
    fn: customFunction,
    css_icon: "danger",
    css_class: "fa-solid fa-robot",
    description: "Call a custom function created on the server.",
  },
  MONGODB: {
    label: "MongoDB",
    fn: mongodbFunction,
    css_icon: "fa-solid fa-database",
    css_class: "",
    description: "It allows interaction with MongoDB databases and the performance of common operations. The endpoint can receive parameters that will be passed to queries. JavaScript logic can be written within this handler.",
    modules: listFunctionsVars()
  },
  MCP: {
    label: "MCP",
    fn: mcpFunction,
    css_icon: "fa-solid fa-plug fa-bounce",
    css_class: "danger",
    description:
      "Create an MCP server that exposes enabled endpoints as MCP tools for AI Agents to use.",
  },
  TELEGRAM_BOT: {
    label: "Telegram Bot",
    fn: botTelegramFunction,
    css_icon: "fa-brands fa-bots",
    css_class: "info",
    description:
      "Create a Telegram Bot. Within this endpoint, you can write JavaScript code to give the Bot functionality.",
    modules: listFunctionsVars()
  },
  NA: {
    label: "Not Assigned",
    css_icon: "fa-solid fa-ban",
    css_class: "secondary",
    description:
      "Internal default/no-op handler. Keep for compatibility; avoid selecting it for new integrations.",
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
export async function runHandler(request, response, endpoint, server_data) {
  try {
    const handler = Handlers[endpoint.handler];

    if (!handler || !handler.fn) {
      response
        .code(404)
        .send({ error: `Handler '${endpoint.handler}' no es válido` });
      return;
    }

    await handler.fn({
      request,
      reply: response,
      method: endpoint,
      endpoint,
      server_data
    });
  } catch (err) {
    replyException(request, response, err);
  }
}
