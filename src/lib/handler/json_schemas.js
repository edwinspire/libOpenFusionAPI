export const schema_return_customFunction = {
    type: "object",
    properties: {
      code: { type: "number" },
      data: { type: ["object", "array"] },
    },
    required: ["code", "data"],
  };
  