import { match } from "path-to-regexp";

export const default_port = 3000;
export const url_telegram_notifications = `http://localhost:${
  process.env.PORT || default_port
}/api/system/api/telegram/sendmsg/prd`;
export const struct_api_path = "/api/:app/*";
export const internal_url_post_hooks =
  process.env.PATH_API_HOOKS ?? "/_internal_/system/_hooks_/prd";
export const websocket_hooks_resource = "/websocket/hooks";
export const get_url_params = (/** @type {string} */ url) => {
  let reqUrl = new URL(`http://localhost${url.toLowerCase()}`);
  let fn = match("/(api|ws)/:parts*", { decode: decodeURIComponent });
  let par = fn(reqUrl.pathname);

  if (par.params) {
    par.app =
      par.params.parts && par.params.parts.length > 0
        ? par.params.parts[0]
        : undefined;
    par.environment =
      par.params.parts && par.params.parts.length > 1
        ? par.params.parts.slice(-1)[0]
        : undefined;
    par.resource = "/" + par.params.parts.slice(1, -1).join("/");
  } else {
    par = { params: { parts: [] } };
  }

  return par;
};

export const key_url_from_params = (
  /** @type {{ app: string; method: string; resource: string; }} */ params
) => {
  return `/api/${params.app}${params.resource}/${params.method}`;
};

export const key_endpoint_method = (app, resource, environment, method, ws) => {
  return `${
    ws ? "/ws/" : "/api/"
  }${app.toLowerCase()}${resource.toLowerCase()}/${environment.toLowerCase()}|${
    ws ? "WS" : method
  }`;
};

/**
 * @param {string} string_url
 */
export function validateURL(string_url) {
  const patron = /^\/[a-zA-Z0-9\-._~%]+(\/[a-zA-Z0-9\-._~%]+)*\/?$/;
  // ^ Inicio de la cadena
  // \/ Barra inicial
  // [a-zA-Z0-9\-._~%]+ Uno o más caracteres permitidos en la ruta
  // (\/[a-zA-Z0-9\-._~%]+)* Cero o más grupos adicionales de barra seguido de caracteres permitidos
  // \/? Barra opcional al final
  // $ Fin de la cadena

  if (patron.test(string_url)) {
    return true;
  } else {
    return false;
  }
}
