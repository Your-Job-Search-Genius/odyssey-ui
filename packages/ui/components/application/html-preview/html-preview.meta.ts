/**
 * Registry override for HtmlPreview. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape.
 */
export const componentMeta = {
    description:
        "Sandboxed preview of an HTML document or fragment (email templates, provider previews) in an <iframe srcDoc> with every sandbox restriction on: no scripts, forms, popups or navigation, and no CSS leaking either way. The approved replacement for a raw <iframe>.",
    allowedChildren: "none",
    variants: { height: ["sm", "md", "lg"], surface: ["white", "theme"] },
    a11y: "`title` is required and becomes the frame's accessible name. The frame is a single tab stop; its content is reachable by assistive tech as a separate document.",
    doNot: [
        "Do not use a raw <iframe> -- use HtmlPreview.",
        "Do not turn on autoHeight for HTML you don't control; it enables same-origin access so the content can be measured.",
        'Do not wrap HtmlPreview in a Modal wider than the email (600px is typical); use a Drawer or a Modal size="2xl" for side-by-side previews.',
    ],
    examples: [
        { title: "Email preview", code: '<HtmlPreview title="Preview of Welcome email (English)" html={template.html} />' },
        { title: "Sized to content (trusted HTML)", code: '<HtmlPreview title="Preview" html={template.html} autoHeight />' },
    ],
};
