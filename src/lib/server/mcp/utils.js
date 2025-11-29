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
    const ref = resolveRef(schema.$ref, root);
    return jsonSchemaToZod(ref, root);
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
      if (schema.enum) return z.enum(schema.enum);
      if (schema.const !== undefined) return z.literal(schema.const);
      throw new Error("JSON Schema inválido o no soportado: " + JSON.stringify(schema));

    default:
      throw new Error("Tipo JSON Schema no soportado: " + schema.type);
  }
}

/* ---------------------------------------------------------
   STRING
--------------------------------------------------------- */
function makeString(schema) {
  let out = z.string();

  if (schema.minLength != null) out = out.min(schema.minLength);
  if (schema.maxLength != null) out = out.max(schema.maxLength);
  if (schema.pattern) out = out.regex(new RegExp(schema.pattern));

  if (schema.format) {
    switch (schema.format) {
      case "email": out = out.email(); break;
      case "uuid": out = out.uuid(); break;
      case "uri": out = out.url(); break;
      case "date-time": out = out.datetime(); break;
    }
  }

  if (schema.enum) out = z.enum(schema.enum);
  if (schema.const !== undefined) out = z.literal(schema.const);

  if (schema.nullable) out = out.nullable();

  return out;
}

/* ---------------------------------------------------------
   NUMBER / INTEGER
--------------------------------------------------------- */
function makeNumber(schema) {
  let out = z.number();

  if (schema.type === "integer") {
    out = out.int();
  }

  if (schema.minimum != null) out = out.min(schema.minimum);
  if (schema.maximum != null) out = out.max(schema.maximum);

  if (schema.enum) out = z.enum(schema.enum.map(String)).transform(Number);
  if (schema.const !== undefined) out = z.literal(schema.const);

  if (schema.nullable) out = out.nullable();

  return out;
}

/* ---------------------------------------------------------
   ARRAY
--------------------------------------------------------- */
function makeArray(schema, root) {
  if (!schema.items) throw new Error("El schema array requiere 'items'");

  let item = jsonSchemaToZod(schema.items, root);
  let out = z.array(item);

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
    if (!result) throw new Error("Referencia no encontrada: " + ref);
  }

  return result;
}
