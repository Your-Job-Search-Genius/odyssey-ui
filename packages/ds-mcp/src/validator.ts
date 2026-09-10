/**
 * validate_jsx's implementation. This is the actual enforcement
 * mechanism behind the whole design-system-MCP contract -- everything
 * else (get_rules, suggest_composition, ...) is guidance an agent can
 * ignore; this is the check that a piece of generated code either
 * passes or does not.
 *
 * Deliberately built on the TypeScript compiler API (`ts.createSourceFile`
 * + a manual visitor), not @babel/parser + @babel/traverse: this
 * codebase already uses `typescript` for AST work (see
 * apps/docs/scripts/sync-content.ts's extractExports), and pulling in a
 * second, separate parser stack for the same job would be pure
 * duplication for no behavioral benefit here.
 *
 * Exported as a plain function (no MCP/network dependency) so the
 * validate_jsx tool, a future ESLint rule, and tests can all call it the
 * same way.
 */
import type { ComponentEntry, Registry } from "@your-job-search-genius/ds-registry";
import { ICONS_IMPORT_PATH, UI_COMPONENTS_IMPORT_ROOT, UI_PACKAGE_NAME } from "@your-job-search-genius/ds-registry";
import ts from "typescript";

export interface ValidationIssue {
    message: string;
    line: number;
    column: number;
}

export interface ValidateJsxOptions {
    /** When false, attempts conservative auto-fixes and returns them as fixedCode. Defaults to true (no auto-fix). */
    strict?: boolean;
}

export interface ValidateJsxResult {
    ok: boolean;
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
    fixedCode?: string;
}

const CSS_INLINE_STYLE_MESSAGE = "Inline style={{...}} is not allowed. Use Tailwind utility classes that resolve to a design token instead.";

/** Tags with no exact library replacement -- reported without a fabricated suggestion, per get_rules' own instruction to say so honestly rather than invent one. */
const FORBIDDEN_TAG_SUGGESTIONS: Record<string, string | undefined> = {
    input: "Input",
    button: "Button",
    select: "Select (or Select.ComboBox for a searchable variant)",
    textarea: "Textarea",
    a: 'Button with an href prop and a "link-*" color variant',
    form: undefined,
    img: undefined,
    table: undefined,
    label: "the target component's own \"label\" prop (e.g. Input's label prop)",
    ul: undefined,
    ol: undefined,
    li: undefined,
    iframe: undefined,
    svg: undefined,
    style: undefined,
};

interface ImportBinding {
    /** Local identifier this import binds, e.g. "Button" or "ChevronDown". */
    localName: string;
    /** Module specifier text, e.g. "@your-job-search-genius/odyssey-ui/components/base/buttons/button". */
    modulePath: string;
    /** True when imported from the icons barrel. */
    isIconImport: boolean;
}

interface Ctx {
    sourceFile: ts.SourceFile;
    registry: Registry;
    imports: Map<string, ImportBinding>;
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
    /** Stack of registry ids for ancestor JSX component elements, innermost last -- used for allowedParents checks. */
    parentStack: string[];
    /** Last heading level seen in document order (not a nesting stack -- headings are siblings, not ancestors of each other). */
    lastHeadingLevel: number | undefined;
    divDepth: number;
    maxDivDepth: number;
}

function locate(sourceFile: ts.SourceFile, node: ts.Node): { line: number; column: number } {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    return { line: line + 1, column: character + 1 };
}

function addError(ctx: Ctx, node: ts.Node, message: string) {
    ctx.errors.push({ message, ...locate(ctx.sourceFile, node) });
}

function addWarning(ctx: Ctx, node: ts.Node, message: string) {
    ctx.warnings.push({ message, ...locate(ctx.sourceFile, node) });
}

function jsxTagName(tagName: ts.JsxTagNameExpression): string {
    if (ts.isIdentifier(tagName)) return tagName.text;
    if (ts.isPropertyAccessExpression(tagName)) return `${jsxTagName(tagName.expression as ts.JsxTagNameExpression)}.${tagName.name.text}`;
    return tagName.getText();
}

function isPascalCase(name: string): boolean {
    const first = name[0];
    return first !== undefined && first === first.toUpperCase() && first !== first.toLowerCase();
}

