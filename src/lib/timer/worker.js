import { parentPort } from "worker_threads";
import { createLog } from "../db/log.js";
import PromiseSequence from "@edwinspire/sequential-promises";

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

setInterval(() => {
  console.log(createLog);
  //console.log("Ejecutando en un hilo aparte");
  parentPort.postMessage("Mensaje periódico desde el worker");
}, interval);

// Mantén el proceso vivo escuchando mensajes
parentPort.on("message", (msg) => {
  if (msg === "stop") process.exit(0);
});
