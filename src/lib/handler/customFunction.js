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
    //console.log(typeof method.Fn);
    if (typeof method.Fn === "function") {
      let $_DATA =
        $_REQUEST_.body && Object.keys($_REQUEST_.body).length > 0
          ? $_REQUEST_.body
          : $_REQUEST_.query;

      // Función, ver la forma de ejecutarla en un SANDBOX u otra forma que sea segura y aislada.
      const fnresult = await Promise.race([
        method.Fn({
          request: $_REQUEST_,
          user_data: $_DATA,
          reply: $_REPLY_,
          server_data: $_SERVER_DATA_,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 60 * 1000)
        ),
      ]);

      if (validate_schema_out_customFunction(fnresult)) {
        setCacheReply($_REPLY_, fnresult.data);
        // @ts-ignore
        $_REPLY_.code(fnresult.code).send(fnresult.data);
      } else {
        const errors = JSON.parse(
          JSON.stringify(validate_schema_out_customFunction.errors)
        );
        setCacheReply($_REPLY_, errors);
        $_REPLY_.code(500).send(errors);
      }
    } else {
      let alt_resp = { error: `URL: ${$_REQUEST_.url} - Function ${method.code} not found.` };
      //setCacheReply($_REPLY_, alt_resp);

      $_REPLY_.code(500).send(alt_resp);
    }
  } catch (err) {
    console.trace(err);
    const safeError = { error: err.message ?? "Internal error" };
    setCacheReply($_REPLY_, safeError);
    $_REPLY_.code(500).send(safeError);
  }
};
