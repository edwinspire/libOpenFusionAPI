import fs from "fs/promises";
import path from "path";
import { HANDLER_DOCS_ROOT, readHandlerDocBundle } from "./handlerDocs.js";
import { readRuntimeHandlerKeys } from "./handlerRegistrySnapshot.js";

const OUTPUT_FILE = path.resolve(HANDLER_DOCS_ROOT, "README.md");

const renderRuntimeHandlers = async () => {
  const handlers = await readRuntimeHandlerKeys();
  const docs = await Promise.all(
    handlers.map(async (handler) => ({
      handler,
      bundle: await readHandlerDocBundle(handler),
    }))
  );

  const lines = [];
  lines.push("# Handler Documentation");
  lines.push("");
  lines.push("This directory now follows a per-handler documentation contract.");
  lines.push("");
  lines.push("## Contract");
  lines.push("");
  lines.push("Each active handler must keep its material inside its own folder:");
  lines.push("");
  lines.push("- `README.md`: canonical human guide.");
  lines.push("- `manifest.json`: structured metadata used by tooling and runtime documentation endpoints.");
  lines.push("- `examples.md` or `examples.json`: optional examples for real payloads and workflows.");
  lines.push("- `api.generated.md`: optional generated reference for helpers or runtime-exposed APIs.");
  lines.push("");
  lines.push("## Runtime Handlers");
  lines.push("");
  lines.push("| Handler | Label | Status | Extra Files |");
  lines.push("|---|---|---|---|");

  for (const entry of docs) {
    const status = entry.bundle.manifest?.status ?? "active";
    const extraFiles = [
      ...entry.bundle.files.generated,
      ...entry.bundle.files.examples,
    ];

    lines.push(
      `| [${entry.handler}](./${entry.handler}/README.md) | ${entry.bundle.manifest?.label ?? entry.handler} | ${status} | ${extraFiles.length > 0 ? extraFiles.join(", ") : "-"} |`
    );
  }

  const docEntries = await fs.readdir(HANDLER_DOCS_ROOT, { withFileTypes: true });
  const extraFolders = docEntries
    .filter((entry) => entry.isDirectory() && !handlers.includes(entry.name))
    .map((entry) => entry.name)
    .sort();

  if (extraFolders.length > 0) {
    lines.push("");
    lines.push("## Non-runtime Folders");
    lines.push("");
    lines.push("These folders are documented but are not currently registered in the runtime handler registry:");
    lines.push("");
    for (const folder of extraFolders) {
      lines.push(`- [${folder}](./${folder}/README.md)`);
    }
  }

  lines.push("");
  lines.push("> Auto-generated from `src/lib/handler/handler.js` and per-handler `manifest.json` files.");
  lines.push("");

  return `${lines.join("\n")}\n`;
};

const main = async () => {
  const markdown = await renderRuntimeHandlers();
  await fs.writeFile(OUTPUT_FILE, markdown, "utf8");
  console.log(`Handler index generated at: ${OUTPUT_FILE}`);
};

main().catch((error) => {
  console.error("Error generating handler index:", error);
  process.exit(1);
});
