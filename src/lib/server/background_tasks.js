import { BotManager } from "./bot-manager/manager.js";
import { getApplicationsTreeByFilters } from "../db/app.js";
import { getAppVarsObject } from "./utils.js";
import { getSystemInfoDynamic } from "./systeminformation.js";
import { urlSystemPath } from "./utils_path.js";

export class BackgroundTaskManager {
  constructor(serverAPI) {
    this.serverAPI = serverAPI;
  }

  startAll() {
    this.startSystemInfoLoop();
    this.startBotLoop();
  }

  startSystemInfoLoop() {
    setInterval(async () => {
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
    }, 3000);
  }

  startBotLoop() {
    const manager = new BotManager();
    let isBotLoopRunning = false;

    console.log("--- Starting System (grammY edition) ---");

    setInterval(async () => {
      if (isBotLoopRunning) return; 
      isBotLoopRunning = true;
      try {
        const apps = await getApplicationsTreeByFilters({
          endpoint: { handler: "TELEGRAM_BOT" },
        });

        for (let index = 0; index < apps.length; index++) {
          const app = apps[index];

          if (app.endpoints && app.endpoints.length > 0) {
            let appvars_obj = {};

            if (app.enabled) {
              appvars_obj = getAppVarsObject(app.vrs);
            }

            for (let index = 0; index < app.endpoints.length; index++) {
              const element = app.endpoints[index];
              try {
                if (element.enabled && app.enabled) {
                  console.log("Starting Bot " + element.idendpoint);
                  await manager.startBot(
                    element.idendpoint,
                    element.custom_data.token,
                    element.code,
                    element.environment,
                    appvars_obj[element.environment],
                  );
                } else {
                  console.log("Stopping Bot " + element.idendpoint);
                  await manager.stopBot(element.idendpoint);
                }
              } catch (error) {
                console.error("Error managing bot " + element.idbot);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in bot management loop:", error);
      } finally {
        isBotLoopRunning = false;
      }
    }, 10000);
  }
}
