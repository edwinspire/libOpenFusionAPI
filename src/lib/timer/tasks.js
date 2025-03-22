//import { EventEmitter } from "events";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import path from "path";

// Obtener la ruta absoluta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TasksInterval {
  constructor() {
    //  super();
    //  this.interval = 5000; // Time Interval in milliseconds
  }

  pushLog(log) {
    this.postMessage({ action: "pushLog", data: log });
  }

  postMessage(data) {
    this.worker.postMessage(JSON.stringify(data));
  }

  run() {
    // Crea un nuevo hilo ejecutando el worker
    const workerPath = path.resolve(__dirname, "./worker.js");
    console.log("workerPath", workerPath);
    this.worker = new Worker(workerPath);

    // Recibir mensajes del worker
    this.worker.on("message", (msg) => {
      console.log("Mensaje recibido del worker:", msg);
    });

    // Enviar mensaje al worker
    this.worker.postMessage("¡Hola worker, desde el hilo principal!");

    this.worker.on("error", (err) => {
      console.error("Error en el worker:", err);
    });

    this.worker.on("exit", (code) => {
      console.log(`El worker finalizó con código ${code}`);
    });

    return this.worker;
  }
}
