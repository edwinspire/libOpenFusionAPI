import server from "./lib/index.js";
//import { BotManager } from "./lib/server/bot-manager/manager.js";
//import { getAllBots } from "./lib/db/bot.js";

const OFAPIServer = new server();

/*
// 2. Run Usage
async function main() {
  const manager = new BotManager();

  console.log("--- Starting System (grammY edition) ---");

  setInterval(async () => {
    const bots = await getAllBots();
    console.log("bots", bots);

    for (let index = 0; index < bots.length; index++) {
      const element = bots[index];
      try {
        if (element.enabled) {
          console.log("Starting Bot " + element.idbot);
          await manager.startBot(element.idbot, element.token, element.code, element.environment);
        } else {
          console.log("Stopping Bot " + element.idbot);
          await manager.stopBot(element.idbot);
        }
      } catch (error) {
        console.error("Error managing bot " + element.idbot, error);
      }
    }
  }, 10000);

  //   console.log('Starting Bot 1...');
  //    await manager.startBot(DB_BOTS[0].id, DB_BOTS[0].token, DB_BOTS[0].code);

  //    console.log('Starting Bot 2...');
  //    await manager.startBot(DB_BOTS[1].id, DB_BOTS[1].token, DB_BOTS[1].code);

  console.log("Active Bots:", manager.listActiveBots());

  // Allow them to "run" for 3 seconds
  //await new Promise(r => setTimeout(r, 3000));

  // Note: With invalid tokens, grammY might throw/exit earlier or retry.
  // If it throws unhandled, the worker might exit.

  //  console.log('--- Killing Bot 1 ---');
  //await manager.stopBot('bot_1');
  //  console.log('Active Bots:', manager.listActiveBots());

  // Allow Bot 2 to run a bit longer
  //  await new Promise(r => setTimeout(r, 2000));

  //  console.log('--- Killing Bot 2 ---');
  //  await manager.stopBot('bot_2');

  //    console.log('Final Active Bots:', manager.listActiveBots());
}

main().catch(console.error);
*/