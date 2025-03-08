import { functionsVars, createFunction } from "../server/utils.js";
import { setCacheReply } from "./utils.js";

export const jsFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method
) => {
  try {
    //    let $_UFETCH_ = new uFetch();

    let f;

    if (method.jsFn) {
      f = method.jsFn;
    } else {
      f = createFunction(method.code);
    }

    /*  
    let result_fn = await f({
      $_REPLY_: response,
      $_REQUEST_: $_REQUEST_,
      $_UFETCH_: $_UFETCH_,
      $_SECUENTIAL_PROMISES_: $_SECUENTIAL_PROMISES_,
      $_GEN_TOKEN_: GenToken,
      $_GET_INTERNAL_URL_: getInternalURL,
      $_FETCH_OFAPI_: fetchOFAPI,
      $_MONGOOSE_: mongoose,
      $_EXCEPTION_: jsException,
      $_LUXON_: LUXON,
      $_SEQUELIZE_: SEQUELIZE,
      $_BUILD_INTERNAL_URL: BuildInternalURL
    })();
*/
    let result_fn = await f(
      functionsVars($_REQUEST_, response, method.environment)
    )();

    if (
      response.openfusionapi.lastResponse &&
      response.openfusionapi.lastResponse.hash_request
    ) {
      response.openfusionapi.lastResponse.data = result_fn;
    }
    response.code(200).send(result_fn);
  } catch (error) {
    console.trace(error);
    setCacheReply(response, error);

    response
      .code(error.statusCode == null ? 500 : error.statusCode)
      .send(error);
  }
};
