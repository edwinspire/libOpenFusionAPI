import { functionsVars } from "./functionVars.js";

export const createFunction = async (code, app_vars) => {
  let app_vars_string = "";
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
