import { Worker } from 'node:worker_threads';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BotManager {
    constructor() {
        this.activeBots = new Map(); // Map<botId, Worker>
    }

    /**
     * Start a bot in a separate thread
     * @param {string} botId - Unique ID for the bot
     * @param {string} token - Telegram Bot Token
     * @param {string} code - The Javascript code string to execute
     */
    startBot(botId, token, code) {
        return new Promise((resolve, reject) => {
            if (this.activeBots.has(botId)) {
                return reject(new Error(`Bot ${botId} is already running`));
            }

            const worker = new Worker(path.join(__dirname, 'worker.js'));

            worker.on('message', (msg) => {
                if (msg.type === 'STARTED') {
                    console.log(`[Manager] Bot ${botId} started successfully.`);
                    resolve();
                } else if (msg.type === 'ERROR') {
                    console.error(`[Manager] Bot ${botId} reported error: ${msg.error}`);
                } else if (msg.type === 'STOPPED') {
                    console.log(`[Manager] Bot ${botId} stopped.`);
                }
            });

            worker.on('error', (err) => {
                console.error(`[Manager] Worker for bot ${botId} error:`, err);
                this.activeBots.delete(botId);
            });

            worker.on('exit', (code) => {
                if (code !== 0) {
                    console.error(`[Manager] Worker for bot ${botId} stopped with exit code ${code}`);
                }
                this.activeBots.delete(botId);
            });

            // Send payload to worker
            worker.postMessage({
                type: 'START',
                payload: { botId, token, code }
            });

            this.activeBots.set(botId, worker);
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

        const worker = this.activeBots.get(botId);

        // Try graceful stop first
        worker.postMessage({ type: 'STOP' });

        // Force termination after short timeout if it doesn't exit
        return new Promise((resolve) => {
            const timeout = setTimeout(async () => {
                console.log(`[Manager] Forcing termination of bot ${botId}`);
                await worker.terminate();
                this.activeBots.delete(botId);
                resolve();
            }, 2000);

            worker.once('exit', () => {
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
