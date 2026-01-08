import vm from "node:vm";
import { functionsVars } from "./functionVars.js";
import { Blob } from "node:buffer";

const TIMEOUT_VM_MS = 1 * 60 * 1000; // 1 minute
const TIMEOUT_SANDBOX_JAVASCRIPT = process.env.TIMEOUT_SANDBOX_JAVASCRIPT && Number(process.env.TIMEOUT_SANDBOX_JAVASCRIPT) > 0 ? Number(process.env.TIMEOUT_SANDBOX_JAVASCRIPT) : TIMEOUT_VM_MS;

/**
 * Crea una función async ejecutable de forma segura usando vm
 */
export const createFunctionVM = async (
  /** @type {string} */ code,
  /** @type {object} */ app_vars
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
  
  // Si el fetch tarda más de 30 segundos, lo cancelamos.
  let to = setTimeout(() => {
    console.log('Timeout alcanzado, abortando vm...');
    controller.abort();
  }, ${TIMEOUT_SANDBOX_JAVASCRIPT - 1}); 

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
        clearInterval,
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
        Buffer
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
        timeout: TIMEOUT_SANDBOX_JAVASCRIPT,
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

export const createFunction_old = async (
  /** @type {string} */ code,
  /** @type {string} */ app_vars
) => {
  let app_vars_string = "";
  // TODO: la variable app_vars no se la debería usar ya que al crear el codigo de la función ya se reemplaza el nombre de la variable por el valor que se la ha asignado.
  let fn = new Function("$_VARS_", "throw new Error('No code to execute');");

  try {
    let vars = Object.keys(await functionsVars()).join(", ");

    let codefunction = `
return async()=>{
  ${app_vars_string}  
  let {${vars}} = $_VARS_;
  
  ${code}
  return {data: $_RETURN_DATA_, headers: $_CUSTOM_HEADERS_};  
}
`;

    fn = new Function("$_VARS_", codefunction);
  } catch (error) {
    fn = new Function("", "throw new Error('Error creating function');");
  }

  return fn;
};