function findComponentByImportOrName(registry: Registry, name: string): ComponentEntry | undefined {
    return registry.components.find((c) => c.importName === name || c.name === name);
}

function collectImports(ctx: Ctx) {
    for (const stmt of ctx.sourceFile.statements) {
        if (!ts.isImportDeclaration(stmt) || !ts.isStringLiteral(stmt.moduleSpecifier)) continue;
        const modulePath = stmt.moduleSpecifier.text;

        if (modulePath.endsWith(".css")) {
            addError(ctx, stmt, `CSS imports are not allowed ("${modulePath}"). Styling is Tailwind utility classes only, applied via className.`);
            continue;
        }

        // The repo-internal "@/" alias only resolves inside the library's own
        // monorepo -- consumer apps must install the published package and
        // import from the package specifier (see get_rules' setup section).
        const isLegacyAliasPath = modulePath.startsWith("@/");
        if (isLegacyAliasPath) {
            const packagePath = modulePath.replace(/^@\//, `${UI_PACKAGE_NAME}/`);
            addError(
                ctx,
                stmt,
                `"${modulePath}" uses the library's repo-internal "@/" alias, which does not exist in a consuming app. Install ${UI_PACKAGE_NAME} and import from "${packagePath}" instead.`,
            );
        }

        // Bindings from a legacy "@/" import are still recorded (with their
        // would-be package meaning) so the one error above stays the only
        // report, instead of cascading into "used but not imported" noise.
        const isIconImport = modulePath === ICONS_IMPORT_PATH || modulePath === "@/components/foundations/icons";
        const isComponentPath = modulePath.startsWith(`${UI_COMPONENTS_IMPORT_ROOT}/`) || modulePath.startsWith("@/components/");
        const namedBindings = stmt.importClause?.namedBindings;
        if (!namedBindings || !ts.isNamedImports(namedBindings)) continue;

        for (const spec of namedBindings.elements) {
            const localName = spec.name.text;
            ctx.imports.set(localName, { localName, modulePath, isIconImport });

            if (isIconImport) {
                if (!ctx.registry.icons.some((i) => i.name === (spec.propertyName?.text ?? localName))) {
                    addError(
                        ctx,
                        spec,
                        `Unknown icon "${spec.propertyName?.text ?? localName}" -- not found in the icon set. Use search_icons to find an available one.`,
                    );
                }
            } else if (!isComponentPath && isPascalCase(localName)) {
                addError(
                    ctx,
                    stmt,
                    `"${localName}" is imported from "${modulePath}", not the component library. Only ${UI_PACKAGE_NAME} components (via ${UI_COMPONENTS_IMPORT_ROOT}/...) and ${ICONS_IMPORT_PATH} may be imported.`,
                );
            }
        }
    }
}

function checkClassName(ctx: Ctx, attr: ts.JsxAttribute) {
    if (!attr.initializer) return;
    let literalText: string | undefined;
    if (ts.isStringLiteral(attr.initializer)) {
        literalText = attr.initializer.text;
    } else if (ts.isJsxExpression(attr.initializer) && attr.initializer.expression && ts.isStringLiteral(attr.initializer.expression)) {
        literalText = attr.initializer.expression.text;
    } else {
        // Dynamic className (cx(...), template literals, ternaries, ...) is
        // not statically analyzable here -- out of scope, not an error.
        return;
    }

    const patterns = ctx.registry.tokens.allowedTailwindPatterns.map((p) => new RegExp(p));
    for (const cls of literalText.split(/\s+/).filter(Boolean)) {
        const bare = cls.replace(/^(hover|focus|focus-visible|active|disabled|dark|sm|md|lg|xl|2xl):/, "");
        if (/\[.*\]/.test(cls)) {
            addError(ctx, attr, `Arbitrary Tailwind value "${cls}" is not allowed. Use a token-backed class (see get_tokens) instead.`);
            continue;
        }
        const matches = patterns.some((re) => re.test(cls)) || patterns.some((re) => re.test(bare));
        if (!matches) {
            addError(ctx, attr, `"${cls}" does not resolve to a design token. Use get_tokens to find an approved class.`);
        }
    }
}

function checkRequiredAndEnumProps(ctx: Ctx, node: ts.JsxOpeningLikeElement, entry: ComponentEntry) {
    const givenProps = new Map<string, ts.JsxAttribute>();
    for (const attr of node.attributes.properties) {
        if (ts.isJsxAttribute(attr)) givenProps.set(attr.name.getText(), attr);
        // Spread attributes ({...props}) make static required-prop checking
        // unreliable -- skip the required-prop check entirely for this
        // element rather than false-flag a prop that's actually present.
        if (ts.isJsxSpreadAttribute(attr)) return;
    }

    for (const prop of entry.props) {
        if (prop.required && !givenProps.has(prop.name)) {
            addError(ctx, node, `<${entry.importName}> is missing required prop "${prop.name}".`);
        }
    }

    for (const [name, attr] of givenProps) {
        const prop = entry.props.find((p) => p.name === name);
        if (!prop?.enumValues || prop.enumValues.length === 0) continue;
        const value = attr.initializer && ts.isStringLiteral(attr.initializer) ? attr.initializer.text : undefined;
        if (value !== undefined && !prop.enumValues.includes(value)) {
            addError(ctx, attr, `<${entry.importName}> prop "${name}" got "${value}", expected one of: ${prop.enumValues.join(", ")}.`);
        }
    }
}

function checkAllowedParents(ctx: Ctx, node: ts.Node, entry: ComponentEntry) {
    if (!entry.allowedParents || entry.allowedParents.length === 0) return;
    const ok = ctx.parentStack.some((id) => entry.allowedParents?.includes(id));
    if (!ok) {
        addError(
            ctx,
            node,
            `<${entry.importName}> may only appear inside: ${entry.allowedParents.join(", ")}.${ctx.parentStack.length === 0 ? " It has no parent here." : ` Found inside: ${ctx.parentStack.at(-1)}.`}`,
        );
    }
}

function checkAllowedChildren(ctx: Ctx, node: ts.JsxElement, parentEntry: ComponentEntry | undefined, parentTag: string) {
    const rule = parentEntry?.allowedChildren;
    if (!rule || rule === "any") return;

    for (const child of node.children) {
        if (ts.isJsxText(child)) {
            if (rule === "none" && child.text.trim().length > 0) {
                addError(ctx, child, `<${parentTag}> does not allow text content.`);
            }
            continue;
        }
        if (ts.isJsxExpression(child)) continue; // dynamic content, not statically checkable
        if (rule === "none") {
            addError(ctx, child, `<${parentTag}> does not allow any children.`);
            continue;
        }
        if (rule === "text") {
            addError(ctx, child, `<${parentTag}> only allows text content, not element children.`);
            continue;
        }
        // rule is an array of allowed registry ids/names for this slot.
        const childTagName = ts.isJsxElement(child)
            ? jsxTagName(child.openingElement.tagName)
            : ts.isJsxSelfClosingElement(child)
              ? jsxTagName(child.tagName)
              : undefined;
        if (!childTagName) continue;
        const childEntry = findComponentByImportOrName(ctx.registry, childTagName);
        const matches = childEntry && rule.some((allowed) => allowed === childEntry.id || allowed === childEntry.name || allowed === childEntry.importName);
        if (!matches) {
            addError(ctx, child, `<${parentTag}> only allows these children: ${rule.join(", ")}. Found <${childTagName}>.`);
        }
    }
}

function checkIconAcceptingProps(ctx: Ctx, node: ts.JsxOpeningLikeElement, entry: ComponentEntry) {
    for (const attr of node.attributes.properties) {
        if (!ts.isJsxAttribute(attr)) continue;
        const prop = entry.props.find((p) => p.name === attr.name.getText());
        if (!prop?.acceptsIcon || !attr.initializer || !ts.isJsxExpression(attr.initializer) || !attr.initializer.expression) continue;
        const expr = attr.initializer.expression;
        const identifierName = ts.isIdentifier(expr) ? expr.text : ts.isJsxSelfClosingElement(expr) ? jsxTagName(expr.tagName) : undefined;
        if (!identifierName) continue; // some other expression shape; not statically checkable
        const binding = ctx.imports.get(identifierName);
        if (binding && !binding.isIconImport) {
            addError(ctx, attr, `<${entry.importName}> prop "${prop.name}" got "${identifierName}", which is not imported from the icon set.`);
        } else if (!binding) {
            addError(ctx, attr, `<${entry.importName}> prop "${prop.name}" got "${identifierName}", which is not imported at all.`);
        }
    }
}

function checkForbiddenAttrs(ctx: Ctx, node: ts.JsxOpeningLikeElement) {
    for (const attr of node.attributes.properties) {
        if (!ts.isJsxAttribute(attr)) continue;
        const name = attr.name.getText();
        if (name === "style") addError(ctx, attr, CSS_INLINE_STYLE_MESSAGE);
        if (name === "dangerouslySetInnerHTML") addError(ctx, attr, "dangerouslySetInnerHTML is not allowed.");
        if (name === "className") checkClassName(ctx, attr);
    }
}

function visitOpeningElement(ctx: Ctx, node: ts.JsxOpeningLikeElement, tag: string): ComponentEntry | undefined {
    checkForbiddenAttrs(ctx, node);

    if (!isPascalCase(tag) && !tag.includes(".")) {
        if (ctx.registry.rules.allowedPrimitives.includes(tag)) {
            if (tag === "div") {
                ctx.divDepth += 1;
                ctx.maxDivDepth = Math.max(ctx.maxDivDepth, ctx.divDepth);
            }
            if (/^h[1-6]$/.test(tag)) {
                const level = Number(tag[1]);
                const prevLevel = ctx.lastHeadingLevel;
                if (prevLevel !== undefined && level > prevLevel + 1) {
                    addWarning(ctx, node, `<${tag}> skips a heading level (previous heading was <h${prevLevel}>).`);
                }
                ctx.lastHeadingLevel = level;
            }
            return undefined;
        }
        const suggestion = FORBIDDEN_TAG_SUGGESTIONS[tag];
        addError(
            ctx,
            node,
            tag === "style"
                ? "A <style> tag is never allowed. No new CSS may be introduced."
                : suggestion
                  ? `<${tag}> is not an approved primitive. Use ${suggestion} instead.`
                  : `<${tag}> is not an approved primitive and has no direct library replacement. Say so explicitly rather than using it.`,
        );
        return undefined;
    }

    const entry = findComponentByImportOrName(ctx.registry, tag);
    if (!entry) {
        addError(
            ctx,
            node,
            `Unknown component <${tag}>. It is not in the registry -- use list_components / search_components to find an approved one, or say the request can't be met.`,
        );
        return undefined;
    }

    const binding = ctx.imports.get(tag.split(".")[0] ?? tag);
    // A legacy "@/components/..." path is compared by its package-specifier
    // meaning here -- collectImports already reported the alias itself, and
    // a second "wrong module" error per usage would just repeat it.
    const effectiveModulePath = binding?.modulePath.replace(/^@\//, `${UI_PACKAGE_NAME}/`);
    if (!binding) {
        addError(ctx, node, `<${tag}> is used but not imported.`);
    } else if (effectiveModulePath !== entry.importPath && !tag.includes(".")) {
        addError(ctx, node, `<${tag}> must be imported from "${entry.importPath}", not "${binding.modulePath}".`);
    }

    checkRequiredAndEnumProps(ctx, node, entry);
    checkIconAcceptingProps(ctx, node, entry);
    checkAllowedParents(ctx, node, entry);

    if (entry.name === "Button") {
        const hasChildren =
            "children" in node.parent && ts.isJsxElement(node.parent) && node.parent.children.some((c) => ts.isJsxText(c) && c.text.trim().length > 0);
        const hasIcon = node.attributes.properties.some(
            (a) => ts.isJsxAttribute(a) && (a.name.getText() === "iconLeading" || a.name.getText() === "iconTrailing"),
        );
        const hasAriaLabel = node.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText() === "aria-label");
        if (hasIcon && !hasChildren && !hasAriaLabel) {
            addWarning(ctx, node, "Icon-only Button has no visible text and no aria-label -- add one for assistive tech.");
        }
    }

    return entry;
}

function visit(ctx: Ctx, node: ts.Node) {
    if (ts.isJsxSelfClosingElement(node)) {
        const tag = jsxTagName(node.tagName);
        const entry = visitOpeningElement(ctx, node, tag);
        if (tag === "div") ctx.divDepth -= 1;
        if (entry) {
            ctx.parentStack.push(entry.id);
            ts.forEachChild(node, (child) => visit(ctx, child));
            ctx.parentStack.pop();
        } else {
            ts.forEachChild(node, (child) => visit(ctx, child));
        }
        return;
    }

    if (ts.isJsxElement(node)) {
        const tag = jsxTagName(node.openingElement.tagName);
        const entry = visitOpeningElement(ctx, node.openingElement, tag);
        ctx.parentStack.push(entry?.id ?? `primitive:${tag}`);
        checkAllowedChildren(ctx, node, entry, tag);
        for (const child of node.children) visit(ctx, child);
        ctx.parentStack.pop();
        if (tag === "div") ctx.divDepth -= 1;
        return;
    }

    ts.forEachChild(node, (child) => visit(ctx, child));
}

function hasSyntaxErrors(sourceFile: ts.SourceFile): boolean {
    // `parseDiagnostics` is not part of the public TypeScript API surface,
    // but is a stable, widely-relied-on field (react-docgen-typescript and
    // most JSX-aware tooling read it the same way) for "did createSourceFile
    // actually parse this cleanly" without standing up a full ts.Program.
    const diagnostics = (sourceFile as unknown as { parseDiagnostics?: unknown[] }).parseDiagnostics;
    return Array.isArray(diagnostics) && diagnostics.length > 0;
}

/** Conservative, text-level auto-fix: only forbidden-primitive-to-suggested-tag renames with a known 1:1 name (no prop/import rewriting -- see README's "Known gaps"). */
function attemptAutoFix(code: string, errors: ValidationIssue[]): string | undefined {
    let fixed = code;
    let changed = false;
    for (const [tag, suggestion] of Object.entries(FORBIDDEN_TAG_SUGGESTIONS)) {
        if (!suggestion || !errors.some((e) => e.message.includes(`<${tag}>`))) continue;
        const replacement = suggestion.split(" ")[0];
        if (!replacement || !/^[A-Z]/.test(replacement)) continue;
        const before = fixed;
        fixed = fixed.replace(new RegExp(`<${tag}(\\s|>)`, "g"), `<${replacement}$1`).replace(new RegExp(`</${tag}>`, "g"), `</${replacement}>`);
        if (fixed !== before) changed = true;
    }
    return changed
        ? `${fixed}\n// TODO(validate_jsx auto-fix): verify imports for renamed tags above -- add "import { X } from \\"${UI_COMPONENTS_IMPORT_ROOT}/...\\"" as needed.\n`
        : undefined;
}

export function validateJsx(code: string, registry: Registry, options: ValidateJsxOptions = {}): ValidateJsxResult {
    const strict = options.strict ?? true;
    const sourceFile = ts.createSourceFile("input.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

    if (hasSyntaxErrors(sourceFile)) {
        return { ok: false, errors: [{ message: "Syntax error: input is not valid TSX.", line: 1, column: 1 }], warnings: [] };
    }

    const ctx: Ctx = {
        sourceFile,
        registry,
        imports: new Map(),
        errors: [],
        warnings: [],
        parentStack: [],
        lastHeadingLevel: undefined,
        divDepth: 0,
        maxDivDepth: 0,
    };

    collectImports(ctx);
    ts.forEachChild(sourceFile, (node) => visit(ctx, node));

    if (ctx.maxDivDepth > 6) {
        ctx.warnings.push({ message: `Divs are nested ${ctx.maxDivDepth} levels deep -- consider simplifying the structure.`, line: 1, column: 1 });
    }

    const result: ValidateJsxResult = { ok: ctx.errors.length === 0, errors: ctx.errors, warnings: ctx.warnings };
    if (!strict && ctx.errors.length > 0) {
        const fixedCode = attemptAutoFix(code, ctx.errors);
        if (fixedCode) result.fixedCode = fixedCode;
    }
    return result;
}
