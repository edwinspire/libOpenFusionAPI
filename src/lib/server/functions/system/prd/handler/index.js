import { getHandlerDoc, Handlers, getHandlerLibraryDoc } from "../../../../../handler/handler.js";
import { readHandlerSkill } from "../../../../handlerDocs.js";


export async function fnGetHandler(params) {
  let r = { code: 204, data: undefined };
  try {

    const ordenado = Object.keys(Handlers)
      .sort()
      .reduce((acc, key) => {
        acc[key] = Handlers[key];
        return acc;
      }, {});

    const hs = Object.keys(ordenado).map((key) => {
      const h = ordenado[key];
      return {
        handler: key,
        label: h.label,
        description: h.description,
        css_class: h.css_class,
        css_icon: h.css_icon,
        modules: h.modules
      };
    });


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

export async function fnGetHandlerSkill(params) {
  let r = { code: 204, data: undefined };
  try {
    const handler = (params.request.query.handler || params.request.openfusionapi?.handler?.params?.custom_data?.handler || "").toUpperCase();
    if (!handler) {
      r.code = 400;
      r.data = { error: "Parameter 'handler' is required." };
    } else {
      r.data = await readHandlerSkill(handler);
      r.code = 200;
    }
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetHandlerLibraryDocs(params) {
  let r = { code: 204, data: undefined };
  try {
    const handler = (params.request.query.handler || "").toUpperCase();
    const library = params.request.query.library || "";

    if (!handler) {
      r.code = 400;
      r.data = { error: "Parameter 'handler' is required." };
    } else {
      const data = await getHandlerLibraryDoc(handler, library);
      r.data = data;
      r.code = 200;
    }
  } catch (error) {
    r.data = { error: error.message };
    r.code = error.message.includes("not found") ? 404 : 500;
  }
  return r;
}

