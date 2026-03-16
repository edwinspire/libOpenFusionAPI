import { BotManager } from "../bot-manager/manager.js";
import { getApplicationsTreeByFilters } from "../../db/app.js";
import { disableEndpoint } from "../../db/endpoint.js";
import { getAppVarsObject } from "../utils.js";

export class BotLifecycleTask {
  constructor({ intervalMs = 10000 }) {
    this.intervalMs = intervalMs;
    this.timerId = null;
    this.manager = new BotManager();
    this.isRunning = false;

    // Auto-disable an endpoint that keeps crashing so it stops wasting resources
    this.manager.on("disable", async ({ botId }) => {
      try {
        await disableEndpoint(botId);
        console.warn(
          `[BotManager] Endpoint ${botId} auto-disabled after repeated failures.`,
        );
      } catch (err) {
        console.error(`[BotManager] Failed to disable endpoint ${botId}:`, err);
      }
    });
  }

  async runOnce() {
    if (this.isRunning) return;
    this.isRunning = true;

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
                await this.manager.startBot(
                  element.idendpoint,
                  element.custom_data.token,
                  element.code,
                  element.environment,
                  appvars_obj[element.environment],
                );
              } else {
                console.log("Stopping Bot " + element.idendpoint);
                await this.manager.stopBot(element.idendpoint);
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
      this.isRunning = false;
    }
  }

  start() {
    console.log("--- Starting System (grammY edition) ---");
    this.timerId = setInterval(async () => {
      await this.runOnce();
    }, this.intervalMs);
  }
}
