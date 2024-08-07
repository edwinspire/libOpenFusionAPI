import { schema_return_customFunction } from "./json_schemas.js";

import Ajv from "ajv";
const ajv = new Ajv();
const validate_schema_out_customFunction = ajv.compile(
  schema_return_customFunction
);

export const customFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method,
  /** @type {{ [x: string]: ((arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { code: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }) => void) | ((arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { code: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }, arg2: any) => any); }} */ appFunctions
) => {
  try {
    if (appFunctions && appFunctions[method.code]) {
      let $_DATA = $_REQUEST_.body;

      if (!$_DATA) {
        $_DATA = $_REQUEST_.query;
      }

      let fnresult = await appFunctions[method.code](
        $_REQUEST_,
        $_DATA,
        response
      );

      if (validate_schema_out_customFunction(fnresult)) {
        if (
          response.openfusionapi.lastResponse &&
          response.openfusionapi.lastResponse.hash_request
        ) {
          // @ts-ignore
          response.openfusionapi.lastResponse.data = fnresult.data;
        }
        // @ts-ignore
        response.code(fnresult.code).send(fnresult.data);
      } else {
        response.code(500).send(validate_schema_out_customFunction.errors);
      }
    } else {
      response.code(404).send({ error: `Function ${method.code} not found.` });
    }
  } catch (error) {
    //console.trace(error);
    // @ts-ignore
    response.code(500).send(error);
  }
};

