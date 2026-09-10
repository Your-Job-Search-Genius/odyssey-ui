/**
 * Registry override for Button. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape -- everything here wins
 * over what react-docgen-typescript extracted from button.tsx; anything
 * omitted (props, name, importPath, ...) falls back to the extracted
 * value untouched.
 *
 * Deliberately untyped (no import from @your-job-search-genius/ds-registry
 * here): packages/ui does not otherwise depend on packages/registry, and
 * this file's shape is validated against ComponentMetaOverrideSchema at
 * registry:build time regardless -- that's the real enforcement, not a
 * compile-time type in this package.
 */
export const componentMeta = {
    // Button's real prop type is `ButtonProps | LinkProps`, a union where
    // only LinkProps requires href. react-docgen-typescript flattens both
    // union members onto one prop list and reports href as globally
    // required, which would reject the overwhelmingly common plain
    // `<Button>...</Button>` case. Corrected here, not upstream in the
    // extractor -- see PropOverrideSchema's doc comment for why this is
    // a narrow, deliberate exception rather than a general prop editor.
    propOverrides: {
        href: {
            required: false,
            description: "A URL to link to. Only used (and only meaningful) when this Button should render as a link -- omit it entirely for a plain button.",
        },
    },
    description:
        "The primary interactive button/link element. Renders as an <a> when href is passed, otherwise a <button>. Never use the raw HTML button or a elements -- always use this component, including for link-styled text via the link-* color variants.",
    allowedChildren: "text",
    variants: {
        size: ["xs", "sm", "md", "lg", "xl"],
        color: [
            "primary",
            "secondary",
            "tertiary",
            "link-gray",
            "link-color",
            "primary-destructive",
            "secondary-destructive",
            "tertiary-destructive",
            "link-destructive",
        ],
    },
    a11y: "isDisabled sets the native disabled/aria-disabled state automatically; isLoading announces a busy state and disables interaction. Icon-only buttons (no children, only iconLeading/iconTrailing) need an aria-label since there is no visible text for assistive tech.",
    doNot: [
        'Do not render a raw <button> or <a> for anything Button already covers, including plain text links -- use color="link-gray" / "link-color" / "link-destructive" instead.',
        "Do not put block-level elements (div, headings) inside Button's children -- text and inline content only.",
        "Do not use primary-destructive/secondary-destructive/tertiary-destructive/link-destructive for anything other than a genuinely destructive action (delete, remove, revoke).",
    ],
    examples: [
        { title: "Basic", code: '<Button size="md">Save</Button>' },
        { title: "With leading icon", code: '<Button iconLeading={Check} color="primary">Save</Button>' },
        { title: "Destructive", code: '<Button color="primary-destructive" iconLeading={Trash02}>Delete</Button>' },
        { title: "Link styled", code: '<Button href="/dashboard" color="link-color">View dashboard</Button>' },
    ],
};
