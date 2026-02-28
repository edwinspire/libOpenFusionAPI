import { getHandlerDoc, Handlers } from "../../../../../handler/handler.js";


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
