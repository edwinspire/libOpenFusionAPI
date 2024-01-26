export const schema_return_customFunction = {
  type: "object",
  properties: {
    code: { type: "number" },
    data: { type: ["object", "array", 'boolean'] },
  },
  required: ["code", "data"],
};

export const schema_input_genericSOAP = {
  type: "object",
  properties: {
    wsdl: { type: "string" },
    functionName: { type: "string" },
    BasicAuthSecurity: {
      type: "object",
      properties: { User: { type: "string" }, Password: { type: "string" } },
      required: ["User"],
    },
    BearerSecurity: { type: "string" },
  },
  required: ["wsdl", "functionName"],
};
