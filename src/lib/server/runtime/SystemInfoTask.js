import { getSystemInfoDynamic } from "../systeminformation.js";
import { urlSystemPath } from "../utils_path.js";

export class SystemInfoTask {
  constructor({ serverAPI, intervalMs = 3000 }) {
    this.serverAPI = serverAPI;
    this.intervalMs = intervalMs;
    this.timerId = null;
  }

  async runOnce() {
    if (this.serverAPI.fastify.websocketServer.clients.size > 1) {
      this.serverAPI._emitEndpointEvent(
        "system_information",
        await getSystemInfoDynamic(),
      );

      for (const client_ws of this.serverAPI.fastify.websocketServer.clients) {
        if (
          client_ws.openfusionapi?.channel == "/server/events" &&
          client_ws?.openfusionapi?.handler?.params?.url_key?.startsWith(
            urlSystemPath.Websocket.EventServer,
          )
        ) {
          this.serverAPI._emitEndpointEvent(
            "system_information",
            await getSystemInfoDynamic(),
          );
          return;
        }
      }
    }
  }

  start() {
    this.timerId = setInterval(async () => {
      await this.runOnce();
    }, this.intervalMs);
  }
}
