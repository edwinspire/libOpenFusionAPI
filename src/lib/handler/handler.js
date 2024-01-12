import { jsFunction } from "./jsFunction.js";
import { fetchFunction } from "./fetchFunction.js";
import { soapFunction } from "./soapFunction.js";
import { sqlFunction } from "./sqlFunction.js";
import { customFunction } from "./customFunction.js";

/**
 * @param {{headers: any;body: any;query: any;}} request
 * @param {any} response
 * @param {{handler: string;code: string;}} method
 * @param {{ [x: string]: (arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }) => void; }} appFunctions
 */
export function runHandler(request, response, method, appFunctions) {
  
  switch (method.handler) {
    case "JS":
      jsFunction(request, response, method);
      break;
    case "FETCH":
      // @ts-ignore
      fetchFunction(request, response, method);
      break;
    case "SOAP":
      soapFunction(request, response, method);
      break;
    case "SQL":
      sqlFunction(request, response, method);
      break;
    case "FUNCTION":
      customFunction(request, response, method, appFunctions);
      break;
    default:
      response.status(404).json(`handler ${method.handler} not valid`);
      break;
  }
}

