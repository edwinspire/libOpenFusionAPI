import { LogEntry } from "./models.js";
import { Op } from "sequelize";

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

export const getLogs = async (
  startDate,
  endDate,
  idendpoint = null,
  level = null
) => {
  try {
    // Construcción dinámica de los filtros
    const whereConditions = {
      timestamp: {
        [Op.between]: [startDate, endDate], // Rango de fechas
      },
    };

    // Agregar filtro por idendpoint si está definido
    if (idendpoint) {
      whereConditions.idendpoint = idendpoint;
    }

    // Agregar filtro por level si está definido
    if (level !== null) {
      whereConditions.level = level;
    }

    // Realizar la consulta con las condiciones generadas
    const logs = await LogEntry.findAll({
      where: whereConditions,
      order: [["timestamp", "ASC"]], // Ordenar por fecha ascendente
    });

    return logs; // Devolver los resultados
  } catch (error) {
    console.error("Error retrieving logs:", error);
    throw error;
  }
};
