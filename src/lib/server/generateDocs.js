import { listFunctionsVars } from "./functionVars.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OLD_OUTPUT_FILE = path.resolve(__dirname, "../../docs/handlers/JS/api.generated.md");
const OUTPUT_DIR = path.resolve(__dirname, "../../docs/handlers/JS/libraries");

/**
 * Normalizes the metadata object to a standard schema.
 * Handles backward compatibility for 'info', 'web', 'value_type', etc.
 */

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars (except - and _)
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with -
        .replace(/^-+|-+$/g, ''); // Trim -
}

/**
 * Normalizes the metadata object to a standard schema.
 */
function normalizeMetadata(key, raw) {
    const params = (raw.params || []).map((p) => ({
        name: p.name,
        type: p.type || p.value_type || "any",
        required: p.required !== undefined ? p.required : false,
        default: p.default || p.default_value || null,
        description: p.description || p.info || "",
    }));

    // Construct Signature
    let signature = key;
    if (raw.fn && typeof raw.fn === 'function' || (raw.params && raw.params.length > 0)) {
        const paramStr = params.map(p => {
            if (!p.required) return `[${p.name}]`;
            return p.name;
        }).join(", ");
        signature = `${key}(${paramStr})`;
    } else if (raw.type === 'class') {
        signature = `Class: ${key}`;
    }

    return {
        name: key,
        signature: signature,
        description: raw.description || raw.info || "No description available.",
        url: raw.url || raw.web || null,
        deprecated: raw.deprecated || false,
        params: params,
        notes: Array.isArray(raw.notes) ? raw.notes : [],
        agentGuidance: Array.isArray(raw.agentGuidance) ? raw.agentGuidance : [],
        returns: raw.return
            ? typeof raw.return === "object"
                ? raw.return
                : { description: raw.return }
            : null,
        example: raw.example || null,
    };
}

function generateLibraryMarkdown(key, fn) {
    const meta = normalizeMetadata(key, fn);
    let md = `# \`${meta.signature}\`\n\n`;

    if (meta.deprecated) {
        md += `> **⚠️ DEPRECATED**\n\n`;
    }

    if (meta.url) {
        md += `[External Documentation](${meta.url}) \n\n`;
    }

    md += `${meta.description}\n\n`;

    if (meta.notes.length > 0) {
        md += `**Notes**\n\n`;
        meta.notes.forEach((note) => {
            md += `- ${note}\n`;
        });
        md += `\n`;
    }

    if (meta.agentGuidance.length > 0) {
        md += `**Agent Guidance**\n\n`;
        meta.agentGuidance.forEach((note) => {
            md += `- ${note}\n`;
        });
        md += `\n`;
    }

    if (meta.params.length > 0) {
        md += `**Parameters**\n\n`;
        meta.params.forEach((p) => {
            const typeStr = p.type ? ` <${p.type}>` : "";
            const reqStr = p.required ? "" : " **Optional**.";
            const defStr = p.default !== null ? ` Default: \`${p.default}\`.` : "";
            md += `*   \`${p.name}\`${typeStr}${reqStr}${defStr} ${p.description}\n`;
        });
        md += `\n`;
    }

    if (meta.returns) {
        let returnType = "";
        if (meta.returns.value_type) returnType = ` <${meta.returns.value_type}>`;
        else if (meta.returns.type) returnType = ` <${meta.returns.type}>`;

        md += `*   Returns:${returnType} ${meta.returns.info || meta.returns.description || ""}\n\n`;

        // Handle complex object returns documentation if present
        if (Array.isArray(meta.returns.object)) {
            md += `    **Result Structure:**\n\n`;
            meta.returns.object.forEach(prop => {
                const pType = prop.value_type || prop.type || "any";
                md += `    *   \`${prop.name}\` <${pType}> ${prop.info || prop.description || ""}\n`;
            });
            md += `\n`;
        }
    }

    if (meta.example) {
        md += `#### Example\n\n`;
        md += `\`\`\`javascript\n${meta.example}\n\`\`\`\n\n`;
    }

    return md;
}

function generateIndexMarkdown(functions) {
    let md = `# JS Handler Libraries Index\n\n`;
    md += `Below is the index of available libraries and functions inside the JS handler VM sandbox.\n\n`;
    md += `| Library / Variable | Signature | Description | Recommended Use Case |\n`;
    md += `|---|---|---|---|\n`;

    const sortedKeys = Object.keys(functions).sort();
    sortedKeys.forEach((key) => {
        const fn = functions[key];
        const meta = normalizeMetadata(key, fn);

        // Escape $ for table display
        const displayKey = key.replace(/\$/g, "\\$");
        // Get first sentence of description
        const firstSentence = meta.description.split(/[.!?]/)[0].trim() + ".";

        // Determine recommended use case
        let useCase = "-";
        if (meta.agentGuidance.length > 0) {
            useCase = meta.agentGuidance[0];
        } else if (meta.notes.length > 0) {
            useCase = meta.notes[0];
        }

        md += `| [${displayKey}](./${key}.md) | \`${meta.signature}\` | ${firstSentence} | ${useCase} |\n`;
    });

    md += `\n> Auto-generated from \`src/lib/server/generateDocs.js\`.\n`;
    return md;
}

async function main() {
    try {
        console.log("Generating documentation...");
        // Pass null/dummy arguments because listFunctionsVars expects them strictly for returning the function object,
        // but for metadata it returns the structure even with undefined.
        const functions = listFunctionsVars(null, null, null);

        // Delete old output file if it exists
        try {
            await fs.unlink(OLD_OUTPUT_FILE);
            console.log(`Deleted old consolidated documentation file at: ${OLD_OUTPUT_FILE}`);
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
        }

        // Create libraries directory
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Clean out existing files in the directory to avoid stale docs
        try {
            const existingFiles = await fs.readdir(OUTPUT_DIR);
            for (const file of existingFiles) {
                await fs.unlink(path.join(OUTPUT_DIR, file));
            }
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
        }

        // Write index file
        const indexMarkdown = generateIndexMarkdown(functions);
        const indexFilePath = path.join(OUTPUT_DIR, "README.md");
        await fs.writeFile(indexFilePath, indexMarkdown, "utf-8");
        console.log(`Libraries index generated at: ${indexFilePath}`);

        // Write individual files
        const sortedKeys = Object.keys(functions).sort();
        for (const key of sortedKeys) {
            const libMarkdown = generateLibraryMarkdown(key, functions[key]);
            const libFilePath = path.join(OUTPUT_DIR, `${key}.md`);
            await fs.writeFile(libFilePath, libMarkdown, "utf-8");
        }
        console.log(`Generated ${sortedKeys.length} library detail files under: ${OUTPUT_DIR}`);
    } catch (error) {
        console.error("Error generating documentation:", error);
        process.exit(1);
    }
}

main();

