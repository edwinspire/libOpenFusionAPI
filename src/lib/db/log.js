import { LogEntry, Endpoint } from "./models.js";
import { Op, Sequelize } from "sequelize";

//import { getRoleById } from "./role.js";
//import { EncryptPwd, GenToken, customError, md5 } from "../server/utils.js";

export const LOG_LEVEL = Object.freeze({
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5,
  0: "TRACE",
  1: "DEBUG",
  2: "INFO",
  3: "WARN",
  4: "ERROR",
  5: "FATAL",
});

export const getLogLevelByStatusCode = (status_code) => {
  let r = LOG_LEVEL.DEBUG;
  if (status_code >= 100 && status_code <= 199) {
    r = LOG_LEVEL.INFO;
  } else if (status_code >= 200 && status_code <= 299) {
    r = LOG_LEVEL.DEBUG;
  } else if (status_code >= 300 && status_code <= 399) {
    r = LOG_LEVEL.INFO;
  } else if (status_code >= 400 && status_code <= 499) {
    r = LOG_LEVEL.ERROR;
  } else if (status_code >= 500 && status_code <= 599) {
    r = LOG_LEVEL.FATAL;
  }

  return r;
};

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

/*
export const getLogs = async (
  startDate,
  endDate,
  idendpoint = null,
  level = null,
  limit = 1000
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
      order: [["timestamp", "DESC"]], // Ordenar por fecha ascendente
      limit: parseInt(limit, 10) || 100,
    });

    return logs; // Devolver los resultados
  } catch (error) {
    console.error("Error retrieving logs:", error);
    throw error;
  }
};
*/

export const getLogs = async ({
  idapp,
  idendpoint,
  hours,
  level,
  limit,
} = {}) => {
  const where = {};

  // 1. Filtro por timestamp
  if (hours !== undefined) {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    where.timestamp = { [Op.gte]: cutoffDate };
  }

  // 2. Filtro por idendpoint en LogEntry
  if (idendpoint) {
    where.idendpoint = idendpoint;
  }

  // Agregar filtro por level si está definido
  // Corrección: El valor 0 es válido, por lo que la comparación debe ser con undefined o null.
  if (level !== undefined && level !== null) {
    where.level = level;
  }

  // 3. Configuración del include para Endpoint
  const include = [
    {
      model: Endpoint,
      as: "endpoint", // <<< ¡ESTA ES LA LÍNEA CLAVE! Usa el alias definido en la asociación.
      required: true, // Esto forza un INNER JOIN
      attributes: ["idapp", "environment", "method", "handler"],
      // Filtro por idapp en la tabla Endpoint
      where: idapp ? { idapp } : undefined,
    },
  ];

  // 4. Configuración final de la consulta
  const options = {
    where,
    include,
    attributes: [
      "idendpoint",
      // "id", // TU MODELO LogEntry no tiene un campo 'id'. Lo he comentado.
      "timestamp",
      "level",
      "status_code",
      "user_agent",
      "client",
      "req_headers",
      "response_time",
      "url",
    ],
    // Ordenamos por 'timestamp' que sí existe en tu modelo
    order: [["timestamp", "DESC"]],
    limit: limit || 99999,
    raw: true, // <<< LÍNEA CLAVE: habilita el modo raw
  };

  return LogEntry.findAll(options);
};
