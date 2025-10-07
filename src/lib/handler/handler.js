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
import { agentIAFunction } from "./agentIAFunction.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

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
  AGENT_IA: {
    label: "Agent IA",
    fn: agentIAFunction,
    description:
      "Integra capacidades de inteligencia artificial para agentes conversacionales.",
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
      const mdPath = path.resolve(`${__dirname}/docs/${handler}.md`);

      // Leer contenido como string
      const jsDoc = fs.readFileSync(mdPath, "utf8");

      doc.markdown = jsDoc;
      //console.log(jsDoc);
    } catch (error) {
      console.error(error);
    }
  }

  return doc;
};

/**
 * @param {{headers: any;body: any;query: any;}} request
 * @param {any} response
 * @param {{handler: string;code: string;}} method
 * @param {{ [x: string]: (arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }) => void; }} appFunctions
 */
export async function runHandler(request, response, method, server_data) {
  await runHandlerFunction(request, response, method, server_data);
}

async function runHandlerFunction(request, response, method, server_data) {
  const handler = Handlers[method.handler];
  if (handler && handler.fn) {
    await handler.fn(request, response, method, server_data);
  } else {
    response.code(404).send(`handler ${method.handler} not valid`);
  }
  /*
  switch (method.handler) {
    case "JS":
      await jsFunction(request, response, method);
      break;
    case "FETCH":
      await fetchFunction(request, response, method);
      break;
    case "SOAP":
      await soapFunction(request, response, method);
      break;
    case "TEXT":
      await textFunction(request, response, method);
      break;
    case "SQL":
      await sqlFunction(request, response, method);
      break;
    case "SQL_BULK_I":
      await sqlFunctionInsertBulk(request, response, method);
      break;
    case "HANA":
      await sqlHana(request, response, method);
      break;
    case "FUNCTION":
      await customFunction(request, response, method, server_data);
      break;
    case "MONGODB":
      await mongodbFunction(request, response, method);
      break;
    case "MCP":
      await mcpFunction(request, response, method);
      break;
    case "AGENT_IA":
      await agentIAFunction(request, response, method);
      break;      
    default:
      response.code(404).send(`handler ${method.handler} not valid`);
      break;
  }
  */
}
