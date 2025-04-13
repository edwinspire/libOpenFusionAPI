import { parentPort } from "worker_threads";
import { createLog } from "../db/log.js";
import {
  getIntervalTaskProcess,
  updateIntervalTaskStatus,
} from "../db/interval_task.js";
import PromiseSequence from "@edwinspire/sequential-promises";
//import uFetch from "@edwinspire/universal-fetch";
import { performance } from "perf_hooks";
import { URLAutoEnvironment } from "../server/utils.js";

const fetchOFAPI = new URLAutoEnvironment("no_env");
const QUEUE_LOG_NUM_THREAD = process.env.QUEUE_LOG_NUM_THREAD || 5;
const interval = 5000;

function pushLog(log) {
  return new Promise(async (resolve) => {
    let data;
    let error;

    try {
      data = await createLog(log);
    } catch (error) {
      error = error;
    }
    //    console.log(data, error)
    resolve({ data: data, error: error });
  });
}

const queueLog = new PromiseSequence();
queueLog.thread(pushLog, QUEUE_LOG_NUM_THREAD, []);

// Escuchar mensajes desde el hilo principal
parentPort.on("message", (data) => {
  //console.log("Mensaje recibido en worker:", data);

  try {
    const data_json = JSON.parse(data);

    switch (data_json.action) {
      case "pushLog":
        queueLog.push(data_json.data);
        break;

      default:
        console.log("***** Accion no determinada *****", data);
        break;
    }
  } catch (error) {
    console.error("Error en worker:", error, data);
  }

  // Puedes procesar el dato recibido y responder
  //parentPort.postMessage(`Worker recibió: ${data}`);
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
  console.log("Ejecutando en un hilo aparte");
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
          console.log("Task in status " + task.status);
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
