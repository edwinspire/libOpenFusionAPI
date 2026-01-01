import { LogEntry } from "./models.js";
import { getEndpointByIdApp, getAllEndpoints } from "./endpoint.js";
import { Op, Sequelize } from "sequelize";
import dbsequelize from "./sequelize.js";

import { DateTime } from "luxon";

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

export const createLogEntriesBulk = async (logDataArray) => {
  if (!logDataArray || logDataArray.length === 0) {
    return { success: true, inserted: 0 };
  }

  const t = await dbsequelize.transaction();

  try {
    const processedData = logDataArray.map((log) => ({
      ...log,
      // Asegurar formato correcto de timestamps
      timestamp:
        log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp),

      // Para campos JSON, Sequelize los convertirá automáticamente con tus getters/setters
      // Pero para máxima performance, podrías pre-procesarlos aquí
    }));

    await LogEntry.bulkCreate(processedData, {
      transaction: t,
      individualHooks: false, // Deshabilitar hooks para mejor performance
      returning: false,
      ignoreDuplicates: false,
    });

    await t.commit();

    return {
      success: true,
      inserted: processedData.length,
      timestamp: new Date(),
    };
  } catch (error) {
    await t.rollback();
    console.error("Error en bulk insert de logs:", error);

    throw error;
  }
};


/**
 * Función para consultar logs con filtros opcionales
 * @param {Object} options - Parámetros de filtrado
 * @param {number} options.last_hours - Últimas N horas desde ahora (ej: 24 = últimas 24 horas)
 * @param {Date|string} options.start_date - Fecha de inicio (inclusive)
 * @param {Date|string} options.end_date - Fecha de fin (inclusive)
 * @param {string} options.idendpoint - UUID del endpoint
 * @param {number} options.level - Nivel del log (SMALLINT)
 * @param {string} options.method - Método HTTP (GET, POST, etc.)
 * @param {number} options.status_code - Código de estado HTTP
 * @param {number} options.limit - Límite de registros a devolver (default: 1000, max: 10000)
 * @param {number} options.offset - Offset para paginación
 * @param {string} options.order - Campo para ordenar (default: 'timestamp')
 * @param {string} options.orderDirection - Dirección del orden (ASC/DESC, default: 'DESC')
 * @returns {Promise<{data: Array, total: number, meta: Object}>}
 */
