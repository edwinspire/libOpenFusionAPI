//import Ajv from "ajv";
//const ajv = new Ajv() ;

export const schema_input_hooks = {
  type: "object",
  properties: {
    env: { type: "string" },
    app: { type: "string" },
    data: { type: "object" },
  },
  required: ["env", "app", "data"],
};
