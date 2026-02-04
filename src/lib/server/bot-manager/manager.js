import { Worker } from "node:worker_threads";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BotManager {
  constructor() {
    this.activeBots = new Map(); // Map<botId, Worker>
    this.botErrorHistory = new Map(); // Map<botId, { timestamps: [], cooldownUntil: 0 }>
  }

  /**
   * Start a bot in a separate thread
   * @param {string} botId - Unique ID for the bot
   * @param {string} token - Telegram Bot Token
   * @param {string} code - The Javascript code string to execute
   * @param {string} environment - The environment to run the bot in (e.g. 'dev', 'prd')
   * @param {Object} app_env_vars - The appvars object to run the bot in (e.g. 'dev', 'prd')
   */
  startBot(botId, token, code, environment, app_env_vars) {
    return new Promise(async (resolve, reject) => {

      if (!(botId && token && code && token.length > 0 && code.length > 0)) {
        reject(new Error("Bot data is invalid"));
      }

      // Check for cooldown
      const history = this.botErrorHistory.get(botId);
      if (history && history.cooldownUntil > Date.now()) {
        const remaining = Math.ceil((history.cooldownUntil - Date.now()) / 1000);
        console.warn(`[Manager] Bot ${botId} is in cooldown. Try again in ${remaining} seconds.`);
        reject(new Error(`Bot ${botId} is in cooldown`));
        return;
      }

      const existingEntry = this.activeBots.get(botId);

      // Calculate hash of the new code
      const codeHash = crypto.createHash('sha256').update(code).digest('hex');

      if (existingEntry) {
        if (existingEntry.codeHash !== codeHash) {
          console.log(`[Manager] Bot ${botId} code has changed. Restarting...`);
          try {
            await this.stopBot(botId);
          } catch (err) {
            console.error(`[Manager] Error stopping bot ${botId} for restart:`, err);
          }
          // Proceed to start the new worker
        } else {
          console.log(`[Manager] Bot ${botId} is already running with the same code.`);
          resolve();
          return;
        }
      }

      const worker = new Worker(path.join(__dirname, "worker.js"));

      worker.on("message", (msg) => {
        if (msg.type === "STARTED") {
          console.log(`[Manager] Bot ${botId} started successfully.`);
          resolve();
        } else if (msg.type === "ERROR") {
          console.error(`[Manager] Bot ${botId} reported error: ${msg.error}`);
        } else if (msg.type === "STOPPED") {
          console.log(`[Manager] Bot ${botId} stopped.`);
        }
      });

      worker.on("error", (err) => {
        console.error(`[Manager] Worker for bot ${botId} error:`, err);
        this.activeBots.delete(botId);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(
            `[Manager] Worker for bot ${botId} stopped with exit code ${code}`,
          );

          // Handle error history and cooldown
          let history = this.botErrorHistory.get(botId);
          if (!history) {
            history = { timestamps: [], cooldownUntil: 0 };
            this.botErrorHistory.set(botId, history);
          }

          const now = Date.now();
          // Add current error
          history.timestamps.push(now);

          // Keep only errors from last 5 minutes (300000 ms)
          history.timestamps = history.timestamps.filter(t => now - t < 300000);

          if (history.timestamps.length >= 5) {
            console.error(`[Manager] Bot ${botId} reached 5 errors in 5 minutes. Entering 5-minute cooldown.`);
            history.cooldownUntil = now + 300000;
            history.timestamps = []; // Reset history after triggering cooldown
          }
        }
        this.activeBots.delete(botId);
      });

      // Send payload to worker
      worker.postMessage({
        type: "START",
        payload: { botId, token, code, environment, app_env_vars },
      });

      this.activeBots.set(botId, { worker, codeHash });
    });
  }

  /**
   * Stop a running bot
   * @param {string} botId
   */
  async stopBot(botId) {
    if (!this.activeBots.has(botId)) {
      console.log(`[Manager] Bot ${botId} not running.`);
      return;
    }

    const { worker } = this.activeBots.get(botId);

    // Try graceful stop first
    worker.postMessage({ type: "STOP" });

    // Force termination after short timeout if it doesn't exit
    return new Promise((resolve) => {
      const timeout = setTimeout(async () => {
        console.log(`[Manager] Forcing termination of bot ${botId}`);
        await worker.terminate();
        this.activeBots.delete(botId);
        resolve();
      }, 2000);

      worker.once("exit", () => {
        clearTimeout(timeout);
        this.activeBots.delete(botId);
        resolve();
      });
    });
  }

  listActiveBots() {
    return Array.from(this.activeBots.keys());
  }
}
