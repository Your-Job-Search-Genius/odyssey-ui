import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

// fumadocs-mdx parses each page's frontmatter as YAML. An invalid value (e.g. an unquoted
// `description: a: b`) fails the webpack build, and under Turbopack the build just hangs with no
// error -- so catch it here, where it fails fast with the file name.
const CONTENT_ROOT = path.join(import.meta.dirname, "..", "content", "docs");

const mdxFiles = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return mdxFiles(full);
        return entry.name.endsWith(".mdx") ? [full] : [];
    });

describe("docs content frontmatter", () => {
    const files = mdxFiles(CONTENT_ROOT);

    it("finds the docs pages", () => {
        expect(files.length).toBeGreaterThan(50);
    });

    it.each(files.map((file) => [path.relative(CONTENT_ROOT, file), file]))("%s has valid YAML frontmatter with a title", (_name, file) => {
        const match = /^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(file, "utf8"));
        expect(match, "missing frontmatter block").not.toBeNull();
        const data = parse(match![1]) as { title?: unknown; description?: unknown };
        expect(typeof data.title).toBe("string");
        if (data.description !== undefined) expect(typeof data.description).toBe("string");
    });
});
