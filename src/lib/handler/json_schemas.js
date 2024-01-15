export const schema_return_customFunction = {
    type: "object",
    properties: {
      env: { type: "string" },
      app: { type: "string" },
      data: { type: "object" },
    },
    required: ["env", "app", "data"],
  };
  