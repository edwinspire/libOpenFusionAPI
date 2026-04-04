import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const HANDLER_DOCS_ROOT = path.resolve(__dirname, "../../../docs/handlers");
export const HANDLER_DOC_REQUIRED_FILES = ["README.md", "manifest.json"];
export const HANDLER_DOC_OPTIONAL_FILES = ["examples.md", "examples.json", "api.generated.md"];

const readFileIfExists = async (filePath) => {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return undefined;
    throw error;
  }
};

const readJsonIfExists = async (filePath) => {
  const content = await readFileIfExists(filePath);
  if (content === undefined) return undefined;
  return JSON.parse(content);
};

export const getHandlerDocDir = (handler) => {
  return path.resolve(HANDLER_DOCS_ROOT, handler);
};

export const readHandlerDocBundle = async (handler) => {
  const dir = getHandlerDocDir(handler);
  const readmePath = path.resolve(dir, "README.md");
  const manifestPath = path.resolve(dir, "manifest.json");

  const [markdown, manifest] = await Promise.all([
    readFileIfExists(readmePath),
    readJsonIfExists(manifestPath),
  ]);

  let dirEntries = [];
  try {
    dirEntries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const existingFiles = dirEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();

  const generatedFiles = manifest?.docs?.generated
    ?? existingFiles.filter((file) => file.endsWith(".generated.md"));
  const exampleFiles = manifest?.docs?.examples
    ?? existingFiles.filter((file) => file === "examples.md" || file === "examples.json");

  const generated = await Promise.all(
    generatedFiles.map(async (file) => ({
      file,
      markdown: await readFileIfExists(path.resolve(dir, file)),
    }))
  );

  const examples = await Promise.all(
    exampleFiles.map(async (file) => ({
      file,
      content: await readFileIfExists(path.resolve(dir, file)),
    }))
  );

  return {
    dir,
    markdown,
    manifest,
    generated,
    examples,
    files: {
      main: markdown ? "README.md" : undefined,
      manifest: manifest ? "manifest.json" : undefined,
      generated: generated.map((item) => item.file),
      examples: examples.map((item) => item.file),
      existing: existingFiles,
    },
  };
};
