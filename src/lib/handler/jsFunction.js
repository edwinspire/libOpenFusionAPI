import { functionsVars } from "../server/utils.js";
import { setCacheReply } from "./utils.js";

export const jsFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method
) => {
  try {
    let f;

    if (method.jsFn) {
      f = method.jsFn;
    }

    let result_fn = await f(
      functionsVars($_REQUEST_, response, method.environment)
    );

    if (
      response.openfusionapi.lastResponse &&
      response.openfusionapi.lastResponse.hash_request
    ) {
      response.openfusionapi.lastResponse.data = result_fn.data;
    }

    if (result_fn.headers && result_fn.headers.size > 0) {
      for (const [key, value] of result_fn.headers) {
        //console.log(`${key}: ${value}`);
        response.header(key, value);
      }
    }

    response.code(200).send(result_fn.data);
  } catch (error) {
    console.trace(error);
    //setCacheReply(response, error); Error no se debe cachear
    if (error.message.includes("Error creating function")) {
      error.message = error.message + " - Check your code.";
    }
    response
      .code(error.statusCode == null ? 500 : error.statusCode)
      .send(error);
  }
};
