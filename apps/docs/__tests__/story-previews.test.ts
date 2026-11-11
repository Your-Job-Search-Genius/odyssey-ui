import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * A component without a *.demo.tsx previews its *.story.tsx instead, and story files aren't "use client": the docs'
 * static export renders their exports as Server Components, so a function passed to a client component there (an
 * icon component, a handler) fails the whole build ("Functions cannot be passed directly to Client Components"), and
 * so does a compound part (Dropdown.Root is undefined there). Mark such a story file "use client", as demos are.
 */
const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const registry = readFileSync(here("../lib/demo-registry.ts"), "utf8");
const storyFiles = [...registry.matchAll(/from "@\/components\/(.+?\.story)"/g)].map((match) => match[1]);

const FUNCTION_PROPS = [
    /\b\w+=\{[A-Z][a-z]\w*\}/, // a component passed by reference, e.g. iconTrailing={ArrowIcon}
    /\b\w+=\{\s*(?:async\s*)?(?:\([^)]*\)|\w+)\s*=>/, // an inline arrow function
    /\bon[A-Z]\w*=\{/, // an event handler
    /<[A-Z]\w*\.[A-Z]\w*/, // a compound part (Dropdown.Root): undefined on the server for a client module's export
];

describe("story-backed previews", () => {
    it("finds them in the demo registry", () => expect(storyFiles.length).toBeGreaterThan(0));

    for (const story of storyFiles) {
        it(`${story} passes no functions to client components`, () => {
            const source = readFileSync(here(`../../../packages/ui/components/${story}.tsx`), "utf8");
            if (/^["']use client["']/.test(source)) return;
            const hits = source
                .split("\n")
                .flatMap((line, index) => (FUNCTION_PROPS.some((pattern) => pattern.test(line)) ? [`${index + 1}: ${line.trim()}`] : []));
            expect(hits).toEqual([]);
        });
    }
});
