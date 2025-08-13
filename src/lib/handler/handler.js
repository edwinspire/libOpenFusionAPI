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
import { getRequestData } from "../server/utils.js";

/**
 * @param {{headers: any;body: any;query: any;}} request
 * @param {any} response
 * @param {{handler: string;code: string;}} method
 * @param {{ [x: string]: (arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }) => void; }} appFunctions
 */
export async function runHandler(request, response, method, server_data) {
  //console.log(">>> runHandler <<<<");

  /*
  const validate =
    request?.openfusionapi?.handler?.params?.json_schema?.in
      ?.fn_ajv_validate_schema;

  if (validate) {
    console.log("Validating request data against schema");
    let data_validar = getRequestData(request);
    const valid = validate && validate(data_validar);
    const errors = validate.errors ? [...validate.errors] : null;

    if (!valid) {
      response.code(400).send({
        error: "Validation failed",
        details: errors,
      });
    } else {
      await runHandlerFunction(request, response, method, server_data);
    }
  } else {
    await runHandlerFunction(request, response, method, server_data);
  }
  */
  await runHandlerFunction(request, response, method, server_data);
}

async function runHandlerFunction(request, response, method, server_data) {
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
    default:
      response.code(404).send(`handler ${method.handler} not valid`);
      break;
  }
}
