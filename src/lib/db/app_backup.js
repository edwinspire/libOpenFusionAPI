import { ApplicationBackup } from "./models.js";

export const createAppLog = async (app_data) => {
  try {
    return await ApplicationBackup.create(app_data);
  } catch (error) {
    console.error("Error performing INSERT:", error);
    throw error;
  }
};