export const getLogs = async (options = {}) => {
  try {
    // === PROCESAMIENTO DE PARÁMETROS ===

    // Parámetros con valores por defecto
    const {
      idapp,
      last_hours,
      start_date,
      end_date,
      idendpoint,
      level,
      method,
      status_code,
      limit = 1000,
      offset = 0,
      order = "timestamp",
      orderDirection = "DESC",
      raw = true, // Si quieres objetos planos en lugar de instancias de Sequelize
    } = options;

    let endpoints;

    // === VALIDACIONES ===

    // Validar límite
    if (limit > 999999) {
      throw new Error("El límite no puede ser mayor a 999999 registros");
    }

    if (limit < 1) {
      throw new Error("El límite debe ser mayor a 0");
    }

    /*
    // Validar offset
    if (offset < 0) {
      throw new Error('El offset no puede ser negativo');
    }
    */

    // Validar dirección de orden
    const validOrderDirections = ["ASC", "DESC"];
    if (!validOrderDirections.includes(orderDirection.toUpperCase())) {
      throw new Error("La dirección de orden debe ser ASC o DESC");
    }

    // === CONSTRUCCIÓN DE CONDICIONES WHERE ===

    const whereConditions = {};

    // === FILTROS DE FECHA ===

    let dateFilter = null;

    // Si se proporcionan start_date y end_date, usar esos
    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Las fechas proporcionadas no son válidas");
      }

      // Asegurar que end_date sea posterior a start_date (Esto se debería validar en el lado del cliente)
      if (startDate >= endDate) {
        throw new Error(
          "La fecha de inicio debe ser anterior a la fecha de fin"
        );
      }

      dateFilter = {
        [Op.between]: [startDate, endDate],
      };
    } else if (last_hours) {
      let last_hours_int = parseInt(last_hours);
      // Si se proporciona last_hours, calcular desde ahora hacia atrás
      if (typeof last_hours_int !== "number" || last_hours_int <= 0) {
        throw new Error("last_hours debe ser un número positivo");
      }
      // TODO: Es posible que se deba usar Luxon para los calculos de fechas
      //const now = new Date();

      // 1. Obtener la fecha y hora actual
      const ahora = DateTime.now();
      // 2. Restar 5 horas
      const tiempoAtras = ahora.minus({ hours: last_hours || 1 });

      // 3. Convertir el resultado a un objeto Date de JavaScript
      const pastDate = tiempoAtras.toJSDate();
      /*
      const pastDate = new Date(
        now.getTime() - last_hours_int * 60 * 60 * 1000
      );
      */

      dateFilter = {
        [Op.gte]: pastDate, // Greater Than or Equal
      };
    }

    // Aplicar filtro de fecha si existe
    if (dateFilter) {
      whereConditions.timestamp = dateFilter;
    }

    // === OTROS FILTROS (solo si se proporcionan) ===

    /*
    // Filtro por level
    if (level !== undefined && level !== null) {
      if (!Number.isInteger(level) || level < -32768 || level > 32767) {
        throw new Error(
          "level debe ser un entero entre -32768 y 32767 (SMALLINT)"
        );
      }
      whereConditions.level = level;
    }
    */

    // Filtro por method
    if (method) {
      if (typeof method !== "string" || method.trim().length === 0) {
        throw new Error("method debe ser una cadena de texto válida");
      }
      whereConditions.method = method.toUpperCase().trim();
    }

    // Filtro por status_code
    if (status_code !== undefined && status_code !== null) {
      if (
        !Number.isInteger(status_code) ||
        status_code < 100 ||
        status_code > 599
      ) {
        throw new Error(
          "status_code debe ser un entero positivo entre 100 y 599"
        );
      }
      whereConditions.status_code = status_code;
    }

    // Filtro por App o idendpoint
    let endpointFilter;
    if (idapp) {
      // === FILTROS DE ENDPONTS (NUEVA FUNCIONALIDAD) ===
      endpoints = await getEndpointByIdApp(idapp);

      let idendpoints = endpoints.map((ep) => {
        return ep.idendpoint;
      });

      // Prioridad: idendpoints > idendpoint
      if (idendpoints && idendpoints.length > 0) {
        // Usar el array de endpoints
        endpointFilter = {
          [Op.in]: idendpoints,
        };
      }
    } else if (idendpoint) {
      if (typeof idendpoint !== "string" || idendpoint.length === 0) {
        throw new Error("idendpoint debe ser una cadena de texto válida");
      }
      // Usar el endpoint individual
      endpointFilter = idendpoint;
    }

    // Aplicar filtro de endpoints si existe
    if (endpointFilter) {
      whereConditions.idendpoint = endpointFilter;
    }

    // === CONFIGURACIÓN DE LA CONSULTA ===

    const queryOptions = {
      where: whereConditions,
      attributes: [
        "id",
        "timestamp",
        "idapp",
        "idendpoint",
        "url",
        "method",
        "status_code",
        "user_agent",
        "client",
        "req_headers",
        "res_headers",
        "response_time",
        "response_data",
        "message",
      ],
      order: [[order, orderDirection.toUpperCase()]],
      limit: parseInt(limit),
      // offset: parseInt(offset),
      raw: raw, // Devolver objetos planos si se solicita
    };

    // === EJECUTAR CONSULTA ===
    // Ejecutar consulta principal
    const logs = await LogEntry.findAll(queryOptions);

    /*
    // Obtener conteo total para metadata (solo si se necesita)
    const totalCount = await LogEntry.count({
      where: whereConditions
    });
    */

    /*
    // === PREPARAR RESPUESTA ===
    
    const response = {
      success: true,
      data: logs,
      meta: {
        total: totalCount,
        returned: logs.length,
        limit: queryOptions.limit,
        offset: queryOptions.offset,
        hasMore: (queryOptions.offset + queryOptions.limit) < totalCount,
        filters_applied: Object.keys(whereConditions).length,
        order: `${order} ${orderDirection}`,
        query_timestamp: new Date().toISOString()
      },
      pagination: {
        page: Math.floor(queryOptions.offset / queryOptions.limit) + 1,
        pages: Math.ceil(totalCount / queryOptions.limit),
        per_page: queryOptions.limit
      }
    };
    */

    //    console.log(`✅ Consulta ejecutada exitosamente: ${logs.length}`);
    let response = [];

    /*
    // Añadir idapp a cada log si es necesario - YA NO SE USA PORQUE HAY UN CAMPO idapp EN LogEntry
    if (logs.length > 0) {
      if (!endpoints) {
        endpoints = await getAllEndpoints();
      }

      const obj_endpoints = {};

      for (let index = 0; index < endpoints.length; index++) {
        const element = endpoints[index];
        obj_endpoints[element.idendpoint] = element.idapp;
      }

      response = logs.map((log) => {
        if (idapp) {
          log.idapp = idapp;
        } else {
          //
          log.idapp = obj_endpoints[log.idendpoint];
        }
        return log;
      });
    }
    */

    return response;
  } catch (error) {
    console.error("❌ Error en getLogs:", error);

    throw error;
  }
};

