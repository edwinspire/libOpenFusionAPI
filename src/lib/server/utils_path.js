import { match } from "path-to-regexp";

export const default_port = process.env.PORT || 3000;
//export const url_telegram_notifications =  process.env.URL_TELEGRAM_NOTIFICATIONS ?? `/api/system/api/telegram/sendmsg/prd`;
export const struct_api_path = "/api/:app/*";
export const internal_url_post_hooks =
  process.env.PATH_API_HOOKS ?? "/api/system/database/hooks/prd";
export const websocket_hooks_resource = "/websocket/hooks";

export const internal_url_http = (relative_path) =>
  `http://localhost:${default_port}${relative_path}`;
export const internal_url_ws = (relative_path) =>
  `http://localhost:${default_port}${relative_path}`;

export const get_url_params = (
  /** @type {string} */ url,
  method
) => {
  let reqUrl = new URL(`http://localhost${url.toLowerCase()}`);
  let fn = match("/(api|ws)/:parts*", { decode: decodeURIComponent });
  let par = fn(reqUrl.pathname);

  if (par.params) {
    method = method ? method.toUpperCase() : "UNKNOW";
    par.app =
      par.params.parts && par.params.parts.length > 0
        ? par.params.parts[0]
        : undefined;
    par.environment =
      par.params.parts && par.params.parts.length > 1
        ? par.params.parts.slice(-1)[0]
        : undefined;
    par.resource = "/" + par.params.parts.slice(1, -1).join("/");
    par.url_key = url_key(
      par.app,
      par.resource,
      par.environment,
      method,
      par.params[0] === "ws"
    );
  } else {
    par = { params: { parts: [] } };
  }

  return par;
};

/*
export const key_url_from_params = (
 params
) => {
  return `/api/${params.app}${params.resource}/${params.method}`;
};
*/

export const url_key = (app, resource, environment, method, ws) => {
  method = method ? method.toUpperCase() : "UNKNOW";
  return `${internal_url_endpoint(app, resource, environment, ws)}|${
    ws ? "WS" : method
  }`;
};

export const internal_url_endpoint = (app, resource, environment, ws) => {
  return `${
    ws ? "/ws/" : "/api/"
  }${app.toLowerCase()}${resource.toLowerCase()}/${environment.toLowerCase()}`;
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

export const urlSystemPath = {
  Endpoints: {},
  Websocket: { EventServer: "/ws/system/websocket/server/prd" },
};

export function WebSocketValidateFormatChannelName(cadena) {
  // 1. Validación de tipo y longitud mínima
  if (typeof cadena !== "string" || cadena.length < 5) {
    return {
      valid: false,
      error: "Channel name must be a string and at least 5 characters long.",
    };
  }

  // 2. Validación del formato de caracteres y estructura
  const regex = /^\/(?!.*\/{3,})([A-Za-z0-9]+(_|-|\.|\/)?)*[A-Za-z0-9]*$/;

  if (!regex.test(cadena)) {
    return {
      valid: false,
      error: cadena.match(/\/{3,}/)
        ? "Invalid channel name format: More than two consecutive characters found."
        : "Invalid channel name format: Contains disallowed characters or invalid structure (e.g., starting without '/' or having adjacent special chars).",
    };
  }

  // Si pasa ambas validaciones
  return { valid: true };
}
