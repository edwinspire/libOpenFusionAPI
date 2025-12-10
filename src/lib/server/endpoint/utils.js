import { parse } from "acorn";
import { generate } from "astring";


export function safeInjectVars(code, variables) {
  // 1. Parsear a AST
  const ast = parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
  });

  // 2. Recorrer y reemplazar solo Identifiers válidos
  walkAST(ast, (node) => {
    if (node.type === "Identifier" && variables.hasOwnProperty(node.name)) {
      return {
        type: "Literal",
        value: variables[node.name],
      };
    }
  });

  // 3. Regenerar el código final
  return generate(ast);
}

// Recorrido simple del AST
function walkAST(node, fn) {
  const replacement = fn(node);
  if (replacement) {
    Object.assign(node, replacement);
  }

  for (const key in node) {
    const value = node[key];
    if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        value.forEach((v) => v && walkAST(v, fn));
      } else {
        walkAST(value, fn);
      }
    }
  }
}

export function getLogLevelForStatus(status) {
  if (status >= 100 && status <= 199) return "info";
  if (status >= 200 && status <= 299) return "success";
  if (status >= 300 && status <= 399) return "redirect";
  if (status >= 400 && status <= 499) return "client_error";
  if (status >= 500 && status <= 599) return "server_error";
  return "unknown";
}

/*
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
  */

