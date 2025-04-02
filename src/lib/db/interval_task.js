import { Op } from "sequelize";
import Sequelize from "sequelize";
import { IntervalTask, Application, Endpoint } from "./models.js";

export const upsertIntervalTask = async (data) => {
  try {
    const [result, created] = await IntervalTask.upsert(data, {
      returning: true,
    });
    return { result, created };
  } catch (error) {
    console.error("Error retrieving:", error, data);
    throw error; // c4ca4238-a0b9-2382-0dcc-509a6f75849b
  }
};

// READ
export const getIntervalTaskById = async (idtask) => {
  try {
    const task = await IntervalTask.findByPk(idtask);
    return task;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

export const getAllIntervalTasks = async () => {
  try {
    const tasks = await IntervalTask.findAll();
    return tasks;
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};

export const getIntervalTaskByIdApp = async (idapp, raw = false) => {
  return Endpoint.findAll({
    where: { idapp: idapp },
    attributes: [
      "idapp",
      "enabled",
      "method",
      [
        Sequelize.literal(
          `CONCAT('/api',	'/',ofapi_application.app,	resource, '/', environment)`
        ),
        "url",
      ], // 🔹 Concatenación de environment, resource y failed_attempts
    ],
    include: [
      {
        model: IntervalTask,
        as: "tasks",
        required: true, // INNER JOIN
        attributes: [
          "idtask",

          "iduser",
          "idendpoint",
          "enabled",
          "interval",
          "datestart",
          "dateend",
          "next_run",
          "last_run",
          "params",
          "exec_time_limit",
          "failed_attempts",
          "status",
          "last_exec_time",
          "last_response",
          "note",
        ],
        order: [["datestart", "ASC"]],
      },
      {
        model: Application,
        as: "ofapi_application", // 🔹 Cambia al alias correcto
        attributes: ["app"],
        required: true, // INNER JOIN
        //where: { enabled: true },
      },
    ],
    raw: raw,
    nest: false,
  });
};

export const getIntervalTaskProcess = async () => {
  const MAX_FAILED_ATTEMPTS = 3;

  return Endpoint.findAll({
    where: { enabled: true },
    attributes: [
      "idapp",
      "enabled",
      //      "environment",
      //      "resource",
      "method",
      [
        Sequelize.literal(
          `CONCAT('/api',	'/',ofapi_application.app,	resource, '/', environment)`
        ),
        "url",
      ], // 🔹 Concatenación de environment, resource y failed_attempts
    ],
    include: [
      {
        model: IntervalTask,
        as: "tasks",
        where: {
          enabled: true,
          failed_attempts: { [Op.lt]: MAX_FAILED_ATTEMPTS },
          datestart: { [Op.lte]: new Date() },
          dateend: { [Op.gte]: new Date() },
          [Op.or]: [
            { next_run: { [Op.lte]: new Date() } },
            { next_run: { [Op.is]: null } },
          ],
        },
        required: true,
        attributes: [
          "idtask",

          "iduser",
          "idendpoint",
          "enabled",
          "interval",
          "datestart",
          "dateend",
          "next_run",
          "last_run",
          "params",
          "exec_time_limit",
          "failed_attempts",
          "status",
          "last_exec_time",
          "last_response",
          "note",
        ],
        order: [["datestart", "ASC"]],
      },
      {
        model: Application,
        as: "ofapi_application", // 🔹 Cambia al alias correcto
        attributes: ["app"],
        required: true, // INNER JOIN
        where: { enabled: true },
      },
    ],
    raw: false,
    nest: true,
  });
};

// DELETE
export const deleteIntervalTask = async (idtask) => {
  try {
    const ep = await IntervalTask.findByPk(idtask);
    if (ep) {
      await ep.destroy();
      return true; // Deletion successful
    }
    return false; // User not found
  } catch (error) {
    console.error("Error deleting idendpoint:", error);
    throw error;
  }
};

export const bulkCreateIntervalTask = (list_tasks) => {
  // Campos que se utilizarán para verificar duplicados (en este caso, todos excepto 'rowkey' y 'idendpoint')
  //const uniqueFields = ['idapp', 'namespace', 'name', 'version', 'environment', 'method'];
  // OJO: No se pudo tener un bulk upsert
  return IntervalTask.bulkCreate(list_tasks, {
    ignoreDuplicates: true,
    //updateOnDuplicate: uniqueFields
  });
};

export const updateIntervalTaskRun = async (idtask, status) => {
  try {
    const task = await IntervalTask.findOne({ where: { idtask } });

    if (!task) {
      throw new Error(`No se encontró la tarea con idtask: ${idtask}`);
    }

    const now = new Date();
    const nextRun = new Date(now.getTime() + task.interval * 1000); // Convertir interval de segundos a milisegundos

    await IntervalTask.update(
      {
        last_run: now,
        next_run: nextRun,
        status: status,
      },
      { where: { idtask } }
    );

    return {
      success: true,
      message: "La tarea fue actualizada correctamente.",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateIntervalTaskStatus = async (
  idtask,
  new_status,
  result,
  time_execution_ms
) => {
  try {
    time_execution_ms = Math.floor(time_execution_ms);

    const task = await IntervalTask.findOne({
      where: { idtask: idtask },
    });

    if (!task) {
      throw new Error(
        `No se encontró la tarea con idtask: ${current_task.idtask}`
      );
    }

    let data_update = {};

    const now = new Date();
    const nextRun = new Date(now.getTime() + task.interval * 1000); // Convertir interval de segundos a milisegundos

    switch (new_status) {
      case 0:
        // En espera
        data_update = {
          last_run: now,
          next_run: nextRun,
          status: new_status,
          attempts: 0,
          last_response: null,
        };

        break;
      case 1:
        // En ejecución
        data_update = {
          last_run: now,
          next_run: nextRun,
          status: new_status,
        };

        break;
      case 2:
        // Completado
        data_update = {
          //last_run: now,
          //next_run: nextRun,
          last_response: result,
          failed_attempts: 0,
          //last_time: now
          last_exec_time: time_execution_ms || 0,
          status: new_status,
        };

        break;
      case 3:
        // Error
        data_update = {
          //last_run: now,
          //next_run: nextRun,
          last_response: result,
          failed_attempts: task.failed_attempts + 1,
          status: new_status,
          last_exec_time: time_execution_ms || 0,
        };

        break;
      default:
        break;
    }

    await IntervalTask.update(data_update, { where: { idtask } });

    return {
      success: true,
      message: "La tarea fue actualizada correctamente.",
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};
