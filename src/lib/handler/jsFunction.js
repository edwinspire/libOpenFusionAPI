import { functionsVars, listFunctionsVars } from "../server/functionVars.js";
import {
  getHandlerExecutionContext,
  replyException,
  sendHandlerResponse,
} from "./utils.js";

export const jsFunction = async (context) => {
  const { request, reply, method } = getHandlerExecutionContext(context);
  try {
    if (!method.jsFn) {
      throw new Error("Function 'jsFn' is not defined in the method configuration.");
    }

    let fnVars = functionsVars(request, reply, method.environment);
    let fnresult = await method.jsFn(fnVars);

    sendHandlerResponse(reply, {
      statusCode: 200,
      data: fnresult.data,
    });
  } catch (error) {
    replyException(request, reply, error);
  }
};
