import { EventEmitter } from "events";

export class Tasks extends EventEmitter {
  constructor() {
    super();
    this.interval = 5000;

    ////////////
  }

  run() {
    setInterval(() => {
      console.log('Ejecutar en un hilo aparte');
    }, interval);
  }
}
