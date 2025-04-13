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

export const getIntervalTask = async (filter = {}) => {
  try {
    let results = await IntervalTask.findAll({
      attributes: [
        "idtask",
        "iduser",
        "idendpoint",
        ["enabled", "task_enabled"],
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
      where: filter.tasks, // 🔹 Agregado el filtro aquí
      include: [
        {
          model: Endpoint,
          attributes: [
            ["idendpoint", "idendpoint"],
            ["enabled", "endpoint_enabled"],
            ["method", "method"],
            ["resource", "resource"],
            ["environment", "environment"],
          ],
          where: filter.endpoint, // 🔹 Agregado el filtro aquí
          required: true,
          include: [
            {
              model: Application,
              attributes: [
                ["idapp", "idapp"],
                ["app", "app"],
                ["enabled", "app_enabled"],
              ],
              required: true,
              where: filter.app, // 🔹 Agregado el filtro aquí
            },
          ],
        },
      ],
      raw: true,
      //nest: true,
    });

    results = results.map((item) => {
      let new_item = {
        idapp: item["ofapi_endpoint.ofapi_application.idapp"],
        app: item["ofapi_endpoint.ofapi_application.app"],
        app_enabled: item["ofapi_endpoint.ofapi_application.app_enabled"],

        idendpoint: item["ofapi_endpoint.idendpoint"],
        endpoint_enabled: item["ofapi_endpoint.endpoint_enabled"],
        method: item["ofapi_endpoint.method"],
        resource: item["ofapi_endpoint.resource"],
        environment: item["ofapi_endpoint.environment"],

        idtask: item.idtask,
        iduser: item.iduser,
        task_enabled: item.task_enabled,
        interval: item.interval,
        datestart: item.datestart,
        dateend: item.dateend,
        next_run: item.next_run,
        last_run: item.last_run,
        params: item.params,
        exec_time_limit: item.exec_time_limit,
        failed_attempts: item.failed_attempts,
        status: item.status,
        last_exec_time: item.last_exec_time,
        last_response: item.last_response,
        note: item.note,
      };

      new_item.url = `/api/${new_item.app}/${new_item.resource}/${new_item.environment}`;

      return new_item;
    });

    return results;
  } catch (error) {
    console.error("Error al obtener interval tasks con detalles:", error);
    throw error;
  }
};

export const getIntervalTaskProcess = async () => {
  const MAX_FAILED_ATTEMPTS = 3;

  let filter = {
    endpoint: { enabled: true },
    app: { enabled: true },
    tasks: {
      enabled: true,
      failed_attempts: { [Op.lt]: MAX_FAILED_ATTEMPTS },
      datestart: { [Op.lte]: new Date() },
      dateend: { [Op.gte]: new Date() },
      [Op.or]: [
        { next_run: { [Op.lte]: new Date() } },
        { next_run: { [Op.is]: null } },
      ],
    },
  };

  return await getIntervalTask(filter);
};

// DELETE
export const deleteIntervalTask = async (idtaskList) => {
  try {
    const deletedCount = await IntervalTask.destroy({
      where: {
        idtask: idtaskList,
      },
    });

    if (deletedCount > 0) {
      return true; // User deleted successfully
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
