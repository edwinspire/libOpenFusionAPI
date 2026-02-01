import { BotManager } from './manager.js';

// 1. Mock Database
const DB_BOTS = [
    {
        id: 'bot_1',
        token: '1878582988:AAH3Q1j5LzAo8cEBXYtMEEEy4swosLq6SZ8', // This will fail auth in real grammy, which is good for testing
        // Code that uses 'Bot' (grammY injected) and 'botToken'
        code: `
            const bot = new Bot(botToken);
            bot.command('start', (ctx) => ctx.reply('Hello from Bot 1!'));
            // grammY uses start() unlike telegraf's launch()
            // We don't await it here because that would block the script execution line. 
            // In a real scenario, we might want to just set it up and let the worker wrapper handle life cycle,
            // but here we just fire it.
            bot.start(); 
            console.log('Bot 1 setup complete inside VM');
            bot; 
        `
    },
    {
        id: 'bot_2',
        token: '987654:ZYX-WVU',
        code: `
            const bot = new Bot(botToken);
            bot.on('message', (ctx) => ctx.reply('Bot 2 echo: ' + ctx.message.text));
            bot.start();
            console.log('Bot 2 setup complete inside VM');
            bot;
        `
    }
];

// 2. Run Usage
async function main() {
    const manager = new BotManager();

    console.log('--- Starting System (grammY edition) ---');

    console.log('Starting Bot 1...');
    await manager.startBot(DB_BOTS[0].id, DB_BOTS[0].token, DB_BOTS[0].code);

    console.log('Starting Bot 2...');
    await manager.startBot(DB_BOTS[1].id, DB_BOTS[1].token, DB_BOTS[1].code);

    console.log('Active Bots:', manager.listActiveBots());

    // Allow them to "run" for 3 seconds
    //await new Promise(r => setTimeout(r, 3000));

    // Note: With invalid tokens, grammY might throw/exit earlier or retry. 
    // If it throws unhandled, the worker might exit.

    console.log('--- Killing Bot 1 ---');
    //await manager.stopBot('bot_1');
    console.log('Active Bots:', manager.listActiveBots());

    // Allow Bot 2 to run a bit longer
    await new Promise(r => setTimeout(r, 2000));

    console.log('--- Killing Bot 2 ---');
    await manager.stopBot('bot_2');

    console.log('Final Active Bots:', manager.listActiveBots());
}

main().catch(console.error);
