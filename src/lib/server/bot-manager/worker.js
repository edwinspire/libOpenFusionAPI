import { parentPort, workerData } from "node:worker_threads";
import vm from "node:vm";
import * as grammyModule from "grammy";
import { functionsVars } from "../functionVars.js";

let activeBot = null;

parentPort.on("message", async (message) => {
  try {
    if (message.type === "START") {
      const { token, code, botId, environment, app_env_vars } = message.payload;
      console.log(`[Worker ${botId}] Starting...`);

      const defaults = {
        // Valores explícitamente permitidos
        grammy: grammyModule,
        setTimeout,
        clearInterval,
        clearTimeout,
        clearInterval,
        AbortController,
        console,
        Date,
        Math,
        JSON,
        Array,
        Object,
        String,
        Number,
        Boolean,
        Promise,
        FormData,
        Blob,
        Buffer,
        RegExp,
        parseInt,
        parseFloat,
        $BOT_TOKEN: token, // The bot code can access 'botToken' variable
      };

      const sandbox = { ...defaults, ...functionsVars(true, true, environment), ...app_env_vars };

      // 2. Create Context
      vm.createContext(sandbox);

      // 3. Wrap the user code.
      // We wrap their code to extract the 'bot' instance if they define it globally
      const wrappedCode = `
               
// Instantiate the bot.
const $BOT = new grammy.Bot($BOT_TOKEN);

${code}



            `;

      // 4. Run Execution
      try {
        const script = new vm.Script(wrappedCode);
        // Execute code.
        script.runInContext(sandbox, { timeout: 10000 }); // 10s timeout
/*
Nota importante: Este tiempo límite aplica solo a la carga inicial del código (definir variables, crear la instancia del bot). No limita cuánto tiempo puede estar el bot encendido y funcionando (eso es indefinido).
*/
        // Recover the bot instance from the sandbox
        const potentialBot = sandbox.$BOT;

        if (potentialBot && typeof potentialBot.start === "function") {
          activeBot = potentialBot;

          // Handle bot errors to prevent crash
          activeBot.catch((err) => {
            console.error(`[Worker ${botId}] Bot Error (caught):`, err);
            // We could notify manager here if needed, but for now we keep running
          });

          // Start the bot without handling signals (manager handles that)
          activeBot.start({
            onStart: () => {
              console.log(`[Worker ${botId}] Bot started!`);
            },
            allowed_updates: ["message", "callback_query"], // Optional: specific updates
            drop_pending_updates: true,
            handleSignals: false
          });

          parentPort.postMessage({ type: "STARTED", botId });
        } else {
          throw new Error("Code did not define a valid $BOT instance.");
        }

      } catch (err) {
        console.error(`[Worker ${botId}] Execution/Startup Error:`, err);
        parentPort.postMessage({ type: "ERROR", botId, error: err.message });
      }
    } else if (message.type === "STOP") {
      if (activeBot) {
        console.log(`[Worker] Stopping bot instance...`);
        // grammY bots have stop()
        if (activeBot.stop) {
          try {
            await activeBot.stop();
          } catch (e) {
            console.error("Error stopping bot", e);
          }
        }
        activeBot = null;
      }
      parentPort.postMessage({ type: "STOPPED" });
      process.exit(0);
    }
  } catch (e) {
    console.error("Critical Work Error:", e);
  }
});
