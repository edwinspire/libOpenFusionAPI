import { schema_return_customFunction } from "./json_schemas.js";

import Ajv from "ajv";
const ajv = new Ajv();
const validate_schema_out_customFunction = ajv.compile(
  schema_return_customFunction
);

export const customFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ $_RESPONSE_,
  /** @type {{ handler?: string; code: any; Fn?: any }} */ method,
  /** @type {{ [x: string]: ((arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { code: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }) => void) | ((arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { code: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }, arg2: any) => any); }} */ $_SERVER_DATA_
) => {
  try {
    if (
    //  $_SERVER_DATA_ &&
    //  $_SERVER_DATA_.app_functions &&
    //  $_SERVER_DATA_.app_functions[method.code]
    method.Fn
    ) {
      let $_DATA = $_REQUEST_.body;

      if (!$_DATA) {
        $_DATA = $_REQUEST_.query;
      }

      /*
      let fnresult = await $_SERVER_DATA_.app_functions[method.code]({
        request: $_REQUEST_,
        user_data: $_DATA,
        reply: $_RESPONSE_,
        server_data: $_SERVER_DATA_,
      });
      */

      let fnresult = await method.Fn({
        request: $_REQUEST_,
        user_data: $_DATA,
        reply: $_RESPONSE_,
        server_data: $_SERVER_DATA_,
      });

      if (validate_schema_out_customFunction(fnresult)) {
        if (
          $_RESPONSE_.openfusionapi.lastResponse &&
          $_RESPONSE_.openfusionapi.lastResponse.hash_request
        ) {
          // @ts-ignore
          $_RESPONSE_.openfusionapi.lastResponse.data = fnresult.data;
        }
        // @ts-ignore
        $_RESPONSE_.code(fnresult.code).send(fnresult.data);
      } else {
        $_RESPONSE_.code(500).send(validate_schema_out_customFunction.errors);
      }
    } else {
      $_RESPONSE_
        .code(404)
        .send({ error: `Function ${method.code} not found.` });
    }
  } catch (error) {
    //console.trace(error);
    // @ts-ignore
    $_RESPONSE_.code(500).send(error);
  }
};
