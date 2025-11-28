import { ApiUser, ApiKey, ApiProfile } from "./models.js";

// ===============================
// CRUD para ApiUser
// ===============================
export const ApiUserCRUD = {
  async create(data) {
    return await ApiUser.create(data);
  },

  async get(idapiuser) {
    return await ApiUser.findByPk(idapiuser, {
      include: [
        {
          model: ApiKey,
          as: "apikeys",
          include: [
            {
              model: ApiProfile,
              as: "profiles",
            },
          ],
        },
      ],
    });
  },

  async list() {
    return await ApiUser.findAll({
      include: [
        {
          model: ApiKey,
          as: "apikeys",
        },
      ],
    });
  },

  async update(idapiuser, data) {
    const record = await ApiUser.findByPk(idapiuser);
    if (!record) return null;
    return await record.update(data);
  },

  async delete(idapiuser) {
    return await ApiUser.destroy({ where: { idapiuser } });
  },
};
