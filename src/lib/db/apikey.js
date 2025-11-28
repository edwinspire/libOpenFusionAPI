import { ApiKey } from "./models.js";

// ===============================
// CRUD para ApiKey
// ===============================
export const ApiKeyCRUD = {
  async create(data) {
    return await ApiKey.create(data);
  },
  async get(idapikey) {
    return await ApiKey.findByPk(idapikey, { include: ["profiles"] });
  },
  async list() {
    return await ApiKey.findAll({ include: ["profiles"] });
  },
  async update(idapikey, data) {
    const record = await ApiKey.findByPk(idapikey);
    if (!record) return null;
    return await record.update(data);
  },
  async delete(idapikey) {
    return await ApiKey.destroy({ where: { idapikey } });
  },
};

