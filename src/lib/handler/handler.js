import { jsFunction } from "./jsFunction.js";
import { fetchFunction } from "./fetchFunction.js";
import { soapFunction } from "./soapFunction.js";
import { sqlFunction } from "./sqlFunction.js";
import { textFunction } from "./textFunction.js";
import { customFunction } from "./customFunction.js";

/**
 * @param {{headers: any;body: any;query: any;}} request
 * @param {any} response
 * @param {{handler: string;code: string;}} method
 * @param {{ [x: string]: (arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }) => void; }} appFunctions
 */
export async function runHandler(request, response, method, appFunctions) {
  console.log(">>> runHandler <<<<");

  switch (method.handler) {
    case "JS":
      await jsFunction(request, response, method);
      break;
    case "FETCH":
      // @ts-ignore
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
    case "FUNCTION":
      await customFunction(request, response, method, appFunctions);
      break;
    default:
      response.code(404).send(`handler ${method.handler} not valid`);
      break;
  }
}
