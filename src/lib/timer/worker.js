import { parentPort } from "worker_threads";
import { createLogEntriesBulk } from "../db/log.js";
import { LogBuffer } from "./logBuffer.js";
import {
  getIntervalTaskProcess,
  updateIntervalTaskStatus,
} from "../db/interval_task.js";

import { performance } from "perf_hooks";
import { URLAutoEnvironment } from "../server/utils.js";

const fetchOFAPI = new URLAutoEnvironment("no_env");
const interval = 10000;

export const logBuffer = new LogBuffer({
  flushFn: createLogEntriesBulk,
  flushIntervalMs: 30000, // cada 30s
  maxBatchSize: 100, // ajusta según tu DB
  maxBufferSize: 200, // límite de seguridad
});

// Escuchar mensajes desde el hilo principal
parentPort.on("message", (data) => {
  try {
    const data_json = JSON.parse(data);

    switch (data_json.action) {
      case "pushLog":
        logBuffer.push(data_json.data);
        break;

      default:
        console.log("***** Accion no determinada *****", data);
        break;
    }
  } catch (error) {
    console.error("Error en worker:", error, data);
  }
});

async function runFetchTask(task) {
  try {
    const start = performance.now();

    if (task.method && task.url) {
      const uF = fetchOFAPI.create(task.url, false);
      const resp_task = await uF[task.method]({
        //url: task.url,
        data: task.params,
      });

      const end = performance.now();
      const time_execution = end - start; // tiempo en milisegundos;

      if (resp_task.status === 200) {
        //console.log("OK", task.url);

        const contentType = resp_task.headers.get("Content-Type") || "?";
        //console.log(resp_task.headers);
        let data;
        if (contentType.includes("json")) {
          data = await resp_task.json();
        } else {
          data = await resp_task.text();
        }
        await updateIntervalTaskStatus(task.idtask, 2, data, time_execution);
      } else {
        await updateIntervalTaskStatus(
          task.idtask,
          3,
          { status: resp_task.status, error: resp_task.statusText },
          time_execution
        );
        //console.log("ERROR", task.url);
      }
    } else {
      //console.log("No URL or Method");
      await updateIntervalTaskStatus(
        task.idtask,
        3,
        { error: "Not url or method", task: task },
        0
      );
    }
  } catch (error) {
    console.error("Error:", error);
    await updateIntervalTaskStatus(task.idtask, 3, { error: error.message }, 0);
  }
}

setInterval(() => {
  //console.log();
  //console.log("Ejecutando en un hilo aparte");
  //parentPort.postMessage("Mensaje periódico desde el worker");

  getIntervalTaskProcess().then((app_tasks) => {
    app_tasks.forEach((task) => {
      try {
        //const japp = data.toJSON();
        if (task.status == 0 || task.status == 2 || task.status == 3) {
          // TODO: Detectar cuando la tarea se ejecute por mas del tiempo limite para cambiar el estado a 4 (timeout)
          // Se va a ejecutar
          updateIntervalTaskStatus(task.idtask, 1)
            .then(async () => {
              await runFetchTask(task);
            })
            .catch(() => {
              console.error("Error updating status");
            });
        } else {
          // console.log("Task in status " + task.status);
        }
      } catch (error) {
        updateIntervalTaskStatus(
          task.idtask,
          3,
          { error: error.message },
          0
        ).then(() => {
          console.error("Error:", error);
        });
      }
    });
  });
}, interval);

// Mantén el proceso vivo escuchando mensajes
parentPort.on("message", (msg) => {
  if (msg === "stop") {
    //process.exit(0)
    console.log("Worker parentPort STOP");
  }
});

process.on("SIGINT", async () => {
  try {
    await logBuffer.stop({ flush: true });
  } finally {
    process.exit(0);
  }
});
process.on("SIGTERM", async () => {
  try {
    await logBuffer.stop({ flush: true });
  } finally {
    process.exit(0);
  }
});