// === FUNCIONES AUXILIARES ÚTILES ===

/**
 * Función específica para obtener logs por endpoint
 * @param {string} endpointId - UUID del endpoint
 * @param {Object} additionalFilters - Filtros adicionales
 */
export const getLogsByEndpoint = async (endpointId, additionalFilters = {}) => {
  return await getLogs({
    idendpoint: endpointId,
    ...additionalFilters,
  });
};

/**
 * Función para obtener estadísticas básicas de logs
 * @param {Object} filters - Filtros a aplicar
 */
export const getLogStats = async (filters = {}) => {
  try {
    const queryOptions = {
      where: {},
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("*")), "total_logs"],
        [sequelize.fn("MIN", sequelize.col("timestamp")), "oldest_log"],
        [sequelize.fn("MAX", sequelize.col("timestamp")), "newest_log"],
        [
          sequelize.fn("AVG", sequelize.col("response_time")),
          "avg_response_time",
        ],
        [sequelize.fn("COUNT", sequelize.col("level")), "logs_by_level"],
      ],
      raw: true,
    };

    // Aplicar filtros
    if (filters.last_hours) {
      const now = new Date();
      const pastDate = new Date(
        now.getTime() - filters.last_hours * 60 * 60 * 1000
      );
      queryOptions.where.timestamp = { [Op.gte]: pastDate };
    }

    if (filters.idendpoint) {
      queryOptions.where.idendpoint = filters.idendpoint;
    }

    /*
    if (filters.level !== undefined) {
      queryOptions.where.level = filters.level;
    }
    */

    const stats = await LogEntry.findAll(queryOptions);

    return {
      success: true,
      data: stats[0],
      filters_applied: Object.keys(queryOptions.where).length,
    };
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/*
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
*/

/**
 * Obtiene la cantidad de registros por minuto para un endpoint específico
 * en las últimas N horas (por defecto 24 horas).
 *
 * @param {string} idendpoint - UUID del endpoint a filtrar
 * @param {number} [last_hours=24] - Número de horas a considerar (desde ahora hacia atrás)
 * @returns {Promise<Array>} - Array con { timestamp, idendpoint, count }
 */
