import { parentPort, workerData } from 'node:worker_threads';
import vm from 'node:vm';

// Simulation of dependencies we want to expose to the bot
let BotClass;

try {
    // Try dynamic import for grammY if installed
    // grammY exports { Bot }
    const grammyModule = await import('grammy');
    BotClass = grammyModule.Bot;
} catch (e) {
    // Fallback/Mock for demonstration if grammY is not installed
    BotClass = class MockBot {
        constructor(token) {
            this.token = token;
            this.code = null;
        }
        start() { console.log(`[Worker Mock] grammY Bot ${this.token.substr(0, 5)}... started!`); return new Promise(() => { }); }
        stop() { console.log(`[Worker Mock] grammY Bot ${this.token.substr(0, 5)}... stopped!`); }
        on(event, cb) { console.log(`[Worker Mock] Registered listener for '${event}'`); }
        command(cmd, cb) { console.log(`[Worker Mock] Registered command /${cmd}`); }
    };
}

let activeBot = null;

parentPort.on('message', async (message) => {
    try {
        if (message.type === 'START') {
            const { token, code, botId } = message.payload;
            console.log(`[Worker ${botId}] Starting...`);

            // 1. Create a Sandbox (The "World" for the bot)
            // We expose "Bot" (from grammY) and standard console/timers
            const sandbox = {
                Bot: BotClass,
                console: {
                    log: (...args) => console.log(`[Bot ${botId}]`, ...args),
                    error: (...args) => console.error(`[Bot ${botId} ERROR]`, ...args),
                },
                setTimeout,
                setInterval,
                clearTimeout,
                clearInterval,
                botToken: token // The bot code can access 'botToken' variable
            };

            // 2. Create Context
            vm.createContext(sandbox);

            // 3. Wrap the user code. 
            // We wrap their code to extract the 'bot' instance if they define it globally
            const wrappedCode = `
                ${code}
                
                // Magic to export the bot instance if created
                if (typeof bot !== 'undefined') { bot; } else { null; }
            `;

            // 4. Run Execution
            try {
                const script = new vm.Script(wrappedCode);
                // Execute code. The result of the last expression is returned.
                const potentialBot = script.runInContext(sandbox, { timeout: 5000 }); // 5s timeout for initialization

                if (potentialBot && (typeof potentialBot.stop === 'function' || typeof potentialBot.start === 'function')) {
                    activeBot = potentialBot;
                }

                parentPort.postMessage({ type: 'STARTED', botId });

            } catch (err) {
                console.error(`[Worker ${botId}] Execution Error:`, err);
                parentPort.postMessage({ type: 'ERROR', botId, error: err.message });
            }

        } else if (message.type === 'STOP') {
            if (activeBot) {
                console.log(`[Worker] Stopping bot instance...`);
                // grammY bots have stop() 
                if (activeBot.stop) {
                    try {
                        await activeBot.stop();
                    } catch (e) { console.error("Error stopping bot", e); }
                }
                activeBot = null;
            }
            parentPort.postMessage({ type: 'STOPPED' });
            process.exit(0);
        }
    } catch (e) {
        console.error('Critical Work Error:', e);
    }
});
