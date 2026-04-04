import fs from "fs/promises";
import path from "path";
import {
  HANDLER_DOCS_ROOT,
  HANDLER_DOC_REQUIRED_FILES,
  readHandlerDocBundle,
} from "./handlerDocs.js";
import { readRuntimeHandlerKeys } from "./handlerRegistrySnapshot.js";

const errors = [];
const warnings = [];
let runtimeHandlers = [];

const assertFile = async (dir, file) => {
  try {
    await fs.access(path.resolve(dir, file));
    return true;
  } catch (_error) {
    return false;
  }
};

const validateRuntimeHandler = async (handler) => {
  const dir = path.resolve(HANDLER_DOCS_ROOT, handler);
  const bundle = await readHandlerDocBundle(handler);

  for (const file of HANDLER_DOC_REQUIRED_FILES) {
    const exists = await assertFile(dir, file);
    if (!exists) {
      errors.push(`${handler}: missing required file ${file}`);
    }
  }

  if (!bundle.manifest) {
    return;
  }

  if (bundle.manifest.handler !== handler) {
    errors.push(`${handler}: manifest.handler must be ${handler}`);
  }

  for (const file of [...bundle.files.generated, ...bundle.files.examples]) {
    const exists = await assertFile(dir, file);
    if (!exists) {
      errors.push(`${handler}: referenced documentation file not found (${file})`);
    }
  }
};

const validateExtraFolders = async () => {
  const entries = await fs.readdir(HANDLER_DOCS_ROOT, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (runtimeHandlers.includes(entry.name)) continue;

    const manifestPath = path.resolve(HANDLER_DOCS_ROOT, entry.name, "manifest.json");
    const readmePath = path.resolve(HANDLER_DOCS_ROOT, entry.name, "README.md");
    const [manifestExists, readmeExists] = await Promise.all([
      assertFile(path.resolve(HANDLER_DOCS_ROOT, entry.name), "manifest.json"),
      assertFile(path.resolve(HANDLER_DOCS_ROOT, entry.name), "README.md"),
    ]);

    if (!manifestExists || !readmeExists) {
      errors.push(`${entry.name}: non-runtime folder must still provide README.md and manifest.json`);
      continue;
    }

    const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    if (manifest.status === "active") {
      warnings.push(`${entry.name}: marked active but not present in runtime handler registry`);
    }

    await fs.access(readmePath);
  }
};

const main = async () => {
  runtimeHandlers = await readRuntimeHandlerKeys();

  for (const handler of runtimeHandlers) {
    await validateRuntimeHandler(handler);
  }

  await validateExtraFolders();

  if (warnings.length > 0) {
    console.warn("Handler docs warnings:");
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error("Handler docs validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Handler docs validation succeeded.");
};

main().catch((error) => {
  console.error("Error validating handler docs:", error);
  process.exit(1);
});
