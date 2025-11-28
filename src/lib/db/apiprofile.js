import { ApiProfile } from "./models.js";


// ===============================
// CRUD para ApiProfile
// ===============================
export const ApiProfileCRUD = {
  async create(data) {
    return await ApiProfile.create(data);
  },
  async get(idprofile) {
    return await ApiProfile.findByPk(idprofile, {
      include: ["allowed_endpoints", "apikeys"],
    });
  },
  async list() {
    return await ApiProfile.findAll({ include: ["allowed_endpoints"] });
  },
  async update(idprofile, data) {
    const record = await ApiProfile.findByPk(idprofile);
    if (!record) return null;
    return await record.update(data);
  },
  async delete(idprofile) {
    return await ApiProfile.destroy({ where: { idprofile } });
  },
};
