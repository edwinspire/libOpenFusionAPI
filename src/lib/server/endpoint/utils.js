

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

  // Preprocesar: crear mapa de reemplazos y ordenar por longitud descendente
  // Esto evita problemas como reemplazar "aa" antes que "aaa"
  const map = new Map();
  const entries = [];

  for (const item of replacements) {
    if (!item || typeof item.name !== "string" || item.name === "") continue;

    const key = item.name;
    const value =
      item.value === undefined || item.value === null ? "" : String(item.value);

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


