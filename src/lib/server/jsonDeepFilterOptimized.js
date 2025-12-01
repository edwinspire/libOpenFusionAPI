/**
 * Búsqueda optimizada para JSON muy grandes.
 *
 * @param {string[]} keywords - Palabras clave a buscar
 * @param {any} data - Objeto o arreglo JSON
 * @returns {any} JSON filtrado manteniendo la estructura
 */
function jsonDeepFilterOptimized(keywords, data) {
    if (!Array.isArray(keywords) || keywords.length === 0) return {};

    // Convertir keywords a minúsculas
    const lowerKeywords = keywords.map(k => k.toLowerCase());

    // Función para verificar si un valor coincide
    function matches(value) {
        if (value == null) return false;

        // Solo strings y números
        if (typeof value === "string" || typeof value === "number") {
            const val = String(value).toLowerCase();
            for (const k of lowerKeywords) {
                if (val.includes(k)) return true;
            }
        }

        return false;
    }

    // Función recursiva optimizada
    function recurse(node) {
        if (node == null) return undefined;

        // --- Si es un array
        if (Array.isArray(node)) {
            const result = [];

            for (let i = 0; i < node.length; i++) {
                const item = node[i];

                // Coincidencia directa
                if (matches(item)) {
                    result.push(item);
                    continue;
                }

                // Recursión si es objeto/array
                if (typeof item === "object") {
                    const nested = recurse(item);
                    if (nested !== undefined) {
                        result.push(nested);
                    }
                }
            }

            return result.length > 0 ? result : undefined;
        }

        // --- Si es un objeto
        if (typeof node === "object") {
            let found = false;
            const result = {};

            for (const key in node) {
                const value = node[key];

                // Coincidencia directa
                const direct = matches(value);

                // Recursión si es objeto o arreglo
                let nested;
                if (typeof value === "object") {
                    nested = recurse(value);
                }

                if (direct || nested !== undefined) {
                    found = true;
                    result[key] = nested !== undefined ? nested : value;
                }
            }

            return found ? result : undefined;
        }

        // --- Si es un valor simple
        return matches(node) ? node : undefined;
    }

    // Llamada inicial
    const output = recurse(data);

    // Reglas finales para mantener el tipo original
    if (Array.isArray(data)) return output || [];
    if (typeof data === "object") return output || {};

    return {};
}
