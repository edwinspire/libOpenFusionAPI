import { functionsVars, listFunctionsVars } from "../server/functionVars.js";
import { replyException, setCacheReply } from "./utils.js";

export const jsFunction = async (context) => {
  const request = context?.request;
  const reply = context?.reply;
  const method = context?.method || context?.endpoint;
  const server_data = context?.server_data;
  try {
    if (!method.jsFn) {
      throw new Error("Function 'jsFn' is not defined in the method configuration.");
    }

    let f = method.jsFn;

    let fnVars = functionsVars(request, reply, method.environment);

    let fnresult = await method.jsFn(fnVars);

    setCacheReply(reply, fnresult.data);

    reply.code(200).send(fnresult.data);
  } catch (error) {

    replyException(request, reply, error);
  }


};
