import vm from "node:vm";
import { Blob } from "node:buffer";
import fs from "fs";

const TIMEOUT_VM_MS = 1 * 60 * 1000; // 1 minute
//const TIMEOUT_SANDBOX_JAVASCRIPT = process.env.TIMEOUT_SANDBOX_JAVASCRIPT && Number(process.env.TIMEOUT_SANDBOX_JAVASCRIPT) > 0 ? Number(process.env.TIMEOUT_SANDBOX_JAVASCRIPT) : TIMEOUT_VM_MS;

/**
 * Crea una función async ejecutable de forma segura usando vm
 */
export const createFunctionVM = async (
  /** @type {string} */ code,
  /** @type {object} */ app_vars,
  timeoutVM = TIMEOUT_VM_MS
) => {
  try {
    /**
     * Código que será ejecutado dentro del sandbox
     */
    const wrappedCode = `
      (async () => {
      
  // El timeout ahora controla el AbortController, no la VM
  const controller = new AbortController();
  const signal = controller.signal;
  
   // Si el código tarda más del timeout permitido (timeoutVM + 1s), abortamos.
  let to = setTimeout(() => {
    console.log('Timeout alcanzado, abortando vm...');
    controller.abort();
  }, ${timeoutVM + 1000}); 

        ${code}

clearTimeout(to);

        return {
          data: typeof $_RETURN_DATA_ !== "undefined" ? $_RETURN_DATA_ : null,
          headers: typeof $_CUSTOM_HEADERS_ !== "undefined" ? $_CUSTOM_HEADERS_ : {}
        };
      })()
    `;

    /**
     * Se retorna una función ejecutable
     */
    return async (customVarsAndFunctions = {}) => {
      const defaults = {
        // Valores explícitamente permitidos
        setTimeout,
        clearTimeout,
        clearInterval,
        AbortController,
        console,
        Date,
        Math,
        JSON,
        Array,
        Object,
        String,
        Number,
        Boolean,
        Promise,
        FormData,
        Blob,
        Buffer,
        RegExp,
        parseInt,
        parseFloat,
        fs
      };

      const sandbox = { ...customVarsAndFunctions, ...defaults, ...app_vars };

      // Crear contexto aislado
      const context = vm.createContext(sandbox, {
        name: "sandbox",
        codeGeneration: { strings: false, wasm: false },
      });

      // Compilar script
      const script = new vm.Script(wrappedCode, {
        filename: "sandbox.vm.js",
        //        timeout: 60 * 60 * 1000, // evita loops infinitos // Maximo 1 hora // Revisar
      });

      // Ejecutar
      return await script.runInContext(context, {
        timeout: timeoutVM + 5000,
        breakOnSigint: true, // opcional
      });
    };
  } catch (error) {
    console.error("Error creating secure function:", error);
    return async () => {
      throw new Error("Error creating secure function");
    };
  }
};
