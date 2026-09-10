/**
 * Runs the rule through ESLint's own RuleTester -- the real integration
 * point (config parsing, report() shape, message rendering), not just a
 * direct call to the rule's create() function.
 */
import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import { validateJsxRule } from "../src/rules/validate-jsx.js";

// RuleTester defaults to Mocha-style globals; pointing it at vitest's
// describe/it is the documented way to run it under another framework.
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: { ecmaFeatures: { jsx: true } },
    },
});

ruleTester.run("validate-jsx", validateJsxRule, {
    valid: [
        {
            code: 'import { Button } from "@your-job-search-genius/odyssey-ui/components/base/buttons/button";\nconst X = () => <Button size="md" color="primary">Save</Button>;',
        },
        {
            code: '<div className="flex items-center gap-2 rounded-lg bg-primary p-4 text-primary">Hello</div>',
        },
        {
            // strict:false's narrow auto-fix (forbidden-primitive rename) is
            // never surfaced by this rule -- see the README's "no autofix"
            // gap -- but the option itself must still be accepted.
            code: 'import { Button } from "@your-job-search-genius/odyssey-ui/components/base/buttons/button";\nconst X = () => <Button>Save</Button>;',
            options: [{ strict: false }],
        },
    ],
    invalid: [
        {
            code: "const X = () => <button>Save</button>;",
            errors: [{ messageId: "violation" }],
        },
        {
            code: '<div className="bg-[#ff0000]">x</div>',
            errors: [{ messageId: "violation" }],
        },
        {
            // Two independent, correct violations: the import statement
            // itself, and the JSX usage's import-path mismatch -- see
            // ds-mcp/src/validator.ts's collectImports and
            // visitOpeningElement, both already covered there.
            code: 'import { Button } from "some-other-library";\nconst X = () => <Button>Save</Button>;',
            errors: [{ messageId: "violation" }, { messageId: "violation" }],
        },
        {
            code: '<div style={{ color: "red" }}>x</div>',
            errors: [{ messageId: "violation" }],
        },
        {
            code: "const X = () => <TotallyMadeUpComponent />;",
            errors: [{ message: /Unknown component/ }],
        },
        {
            code: 'import "./styles.css";\nconst X = () => <div>x</div>;',
            errors: [{ message: /CSS imports/ }],
        },
    ],
});
