/**
 * CLAUDE.md's "Text Color" / "Border Color" / "Foreground Color" /
 * "Background Color" tables are the project's own hand-written, curated
 * usage descriptions for every semantic color class. Rather than
 * hand-transcribing those ~70 descriptions a second time into this
 * package (guaranteed to drift), this module parses the tables straight
 * out of CLAUDE.md at build time. If someone edits a description in
 * CLAUDE.md, the registry picks it up on the next `registry:build` with
 * zero code changes.
 */
import fs from "node:fs";

/** className -> usage description, e.g. "text-primary" -> "Primary text such as page headings." */
export type ColorUsageMap = Map<string, string>;

const TABLE_HEADINGS = ["### Text Color", "### Border Color", "### Foreground Color", "### Background Color"];

/**
 * A CLAUDE.md color table row looks like:
 *   | text-primary               | Primary text such as page headings. |
 * with a leading `Name` / `Usage` header row and a `:--|:--` separator
 * row above the data rows we want.
 */
function parseTable(lines: string[], startIndex: number): ColorUsageMap {
    const usage: ColorUsageMap = new Map();
    let i = startIndex;

    // Skip forward to the header row, then the separator row.
    while (i < lines.length && !(lines[i] ?? "").trim().startsWith("|")) i++;
    i += 2; // header row + separator row

    for (; i < lines.length; i++) {
        const line = lines[i] ?? "";
        if (!line.trim().startsWith("|")) break; // table ended
        const cells = line
            .split("|")
            .map((c) => c.trim())
            .filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""));
        if (cells.length < 2) continue;
        const name = cells[0]?.replace(/`/g, "").trim();
        const description = cells[1]?.replace(/`/g, "").trim();
        if (name && description) usage.set(name, description);
    }

    return usage;
}

export function extractColorUsageFromClaudeMd(claudeMdPath: string): ColorUsageMap {
    if (!fs.existsSync(claudeMdPath)) return new Map();
    const text = fs.readFileSync(claudeMdPath, "utf8");
    const lines = text.split("\n");

    const merged: ColorUsageMap = new Map();
    for (const heading of TABLE_HEADINGS) {
        const idx = lines.findIndex((l) => l.trim() === heading);
        if (idx === -1) continue;
        const table = parseTable(lines, idx + 1);
        for (const [name, description] of table) merged.set(name, description);
    }
    return merged;
}
