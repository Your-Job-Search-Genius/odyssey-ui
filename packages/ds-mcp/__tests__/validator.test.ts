import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import { beforeAll, describe, expect, it } from "vitest";
import { validateJsx } from "../src/validator.js";

let registry: Registry;
beforeAll(() => {
    registry = loadRegistry();
});

function run(code: string, strict?: boolean) {
    return validateJsx(code, registry, { strict });
}

describe("validate_jsx: allowed code", () => {
    it("passes a simple valid Button", () => {
        const result = run('import { Button } from "@/components/base/buttons/button";\nconst X = () => <Button size="md" color="primary">Save</Button>;');
        expect(result.ok).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("passes a Button with an icon imported from the icon set", () => {
        const code = [
            'import { Button } from "@/components/base/buttons/button";',
            'import { Check } from "@/components/foundations/icons";',
            'const X = () => <Button iconLeading={Check} color="primary">Save</Button>;',
        ].join("\n");
        expect(run(code).ok).toBe(true);
    });

    it("passes a link-styled Button with href", () => {
        const code = 'import { Button } from "@/components/base/buttons/button";\nconst X = () => <Button href="/dashboard" color="link-color">View</Button>;';
        expect(run(code).ok).toBe(true);
    });

    it("passes a Select with a nested Select.Item", () => {
        const code = [
            'import { Select } from "@/components/base/select/select";',
            "const X = () => (",
            '  <Select label="Team" placeholder="Pick">',
            '    <Select.Item id="1">Olivia</Select.Item>',
            "  </Select>",
            ");",
        ].join("\n");
        const result = run(code);
        expect(result.ok).toBe(true);
    });

    it("passes token-backed primitives with hover/dark variants", () => {
        const code = '<div className="flex items-center gap-2 rounded-lg bg-primary p-4 text-primary hover:bg-primary_hover dark:text-primary">Hello</div>';
        expect(run(code).ok).toBe(true);
    });

    it("passes plain text primitives (p, h1-h6)", () => {
        const code = '<div className="flex flex-col gap-2"><h1 className="text-primary">Title</h1><p className="text-tertiary">Body</p></div>';
        expect(run(code).ok).toBe(true);
    });
});

describe("validate_jsx: forbidden elements", () => {
    it.each([
        ["input", "Input"],
        ["button", "Button"],
        ["select", "Select"],
        ["textarea", "Textarea"],
        ["a", "Button"],
    ])("rejects raw <%s> with a suggested replacement mentioning %s", (tag, suggestionContains) => {
        const result = run(`<${tag}></${tag}>`);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes(suggestionContains))).toBe(true);
    });

    it.each(["form", "img", "table", "ul", "ol", "li", "iframe", "svg"])("rejects raw <%s> without fabricating a replacement", (tag) => {
        const result = run(`<${tag}></${tag}>`);
        expect(result.ok).toBe(false);
        expect(result.errors[0]?.message).not.toMatch(/Use \w+ instead/);
    });

    it("rejects a <style> tag with a specific message, not a generic one", () => {
        const result = run("<style></style>");
        expect(result.ok).toBe(false);
        expect(result.errors[0]?.message).toContain("never allowed");
    });
});

describe("validate_jsx: styling rules", () => {
    it("rejects an arbitrary Tailwind value", () => {
        const result = run('<div className="bg-[#ff0000]">x</div>');
        expect(result.ok).toBe(false);
        expect(result.errors[0]?.message).toContain("Arbitrary Tailwind value");
    });

    it("rejects a raw palette color not in the token set's usage (unknown class)", () => {
        const result = run('<div className="not-a-real-class-xyz">x</div>');
        expect(result.ok).toBe(false);
        expect(result.errors[0]?.message).toContain("does not resolve to a design token");
    });

    it("rejects an inline style prop", () => {
        const result = run('<div style={{ color: "red" }}>x</div>');
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("Inline style"))).toBe(true);
    });

    it("rejects dangerouslySetInnerHTML", () => {
        const result = run('<div dangerouslySetInnerHTML={{ __html: "x" }} />');
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("dangerouslySetInnerHTML"))).toBe(true);
    });

    it("rejects a CSS import", () => {
        const result = run('import "./styles.css";\nconst X = () => <div>x</div>;');
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("CSS imports"))).toBe(true);
    });

    it("does not flag dynamic className expressions (out of static-analysis scope)", () => {
        const code = 'import { cx } from "@/utils/cx";\nconst X = ({ active }) => <div className={cx("flex", active && "bg-primary")}>x</div>;';
        // cx import itself isn't from the component library, but it is not
        // a JSX tag, so the import-path check does not apply to it either.
        const result = run(code);
        expect(result.errors.some((e) => e.message.includes("does not resolve to a design token"))).toBe(false);
    });
});

describe("validate_jsx: unknown / misimported components", () => {
    it("rejects a component that does not exist in the registry", () => {
        const result = run("const X = () => <TotallyMadeUpComponent />;");
        expect(result.ok).toBe(false);
        expect(result.errors[0]?.message).toContain("Unknown component");
    });

    it("rejects a real component name imported from the wrong path", () => {
        const code = 'import { Button } from "some-other-library";\nconst X = () => <Button>Save</Button>;';
        const result = run(code);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("not the component library"))).toBe(true);
    });

    it("rejects an icon name that does not exist", () => {
        const code = 'import { TotallyFakeIcon } from "@/components/foundations/icons";\nconst X = () => <div>{TotallyFakeIcon}</div>;';
        const result = run(code);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("Unknown icon"))).toBe(true);
    });
});

