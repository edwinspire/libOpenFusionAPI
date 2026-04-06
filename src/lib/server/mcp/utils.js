// jsonSchemaToZod.js
import { z } from "zod";

/**
 * Convierte JSON Schema estándar a Zod 4 (compatible con MCP SDK).
 * @param {object} schema JSON Schema
 * @param {object} [root] Schema raíz (para resolver $ref)
 */
export function jsonSchemaToZod(schema, root = null) {
  root = root || schema;

  // Manejo de $ref
  if (schema.$ref) {
    return jsonSchemaToZod(resolveRef(schema.$ref, root), root);
  }

  // type como array: e.g. ["string", "null"] → z.union
  if (Array.isArray(schema.type)) {
    const types = schema.type.map(t => jsonSchemaToZod({ ...schema, type: t }, root));
    return types.length === 1 ? types[0] : z.union(types);
  }

  // Manejo de combinadores
  if (schema.oneOf) {
    return z.union(schema.oneOf.map(s => jsonSchemaToZod(s, root)));
  }

  if (schema.anyOf) {
    return z.union(schema.anyOf.map(s => jsonSchemaToZod(s, root)));
  }

  if (schema.allOf) {
    return schema.allOf
      .map(s => jsonSchemaToZod(s, root))
      .reduce((acc, cur) => acc.and(cur));
  }

  // Soporte de negación de requeridos: { not: { required: ["field"] } }
  // Útil para reglas condicionales tipo INSERT/UPDATE en anyOf.
  if (schema.not && Array.isArray(schema.not.required)) {
    return makeNotRequiredConstraint(schema.not.required, schema.description);
  }

  // Tipos primitivos
  switch (schema.type) {
    case "string":
      return makeString(schema);

    case "number":
    case "integer":
      return makeNumber(schema);

    case "boolean":
      return z.boolean();

    case "null":
      return z.null();

    case "array":
      return makeArray(schema, root);

    case "object":
      return makeObject(schema, root);

    case undefined:
      // Puede ser enum-only, const-only o combinators
      if (schema.enum !== undefined) return makeEnum(schema.enum);
      if (schema.const !== undefined) return z.literal(schema.const);
      throw new Error("JSON Schema inválido o no soportado: " + JSON.stringify(schema));

    default:
      throw new Error("Tipo JSON Schema no soportado: " + schema.type);
  }
}

function makeNotRequiredConstraint(requiredKeys, description) {
  let out = z.record(z.unknown()).refine(
    (obj) => !requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(obj, key)),
    {
      message: description || `Properties [${requiredKeys.join(", ")}] must not exist at the same time.`,
    }
  );

  return out;
}

/* ---------------------------------------------------------
  ENUM - supports mixed values (string, number, boolean, null)
--------------------------------------------------------- */
function makeEnum(values) {
  // z.enum() en Zod v4 solo acepta arrays de strings
  if (values.every(v => typeof v === "string")) {
    return z.enum(values);
  }
  // Para valores mixtos usamos z.union de literales
  const literals = values.map(v => z.literal(v));
  return literals.length === 1 ? literals[0] : z.union(literals);
}

/* ---------------------------------------------------------
   STRING
--------------------------------------------------------- */
function makeString(schema) {
  let out = z.string();

  if (schema.minLength != null) out = out.min(schema.minLength);
  if (schema.maxLength != null) out = out.max(schema.maxLength);
  if (schema.pattern) out = out.regex(new RegExp(schema.pattern));

  // Zod v4: los formatos son métodos de z.string(), no top-level
  if (schema.format) {
    switch (schema.format) {
      case "email": out = out.email(); break;
      case "uuid": out = out.uuid(); break;
      case "uri": out = out.url(); break;
      case "date-time": out = out.datetime(); break;
    }
  }

  // enum y const tienen prioridad sobre el tipo base
  if (schema.enum !== undefined) return makeEnum(schema.enum);
  if (schema.const !== undefined) return z.literal(schema.const);

  if (schema.nullable) out = out.nullable();

  return out;
}

/* ---------------------------------------------------------
   NUMBER / INTEGER
--------------------------------------------------------- */
function makeNumber(schema) {
  let out = z.number();

  if (schema.type === "integer") out = out.int();
  if (schema.minimum != null) out = out.min(schema.minimum);
  if (schema.maximum != null) out = out.max(schema.maximum);

  if (schema.enum !== undefined) return makeEnum(schema.enum);
  if (schema.const !== undefined) return z.literal(schema.const);

  if (schema.nullable) out = out.nullable();

  return out;
}

/* ---------------------------------------------------------
   ARRAY
--------------------------------------------------------- */
function makeArray(schema, root) {
  // Sin items: array de elementos desconocidos
  if (!schema.items) return z.array(z.unknown());

  // Soporte de tuplas: items como array de schemas
  if (Array.isArray(schema.items)) {
    const items = schema.items.map(s => jsonSchemaToZod(s, root));
    return z.tuple(items);
  }

  let out = z.array(jsonSchemaToZod(schema.items, root));

  if (schema.minItems != null) out = out.min(schema.minItems);
  if (schema.maxItems != null) out = out.max(schema.maxItems);

  if (schema.nullable) out = out.nullable();

  return out;
}

/* ---------------------------------------------------------
   OBJECT
--------------------------------------------------------- */
function makeObject(schema, root) {
  const shape = {};

  const props = schema.properties || {};
  const required = schema.required || [];

  for (const [key, value] of Object.entries(props)) {
    let zProp = jsonSchemaToZod(value, root);

    if (!required.includes(key)) zProp = zProp.optional();

    shape[key] = zProp;
  }

  let out = z.object(shape);

  if (schema.nullable) out = out.nullable();

  return out;
}

/* ---------------------------------------------------------
   $REF RESOLUTION
--------------------------------------------------------- */
function resolveRef(ref, root) {
  if (!ref.startsWith("#/")) {
    throw new Error("Solo se soportan referencias internas ($ref '#/...')");
  }

  const path = ref.substring(2).split("/");
  let result = root;

  for (const p of path) {
    result = result[p];
    // Usar === undefined para no fallar con valores falsy legítimos (0, false, "")
    if (result === undefined) throw new Error("Referencia no encontrada: " + ref);
  }

  return result;
}
