// Precompílalo una sola vez (mejor rendimiento si llamas muchas veces)
const RE_QUOTED_VAR = /"\$_VAR_[A-Za-z0-9_]+"/g;

/**
 * Reemplaza múltiples valores en una cadena usando una lista de objetos.
 * @param {string} source - Cadena original
 * @param {Array<{name: string, value: any}>} replacements - Lista de reemplazos
 * @returns {string} - Cadena con todos los reemplazos aplicados
 */
export const replaceAllFast = (source, replacements) => {
  if (typeof source !== "string") source = String(source);
  if (!Array.isArray(replacements) || replacements.length === 0) {
    return source;
  }

  source = cleanVar(source);

  // Preprocesar: crear mapa de reemplazos y ordenar por longitud descendente
  // Esto evita problemas como reemplazar "aa" antes que "aaa"
  const map = new Map();
  const entries = [];

  for (const item of replacements) {
    if (!item || typeof item.name !== "string" || item.name === "") continue;

    const key = item.name;
    let value =
      item.value === undefined || item.value === null ? "" : String(item.value);

    if (
      (item.type === "json" || item.type === "object") &&
      typeof item.value === "object"
    ) {
      value = JSON.stringify(item.value);
    }

    if (!map.has(key)) {
      map.set(key, value);
      entries.push({ key, value, len: key.length });
    }
  }

  // Si no hay reemplazos válidos, devolver original
  if (entries.length === 0) return source;

  // Ordenar por longitud descendente (crucial para evitar reemplazos parciales)
  entries.sort((a, b) => b.len - a.len);

  let result = "";
  let pos = 0;

  while (pos < source.length) {
    let matched = false;

    // Buscar el reemplazo más largo posible en la posición actual
    for (const { key, value, len } of entries) {
      if (source.startsWith(key, pos)) {
        result += value;
        pos += len;
        matched = true;
        break;
      }
    }

    // Si no hubo coincidencia, copiar carácter actual
    if (!matched) {
      result += source[pos];
      pos++;
    }
  }

  return result;
};

export function getLogLevelForStatus(status) {
  if (status >= 100 && status <= 199) return "info";
  if (status >= 200 && status <= 299) return "success";
  if (status >= 300 && status <= 399) return "redirect";
  if (status >= 400 && status <= 499) return "client_error";
  if (status >= 500 && status <= 599) return "server_error";
  return "unknown";
}

const cleanVar = (str) => {
  if (typeof str !== "string") str = String(str);

  // Reemplaza: "$_VAR_X"  -> $_VAR_X
  return str.replace(RE_QUOTED_VAR, (m) => m.slice(1, -1));
};


export const getAppVarsObject = (app_vars) => {

  let appvars_obj = {};

  if (Array.isArray(app_vars)) {

    for (let index = 0; index < app_vars.length; index++) {
      const element = app_vars[index];
      if (element.type == "json" || element.type == "object" || element.type == "js") {
        appvars_obj[element.environment][element.name] = JSON.parse(element.value);
      } else if (element.type == "number") {
        appvars_obj[element.environment][element.name] = Number(element.value);
      } else if (element.type == "boolean") {
        appvars_obj[element.environment][element.name] = Boolean(element.value);
      } else if (element.type == "string") {
        appvars_obj[element.environment][element.name] = String(element.value);
      } else {
        appvars_obj[element.environment][element.name] = element.value;
      }
    }
  }

  return appvars_obj;
}