describe("validate_jsx: props", () => {
    it("rejects an invalid enum value", () => {
        const code = 'import { Button } from "@/components/base/buttons/button";\nconst X = () => <Button color="not-a-real-color">Save</Button>;';
        const result = run(code);
        expect(result.ok).toBe(false);
        expect(result.errors[0]?.message).toContain("expected one of");
    });

    it("rejects a required prop that's missing (Select.Item's id)", () => {
        const code = [
            'import { Select } from "@/components/base/select/select";',
            "const X = () => (",
            "  <Select>",
            "    <Select.Item>Olivia</Select.Item>",
            "  </Select>",
            ");",
        ].join("\n");
        const result = run(code);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes('missing required prop "id"'))).toBe(true);
    });

    it("does not false-flag a required prop when the element uses a spread attribute", () => {
        const code =
            'import { Select } from "@/components/base/select/select";\nconst X = (props) => (\n  <Select>\n    <Select.Item {...props}>Olivia</Select.Item>\n  </Select>\n);';
        const result = run(code);
        expect(result.errors.some((e) => e.message.includes('missing required prop "id"'))).toBe(false);
    });

    it("rejects an icon-accepting prop given a non-icon identifier", () => {
        const code = [
            'import { Button } from "@/components/base/buttons/button";',
            "const NotAnIcon = 42;",
            'const X = () => <Button iconLeading={NotAnIcon} color="primary">Save</Button>;',
        ].join("\n");
        const result = run(code);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("not imported from the icon set") || e.message.includes("not imported at all"))).toBe(true);
    });
});

describe("validate_jsx: compound nesting", () => {
    it("rejects Select.Item used outside a Select / Select.ComboBox", () => {
        const code = 'import { Select } from "@/components/base/select/select";\nconst X = () => <div><Select.Item id="1">Olivia</Select.Item></div>;';
        const result = run(code);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("may only appear inside"))).toBe(true);
    });

    it("rejects a non-Select.Item child inside Select", () => {
        const code = [
            'import { Select } from "@/components/base/select/select";',
            'import { Button } from "@/components/base/buttons/button";',
            "const X = () => (",
            "  <Select>",
            "    <Button>Not allowed here</Button>",
            "  </Select>",
            ");",
        ].join("\n");
        const result = run(code);
        expect(result.ok).toBe(false);
        expect(result.errors.some((e) => e.message.includes("only allows these children"))).toBe(true);
    });
});

describe("validate_jsx: warnings (non-blocking)", () => {
    it("warns on an icon-only Button with no aria-label", () => {
        const code = [
            'import { Button } from "@/components/base/buttons/button";',
            'import { Check } from "@/components/foundations/icons";',
            "const X = () => <Button iconLeading={Check} />;",
        ].join("\n");
        const result = run(code);
        expect(result.ok).toBe(true); // warning only, not an error
        expect(result.warnings.some((w) => w.message.includes("aria-label"))).toBe(true);
    });

    it("does not warn when an icon-only Button has an aria-label", () => {
        const code = [
            'import { Button } from "@/components/base/buttons/button";',
            'import { Check } from "@/components/foundations/icons";',
            'const X = () => <Button iconLeading={Check} aria-label="Save" />;',
        ].join("\n");
        expect(run(code).warnings).toEqual([]);
    });

    it("warns when a heading skips a level", () => {
        const result = run('<div><h1 className="text-primary">Title</h1><h4 className="text-primary">Skip</h4></div>');
        expect(result.warnings.some((w) => w.message.includes("skips a heading level"))).toBe(true);
    });

    it("warns on deeply nested divs", () => {
        const nested = Array.from({ length: 8 }, () => '<div className="flex">').join("") + "x" + "</div>".repeat(8);
        const result = run(nested);
        expect(result.warnings.some((w) => w.message.includes("nested"))).toBe(true);
    });
});

describe("validate_jsx: syntax errors", () => {
    it("reports invalid TSX as a syntax error rather than throwing", () => {
        const result = run("<div><span></div>");
        expect(result.ok).toBe(false);
        expect(result.errors[0]?.message).toContain("Syntax error");
    });
});

describe("validate_jsx: strict vs non-strict (auto-fix)", () => {
    it("returns no fixedCode in strict mode (the default)", () => {
        const result = run("<button>Save</button>", true);
        expect(result.fixedCode).toBeUndefined();
    });

    it("auto-fixes a renameable forbidden primitive when strict is false", () => {
        const result = run("<input />", false);
        expect(result.ok).toBe(false); // the violation is still reported
        expect(result.fixedCode).toBeDefined();
        expect(result.fixedCode).toContain("<Input");
    });

    it("does not fabricate an auto-fix for a tag with no direct replacement", () => {
        const result = run("<table></table>", false);
        expect(result.fixedCode).toBeUndefined();
    });
});
