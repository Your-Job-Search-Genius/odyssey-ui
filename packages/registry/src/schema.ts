/**
 * The registry's data contract. Every extractor produces data that
 * validates against these schemas; every consumer (ds-mcp, the docs
 * agent-rules page, the playground) imports the inferred types from
 * here instead of redeclaring shapes by hand.
 */
import { z } from "zod";

export const PropEntrySchema = z.object({
    name: z.string(),
    /** Serialized TypeScript type, as reported by react-docgen-typescript. */
    type: z.string(),
    enumValues: z.array(z.string()).optional(),
    required: z.boolean(),
    default: z.string().optional(),
    description: z.string().optional(),
    /** True when this prop's value must come from the icon set (e.g. iconLeading). */
    acceptsIcon: z.boolean().optional(),
    /** True when this prop accepts a Tailwind className string. */
    acceptsClassName: z.boolean().optional(),
});
export type PropEntry = z.infer<typeof PropEntrySchema>;

export const SlotEntrySchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    /** Component names (registry entry names) allowed in this slot, or "any" / "text" / "none". */
    allowed: z.union([z.literal("any"), z.literal("text"), z.literal("none"), z.array(z.string())]),
});
export type SlotEntry = z.infer<typeof SlotEntrySchema>;

export const ComponentExampleSchema = z.object({
    title: z.string(),
    code: z.string(),
});
export type ComponentExample = z.infer<typeof ComponentExampleSchema>;

export const ComponentCategorySchema = z.enum(["base", "application", "foundations", "shared-assets", "marketing"]);
export type ComponentCategory = z.infer<typeof ComponentCategorySchema>;

export const ComponentEntrySchema = z.object({
    /** Registry id, e.g. "base/buttons/button" or "base/select/select". */
    id: z.string(),
    /** Exported name, e.g. "Button". */
    name: z.string(),
    /** What to import; differs from `name` for compound sub-components, e.g. "Select.Item". */
    importName: z.string(),
    /** Real module specifier to import from, e.g. "@/components/base/buttons/button". */
    importPath: z.string(),
    category: ComponentCategorySchema,
    description: z.string(),
    props: z.array(PropEntrySchema),
    slots: z.array(SlotEntrySchema),
    variants: z.record(z.string(), z.array(z.string())),
    compound: z
        .object({
            parent: z.string(),
            children: z.array(z.string()),
        })
        .optional(),
    /** Component names allowed as JSX children, or "none" / "text" / "any". */
    allowedChildren: z.union([z.literal("none"), z.literal("text"), z.literal("any"), z.array(z.string())]),
    /** Registry ids this component is only ever valid inside, e.g. Select.Item inside Select. */
    allowedParents: z.array(z.string()).optional(),
    examples: z.array(ComponentExampleSchema),
    a11y: z.string().optional(),
    doNot: z.array(z.string()),
    docsUrl: z.string(),
    /** True when this entry was extracted straight from docgen with no *.meta.ts override. */
    isExtracted: z.boolean(),
});
export type ComponentEntry = z.infer<typeof ComponentEntrySchema>;

/**
 * A narrow, per-prop correction for exactly one known react-docgen-typescript
 * limitation: a component whose props type is a union of variants (e.g.
 * Button's `ButtonProps | LinkProps`, where `href` only exists on the
 * Link variant) gets every union member's props flattened onto one list,
 * with a member-only prop reported as globally `required`. This is not a
 * general "edit any prop" escape hatch -- only `required` and
 * `description` may be adjusted, and only for a prop docgen already
 * found (see components.ts's applyPropOverrides, which drops an override
 * for a name that doesn't exist rather than fabricating a new prop).
 */
export const PropOverrideSchema = z.object({
    required: z.boolean().optional(),
    description: z.string().optional(),
});
export type PropOverride = z.infer<typeof PropOverrideSchema>;

/**
 * The subset of ComponentEntry a `<component>.meta.ts` override file may
 * supply. Anything omitted here falls back to what react-docgen-typescript
 * extracted. `id`, `name`, `importPath`, `props`, and `isExtracted` can
 * never be overridden -- they are facts about the source file, not
 * curation. `importName` IS overridable: it is exactly how a compound
 * sub-component (e.g. select-item.tsx's real export `SelectItem`) is
 * curated to its public access form (`Select.Item`) -- see
 * select-item.meta.ts. `propOverrides` is the one exception to "props
 * are never curated" -- see PropOverrideSchema's doc comment for why.
 */
export const ComponentMetaOverrideSchema = ComponentEntrySchema.omit({
    id: true,
    name: true,
    importPath: true,
    props: true,
    isExtracted: true,
})
    .partial()
    .extend({ propOverrides: z.record(z.string(), PropOverrideSchema).optional() });
export type ComponentMetaOverride = z.infer<typeof ComponentMetaOverrideSchema>;

export const TokenColorEntrySchema = z.object({
    /** CSS custom property, e.g. "--color-text-primary". */
    cssVar: z.string(),
    /** Tailwind utility class name, e.g. "text-primary". */
    className: z.string(),
    /** Resolved light-mode value (may itself be a var() reference). */
    value: z.string(),
    /** Resolved dark-mode value, when theme.css's .dark-mode block overrides this token. */
    darkValue: z.string().optional(),
    usage: z.string(),
});
export type TokenColorEntry = z.infer<typeof TokenColorEntrySchema>;

export const TokenSetSchema = z.object({
    colors: z.array(TokenColorEntrySchema),
    /** Breakpoint tokens, e.g. { xxs: "320px", sm: "640px" }. */
    breakpoints: z.record(z.string(), z.string()),
    shadows: z.array(z.string()),
    animations: z.array(z.string()),
    /**
     * No custom border-radius scale exists in packages/ui/styles/theme.css
     * today; Tailwind's default rounded-* scale applies. Kept as an empty,
     * explicit array (not omitted) so consumers don't have to guess whether
     * extraction failed versus the scale genuinely being the Tailwind default.
     */
    radius: z.array(z.string()),
    /** Regex source strings the validator uses to accept a className as token-backed. */
    allowedTailwindPatterns: z.array(z.string()),
});
export type TokenSet = z.infer<typeof TokenSetSchema>;

export const IconEntrySchema = z.object({
    /** Exported name, e.g. "Activity". */
    name: z.string(),
    importPath: z.literal("@/components/foundations/icons"),
    tags: z.array(z.string()),
});
export type IconEntry = z.infer<typeof IconEntrySchema>;

export const RuleSetSchema = z.object({
    allowedPrimitives: z.array(z.string()),
    forbiddenElements: z.array(z.string()),
    styleRules: z.array(z.string()),
    compositionRules: z.array(z.string()),
    version: z.string(),
});
export type RuleSet = z.infer<typeof RuleSetSchema>;

export const RegistrySchema = z.object({
    version: z.string(),
    generatedAt: z.string(),
    library: z.object({
        packageName: z.literal("@your-job-search-genius/odyssey-ui"),
        importPath: z.literal("@/components"),
        tailwindPrefix: z.string().optional(),
    }),
    components: z.array(ComponentEntrySchema),
    tokens: TokenSetSchema,
    icons: z.array(IconEntrySchema),
    rules: RuleSetSchema,
});
export type Registry = z.infer<typeof RegistrySchema>;
