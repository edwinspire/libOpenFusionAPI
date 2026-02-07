import { listFunctionsVars } from "./functionVars.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.resolve(__dirname, "../../../docs/JS_HANDLER_API.md");

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
        returns: raw.return
            ? typeof raw.return === "object"
                ? raw.return
                : { description: raw.return }
            : null,
        example: raw.example || null,
    };
}

function generateMarkdown(functions) {
    let md = `# JS Handler API Reference\n\n`;
    md += `> Auto-generated documentation for the JavaScript Handler environment.\n\n`;

    md += `## Table of Contents\n\n`;

    const sortedKeys = Object.keys(functions).sort();

    // TOC
    sortedKeys.forEach((key) => {
        // Escape $ for display to avoid math parsing issues
        const displayKey = key.replace(/\$/g, "\\$");
        // Standard Github-style slug: lowercase, remove non-alphanumeric (mostly)
        // Actually, simply lowercasing and keeping it simple is safer if we match the header generation.
        // However, if the header is `$_CUSTOM_HEADERS_`, GH makes it `#_custom_headers_` (removing $).
        // Let's try to just remove $ from the anchor for now.
        const anchor = key.toLowerCase().replace(/[^a-z0-9_]/g, '');
        md += `- [${displayKey}](#${anchor})\n`;
    });

    md += `\n---\n\n`;

    // Content
    sortedKeys.forEach((key) => {
        const fn = functions[key];
        const meta = normalizeMetadata(key, fn);

        md += `### \`${meta.signature}\`\n\n`;

        if (meta.deprecated) {
            md += `> **⚠️ DEPRECATED**\n\n`;
        }

        if (meta.url) {
            md += `[External Documentation](${meta.url}) \n\n`;
        }

        md += `${meta.description}\n\n`;

        if (meta.params.length > 0) {
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

        md += `---\n\n`;
    });

    return md;
}

async function main() {
    try {
        console.log("Generating documentation...");
        // Pass null/dummy arguments because listFunctionsVars expects them strictly for returning the function object,
        // but for metadata it returns the structure even with undefined.
        // Actually, looking at the code: `request && reply ? ... : undefined`
        // The metadata structure IS returned, but the `fn` property might be undefined.
        // That's fine for documentation generation.
        const functions = listFunctionsVars(null, null, null);

        const markdown = generateMarkdown(functions);

        await fs.writeFile(OUTPUT_FILE, markdown, "utf-8");
        console.log(`Documentation generated at: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error("Error generating documentation:", error);
        process.exit(1);
    }
}

main();
