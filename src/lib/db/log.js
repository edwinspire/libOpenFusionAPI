import { LogEntry } from "./models.js";
//import { getRoleById } from "./role.js";
//import { EncryptPwd, GenToken, customError, md5 } from "../server/utils.js";

export const createLog = async (dataLog) => {
  try {
    return await LogEntry.create(dataLog);
  } catch (error) {
    console.error("Error performing INSERT log:", error);
    throw error;
  }
};

/*
// READ
export const getUserById = async (
   userId
) => {
  try {
    const user = await LogEntry.findByPk(userId);
    return user;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};
*/

export const getAllLogs = async () => {
  try {
    const users = await LogEntry.findAll();
    return users;
  } catch (error) {
    console.error("Error retrieving logs:", error);
    throw error;
  }
};
