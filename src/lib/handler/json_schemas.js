export const schema_return_customFunction = {
  type: "object",
  properties: {
    code: { type: "number" },
    data: { type: ["object", "array"] },
  },
  required: ["code", "data"],
};


export const schema_input_genericSOAP = {
  type: "object",
  properties: {
    wsdl: { type: "string" },
    function: { type: "string" },
    BasicAuthSecurity: {
      type: "object",
      properties: { User: { type: "string" }, Password: { type: "string" } }, required: ["User"]
    }
  },
  required: ["wsdl", "function"],
};
