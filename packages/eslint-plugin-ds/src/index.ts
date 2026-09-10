/**
 * @your-job-search-genius/eslint-plugin-ds. Flat-config ESLint plugin
 * (this repo's own eslint.config.mjs is already flat-config, per
 * CLAUDE.md's ESLint conventions) exposing one rule: `ds/validate-jsx`.
 */
import type { ESLint, Linter } from "eslint";
import { validateJsxRule } from "./rules/validate-jsx.js";

const PLUGIN_NAME = "@your-job-search-genius/ds";

const plugin: ESLint.Plugin = {
    meta: { name: PLUGIN_NAME, version: "0.1.1" },
    rules: { "validate-jsx": validateJsxRule },
};

/**
 * A ready-to-spread flat config entry: `...dsPlugin.configs.recommended`
 * turns the rule on as an error for .tsx files. Consumers who want it
 * scoped to a specific directory (the common case -- see the rule's own
 * doc comment) should still add their own `files` glob on top of this.
 */
const recommended: Linter.Config = {
    plugins: { ds: plugin },
    rules: { "ds/validate-jsx": "error" },
};

interface DsPlugin extends ESLint.Plugin {
    configs: { recommended: Linter.Config };
}

const dsPlugin: DsPlugin = { ...plugin, configs: { recommended } };

export default dsPlugin;
export { validateJsxRule };