export const getLogsRecordsPerMinute = async (options) => {
  // Parámetros con valores por defecto
  const {
    idapp,
    last_hours = 24,
    idendpoint,
    raw = true, // Si quieres objetos planos en lugar de instancias de Sequelize
  } = options;

  try {
    // Validaciones básicas
    //if (!idendpoint) throw new Error("Se requiere un idendpoint válido");
    if (last_hours <= 0)
      throw new Error("Las horas deben ser un número positivo");

    const sequelize = LogEntry.sequelize;

    const endDate = new Date(); // Ahora
    //const startDate = new Date(endDate.getTime() - last_hours * 60 * 60 * 1000); // Fecha de inicio

    // 1. Obtener la fecha y hora actual
    const ahora = DateTime.now();
    // 2. Restar 5 horas
    const tiempoAtras = ahora.minus({ hours: last_hours || 1 });

    // 3. Convertir el resultado a un objeto Date de JavaScript
    const startDate = tiempoAtras.toJSDate();

    // Filtro por App o idendpoint
    let endpointFilter;
    if (idapp) {
      // === FILTROS DE ENDPONTS (NUEVA FUNCIONALIDAD) ===
      let endpoints = await getEndpointByIdApp(idapp);

      let idendpoints = endpoints.map((ep) => {
        return ep.idendpoint;
      });

      // Prioridad: idendpoints > idendpoint
      if (idendpoints && idendpoints.length > 0) {
        // Usar el array de endpoints
        endpointFilter = {
          [Op.in]: idendpoints,
        };
      }
    } else if (idendpoint) {
      if (typeof idendpoint !== "string" || idendpoint.length === 0) {
        throw new Error("idendpoint debe ser una cadena de texto válida");
      }
      // Usar el endpoint individual
      endpointFilter = idendpoint;
    }

    // === CONSULTA PARA OBTENER CONTEOS POR MINUTO ===
    // Usamos DATE_TRUNC de PostgreSQL para agrupar por minuto
    /*
    const rawResults = await LogEntry.findAll({
      where: {
        [Op.and]: [
          { timestamp: { [Op.between]: [startDate, endDate] } },
          { idendpoint: endpointFilter },
        ],
      },
      attributes: [
        // Extraemos el inicio del minuto (YYYY-MM-DD HH:MM:00)
        [
          sequelize.fn("DATE_TRUNC", "minute", sequelize.col("timestamp")),
          "minute",
        ],
        "idendpoint",
        [sequelize.fn("COUNT", "*"), "count"],
      ],
      group: ["minute", "idendpoint"], // Agrupamos por minuto e idendpoint
      order: [["minute", "ASC"]],
      raw: true, // Obtenemos resultados crudos para manipular fechas
    });
    */
    const rawResults = await getCountsByMinute(
      sequelize,
      startDate,
      endDate,
      endpointFilter
    );

    /*
    // === GENERAR TODOS LOS MINUTOS EN EL RANGO (24 HORAS) ===
    // Crearemos un array con cada minuto entre startDate y endDate
    const allMinutes = [];
    let currentMinute = new Date(startDate);

    while (currentMinute <= endDate) {
      // Clonamos la fecha para evitar mutación
      const minuteTimestamp = new Date(currentMinute);
      allMinutes.push(minuteTimestamp);

      // Avanzamos 1 minuto
      currentMinute.setMinutes(currentMinute.getMinutes() + 1);
    }

    // === MAPPING DE RESULTADOS A UN OBJETO ===
    // Convertimos los resultados en un mapa para buscar fácilmente
    const resultsMap = {};
    rawResults.forEach((row) => {
      // La columna 'minute' viene como string (ej: "2023-10-15 14:30:00")
      const minuteDate = new Date(row.minute);
      const key = minuteDate.toISOString(); // Usamos ISO para clave única
      resultsMap[key] = parseInt(row.count, 10);
    });

    // === CONSTRUIR EL RESULTADO FINAL (INCLUYE MINUTOS CON CERO) ===
    const finalResult = allMinutes.map((minute) => {
      const key = minute.toISOString();
      const count = resultsMap[key] || 0; // Si no existe, usamos 0

      return {
        timestamp: minute.toISOString(), // Formato: "2023-10-15T14:30:00.000Z"
        idendpoint: idendpoint,
        count: count,
      };
    });

    return {
      success: true,
      data: finalResult,
      meta: {
        hours: last_hours,
        total_minutes: allMinutes.length,
        filtered_by: {
          idendpoint: idendpoint,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
      },
    };
    */
    return rawResults;
  } catch (error) {
    console.error("❌ Error obteniendo registros por minuto:", error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

// === CONSULTA PARA OBTENER CONTEOS POR MINUTO ===
async function getCountsByMinute(
  sequelize,
  startDate,
  endDate,
  endpointFilter
) {
  // Función para generar el truncado de fecha según el tipo de BD
  const getTruncatedMinuteColumn = () => {
    const dialect = sequelize.getDialect(); // Accedemos al dialecto desde el modelo

    switch (dialect) {
      case "postgres":
        return sequelize.fn("DATE_TRUNC", "minute", sequelize.col("timestamp"));
      case "mysql":
        return sequelize.fn(
          "DATE_FORMAT",
          sequelize.col("timestamp"),
          "%Y-%m-%d %H:%i:00"
        );
      case "mssql":
        return sequelize.fn(
          "DATEADD",
          "minute",
          sequelize.fn(
            "DATEDIFF",
            "minute",
            sequelize.literal("0"),
            sequelize.col("timestamp")
          ),
          sequelize.literal("0")
        );
      case "sqlite":
        return sequelize.fn(
          "STRFTIME",
          "%Y-%m-%d %H:%M:00",
          sequelize.col("timestamp")
        );
      default:
        // Fallback para otros dialectos o error
        throw new Error(`Dialecto no soportado: ${dialect}`);
    }
  };

  const truncatedColumn = getTruncatedMinuteColumn();

  const rawResults = await LogEntry.findAll({
    where: {
      [Op.and]: [
        { timestamp: { [Op.between]: [startDate, endDate] } },
        { idendpoint: endpointFilter },
      ],
    },
    attributes: [
      // Usamos la columna truncada generada dinámicamente
      [truncatedColumn, "minute"],
      "idendpoint",
      [sequelize.fn("COUNT", "*"), "count"],
    ],
    group: ["minute", "idendpoint"], // Agrupamos por las columnas alias y idendpoint
    order: [["minute", "ASC"]],
    raw: true, // Resultados crudos para manipular fechas
  });

  return rawResults;
}

/**
 * Obtiene un resumen de logs agrupados por idendpoint para una aplicación específica.
 *
 * @param {string} idapp El UUID de la aplicación a consultar.
 * @returns {Promise<Array<{ idendpoint: string, totalStatusCode: number, recordCount: number }>>}
 *          Un array de objetos, cada uno representando un endpoint con el total de status_code y la cantidad de registros.
 */
export async function getLogSummaryByAppStatusCode(data) {
  if (data && data.idapp) {
    try {
      const summary = await LogEntry.findAll({
        attributes: [
          "idendpoint", // El campo por el que agrupamos
          "status_code",
          [dbsequelize.fn("COUNT", dbsequelize.col("id")), "recordCount"], // Cantidad de registros
        ],
        where: {
          idapp: data.idapp, // Filtra por el idapp proporcionado
        },
        group: ["idendpoint", "status_code"], // Agrupa los resultados por idendpoint
        raw: true, // Importante para obtener objetos JSON planos en lugar de instancias del modelo Sequelize
      });

      return summary;
    } catch (error) {
      console.error("Error al obtener el resumen de logs por endpoint:", error);
      throw error; // Propagar el error para que la lógica superior lo maneje
    }
  } else {
    throw new Error("El parámetro idapp es obligatorio");
  }
}
