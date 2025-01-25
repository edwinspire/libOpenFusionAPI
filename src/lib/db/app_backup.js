import { ApplicationBackup } from "./models.js";
import { Op } from "sequelize";

export const createAppLog = async (app_data) => {
  try {
    return await ApplicationBackup.create(app_data);
  } catch (error) {
    console.error("Error performing INSERT:", error);
    throw error;
  }
};
