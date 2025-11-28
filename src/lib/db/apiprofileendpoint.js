import { ApiProfileEndpoint } from "./models.js";

// ===============================
// CRUD para ApiProfileEndpoint (Perfiles ↔ Endpoints)
// ===============================
export const ApiProfileEndpointCRUD = {
  async create(data) {
    return await ApiProfileEndpoint.create(data);
  },
  async get(idprofile, idendpoint) {
    return await ApiProfileEndpoint.findOne({
      where: { idprofile, idendpoint },
    });
  },
  async listByProfile(idprofile) {
    return await ApiProfileEndpoint.findAll({ where: { idprofile } });
  },
  async listAll() {
    return await ApiProfileEndpoint.findAll();
  },
  async update(idprofile, idendpoint, data) {
    const record = await ApiProfileEndpoint.findOne({
      where: { idprofile, idendpoint },
    });
    if (!record) return null;
    return await record.update(data);
  },
  async delete(idprofile, idendpoint) {
    return await ApiProfileEndpoint.destroy({
      where: { idprofile, idendpoint },
    });
  },
};
