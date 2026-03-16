import Zod from "zod";

export const webhookSchema = Zod.object({
  host: Zod.string().min(1, { message: "Host is required." }),
  database: Zod.string().min(1, { message: "Database is required." }),
  schema: Zod.string().min(0, { message: "Schema is required." }),
  model: Zod.string().min(1, { message: "Model is required." }),
  action: Zod.enum(
    ["insert", "update", "delete", "upsert", "afterUpsert", "afterCreate"],
    {
      message:
        "Valid options: 'insert', 'update', 'delete', 'bulk_insert', 'bulk_update', 'upsert'",
    }
  ),
  data: Zod.record(Zod.any()).optional(),
});

export const validateAppName = (name) => {
  const regex = /^[a-zA-Z0-9_~.-]+$/;
  return regex.test(name);
};
