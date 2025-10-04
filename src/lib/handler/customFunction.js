import { schema_return_customFunction } from "./json_schemas.js";
import { setCacheReply } from "./utils.js";

import Ajv from "ajv";
const ajv = new Ajv();
const validate_schema_out_customFunction = ajv.compile(
  schema_return_customFunction
);

export const customFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ $_REPLY_,
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
        reply: $_REPLY_,
        server_data: $_SERVER_DATA_,
      });
      */

      let fnresult = await method.Fn({
        request: $_REQUEST_,
        user_data: $_DATA,
        reply: $_REPLY_,
        server_data: $_SERVER_DATA_,
      });

      if (validate_schema_out_customFunction(fnresult)) {
        setCacheReply($_REPLY_, fnresult.data);
        // @ts-ignore
        $_REPLY_.code(fnresult.code).send(fnresult.data);
      } else {
        setCacheReply($_REPLY_, validate_schema_out_customFunction.errors);

        $_REPLY_.code(500).send(validate_schema_out_customFunction.errors);
      }
    } else {
      let alt_resp = { error: `Function ${method.code} not found.` };
      setCacheReply($_REPLY_, alt_resp);

      $_REPLY_.code(404).send(alt_resp);
    }
  } catch (error) {
    setCacheReply($_REPLY_, error);
    console.trace(error);
    // @ts-ignore
    $_REPLY_.code(500).send(error);
  }
};
