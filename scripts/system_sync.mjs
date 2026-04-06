import "dotenv/config";

import fs from "node:fs";
import { checkSystemApp } from "../src/lib/db/app.js";
import dbsequelize from "../src/lib/db/sequelize.js";

const args = new Set(process.argv.slice(2));
const restore = !args.has("--check-only");
const outputArgIndex = process.argv.indexOf("--output");
const outputFile = outputArgIndex >= 0 ? process.argv[outputArgIndex + 1] : null;
let exitCode = 0;

function emit(payload, stream = "stdout") {
  const text = JSON.stringify(payload, null, 2);

  if (outputFile) {
    fs.writeFileSync(outputFile, `${text}\n`, "utf8");
    return;
  }

  if (stream === "stderr") {
    console.error(text);
    return;
  }

  console.log(text);
}

try {
  const result = await checkSystemApp(restore);
  const endpoint = result?.diff?.endpoint;

  const summary = {
    restoreRequested: restore,
    valid: Boolean(result?.valid),
    message: result?.message ?? null,
    endpoint: endpoint
      ? {
          idendpoint: endpoint.idendpoint ?? null,
          resource: endpoint.resource ?? null,
          method: endpoint.method ?? null,
          environment: endpoint.environment ?? null,
          mcpName: endpoint.mcp?.name ?? null,
        }
      : null,
  };

  emit(summary);

  if (!summary.valid) {
    exitCode = 1;
  }
} catch (error) {
  emit(
    {
      restoreRequested: restore,
      valid: false,
      error: error?.message ?? String(error),
    },
    "stderr",
  );
  exitCode = 1;
} finally {
  try {
    await dbsequelize.close();
  } catch {
    exitCode = 1;
  }

  process.exit(exitCode);
}