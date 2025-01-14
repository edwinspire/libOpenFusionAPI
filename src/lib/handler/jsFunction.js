// @ts-ignore
import $_UFETCH_ from "@edwinspire/universal-fetch";
import $_SECUENTIAL_PROMISES_ from "@edwinspire/sequential-promises";
import { GenToken, getInternalURL, fetchOFAPI } from "../server/utils.js";
import { setCacheReply } from "./utils.js";

export const createFunction = (
  /** @type {string} */ code,
  /** @type {string} */ app_vars
) => {
  let app_vars_string = "";

  if (app_vars && typeof app_vars === "object") {
    app_vars_string = `const $_VARS_APP = ${JSON.stringify(app_vars, null, 2)}`;
  }

  let codefunction = `
return async()=>{
  ${app_vars_string}  
  const {$_REQUEST_, $_UFETCH_, $_SECUENTIAL_PROMISES_, $_REPLY_, $_GEN_TOKEN_, $_GET_INTERNAL_URL_, $_FETCH_OFAPI_} = $_VARS_;
  let $_RETURN_DATA_ = {};
  ${code}
  return $_RETURN_DATA_;  
}
`;

  // console.log(codefunction);

  return new Function("$_VARS_", codefunction);
};

export const jsFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method
) => {
  try {
    //    let $_UFETCH_ = new uFetch();

    let f;

    if (method.jsFn) {
      console.log("Usa jsFn creada");
      f = method.jsFn;
    } else {
      console.log(
        "Crea nueva jsFn. Porque no abria de estar creada si al cargar el endpoint se crea la función????"
      );
      f = createFunction(method.code);
    }

    // console.log(fetchOFAPI);

    let result_fn = await f({
      $_REPLY_: response,
      $_REQUEST_: $_REQUEST_,
      $_UFETCH_: $_UFETCH_,
      $_SECUENTIAL_PROMISES_: $_SECUENTIAL_PROMISES_,
      $_GEN_TOKEN_: GenToken,
      $_GET_INTERNAL_URL_: getInternalURL,
      $_FETCH_OFAPI_: fetchOFAPI,
    })();

    if (
      response.openfusionapi.lastResponse &&
      response.openfusionapi.lastResponse.hash_request
    ) {
      // @ts-ignore
      response.openfusionapi.lastResponse.data = result_fn;
    }
    response.code(200).send(result_fn);
  } catch (error) {
    setCacheReply(response, error);
    // @ts-ignore
    response.code(500).send(error);
  }
};
