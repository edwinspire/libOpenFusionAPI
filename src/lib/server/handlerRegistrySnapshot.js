import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HANDLER_SOURCE = path.resolve(__dirname, "../handler/handler.js");
const HANDLER_ENTRY_REGEX = /^\s{2}([A-Z_]+):\s*\{/gm;

export const readRuntimeHandlerKeys = async () => {
  const source = await fs.readFile(HANDLER_SOURCE, "utf8");
  const keys = [];
  let match;

  while ((match = HANDLER_ENTRY_REGEX.exec(source)) !== null) {
    keys.push(match[1]);
  }

  return [...new Set(keys)].sort();
};
