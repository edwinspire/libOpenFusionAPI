import { getAllHandlers } from "../../../../../db/handler.js";
import { getHandlerDoc } from "../../../../../handler/handler.js";


export async function fnGetHandler(params) {
  let r = { code: 204, data: undefined };
  try {
    const hs = await getAllHandlers();

    r.data = hs;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}


export async function fnGetHandlerDocs(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await getHandlerDoc(params.request.query.handler);
    r.code = 200;
  } catch (error) {
    //res.code(500).json({ error: error.message });
    r.data = error;
    r.code = 500;
  }
  return r;
}
