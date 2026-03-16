export class ServerReadyOrchestrator {
  constructor({ websocketClientEndpoint, tasksInterval, backgroundTaskFactory }) {
    this.websocketClientEndpoint = websocketClientEndpoint;
    this.tasksInterval = tasksInterval;
    this.backgroundTaskFactory = backgroundTaskFactory;
    this.backgroundTasks = null;
  }

  start() {
    // Fastify is already listening at this point.
    this.websocketClientEndpoint.on("open", () => {
      this.websocketClientEndpoint.subscribe("/server/events");

      // Start periodic tasks only after WS internal channel is available.
      this.tasksInterval.run();

      this.backgroundTasks = this.backgroundTaskFactory();
      this.backgroundTasks.startAll();
    });

    this.websocketClientEndpoint.connect();
  }
}
