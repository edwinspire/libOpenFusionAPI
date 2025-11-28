import { ApiKeyProfile } from "./models.js";

// ===============================
// CRUD para ApiKeyProfile (ApiKey ↔ Perfiles)
// ===============================
export const ApiKeyProfileCRUD = {
  async create(data) {
    return await ApiKeyProfile.create(data);
  },
  async get(idapikey, idprofile) {
    return await ApiKeyProfile.findOne({ where: { idapikey, idprofile } });
  },
  async listByApiKey(idapikey) {
    return await ApiKeyProfile.findAll({ where: { idapikey } });
  },
  async listAll() {
    return await ApiKeyProfile.findAll();
  },
  async update(idapikey, idprofile, data) {
    const record = await ApiKeyProfile.findOne({
      where: { idapikey, idprofile },
    });
    if (!record) return null;
    return await record.update(data);
  },
  async delete(idapikey, idprofile) {
    return await ApiKeyProfile.destroy({ where: { idapikey, idprofile } });
  },
};
