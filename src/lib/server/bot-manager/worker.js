import { parentPort, workerData } from "node:worker_threads";
import vm from "node:vm";
import * as grammyModule from "grammy";

let activeBot = null;

parentPort.on("message", async (message) => {
  try {
    if (message.type === "START") {
      const { token, code, botId } = message.payload;
      console.log(`[Worker ${botId}] Starting...`);

      // 1. Create a Sandbox (The "World" for the bot)
      // We expose "Bot" (from grammY) and standard console/timers
      const sandbox = {
        grammy: grammyModule,
        setTimeout,
        setInterval,
        clearTimeout,
        clearInterval,
        setTimeout,
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

      // 2. Create Context
      vm.createContext(sandbox);

      // 3. Wrap the user code.
      // We wrap their code to extract the 'bot' instance if they define it globally
      const wrappedCode = `
                ${code}
// Instantiate the bot.
                const $BOT = new grammy.Bot($BOT_TOKEN);

            `;

      // 4. Run Execution
      try {
        const script = new vm.Script(wrappedCode);
        // Execute code. The result of the last expression is returned.
        const potentialBot = script.runInContext(sandbox, { timeout: 30000 }); // 5s timeout for initialization

        if (
          potentialBot &&
          (typeof potentialBot.stop === "function" ||
            typeof potentialBot.start === "function")
        ) {
          activeBot = potentialBot;
        }

        parentPort.postMessage({ type: "STARTED", botId });
      } catch (err) {
        console.error(`[Worker ${botId}] Execution Error:`, err);
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
