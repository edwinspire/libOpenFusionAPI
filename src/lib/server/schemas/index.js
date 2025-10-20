import Ajv from "ajv";
export const ajv = new Ajv();

export const schema_input_hooks = {
  type: "object",
  properties: {
    env: { type: "string" },
    app: { type: "string" },
    data: { type: "object" },
  },
  required: ["env", "app", "data"],
};

const schema_ws_message = {
  title: "MensajeConPayload",
  type: "object",
  properties: {
    payload: {
      description: "Cualquier valor excepto null",
      type: ["object", "array", "string", "number", "boolean"],
    },
    channel: {
      description: "Message channel identifier",
      type: ["string"],
    },
    recipients: {
      description:
        "Opcional; si está presente debe ser un arreglo (puede estar vacío).",
      type: "array",
    },
  },

  required: ["payload", "channel"],
  additionalProperties: false,
};

export const validateSchemaMessageWebSocket = ajv.compile(schema_ws_message);
