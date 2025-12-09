// Función auxiliar para escapar caracteres especiales en regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapa caracteres especiales
}

export const replaceStringTemplate = (html, replaces) => {
  /*
    const replaces = {
  "$USER$": "Edwin",
  "$PWD$": "1234567"
};
*/
  for (const [patron, valor] of Object.entries(replaces)) {
    html = html.replace(new RegExp(escapeRegExp(patron), "g"), valor);
  }
  return html;
};
