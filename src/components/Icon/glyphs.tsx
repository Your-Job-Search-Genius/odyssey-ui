import { Icon } from "./Icon";
import type { IconProps } from "./Icon";

/**
 * A small set of generic outline glyphs used internally by other components
 * (Checkbox's check mark, Modal's close button, Select's chevron, ...).
 * These are placeholder shapes, not the real Writesea Odyssey icon set —
 * glyph extraction from Figma (Hugeicons-style numbered icons: `cancel-01`,
 * `arrow-down-01-sharp`, `checkmark-square-02`, ...) was explicitly
 * deprioritized for this build. Swap these for the real exported glyphs
 * without changing any consumer's code once that pass happens, since every
 * component that needs a chrome icon imports it from here rather than
 * inlining its own path.
 */
type GlyphProps = Omit<IconProps, "children">;

export function CheckGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="M4 12.5 9.5 18 20 6" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function MinusGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" strokeWidth={2.2} strokeLinecap="round" />
    </Icon>
  );
}

export function CloseGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}

export function ChevronDownGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function ChevronUpGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="m6 15 6-6 6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function ChevronRightGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="m9 6 6 6-6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function AlertCircleGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth={2} />
      <path d="M12 7.5v6" strokeWidth={2} strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function InfoCircleGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth={2} />
      <path d="M12 11v5.5" strokeWidth={2} strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function SearchGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" strokeWidth={2} />
      <path d="m20 20-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}

export function EyeGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" strokeWidth={2} strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeWidth={2} />
    </Icon>
  );
}

export function UploadGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="M12 16V4M12 4 7 9M12 4l5 5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function CalendarGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth={2} />
      <path d="M3 10h18M8 3v4M16 3v4" strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}

/**
 * Sidebar nav glyphs. Figma's "Sidebar" composite (node 433:11097) specifies
 * a distinct icon per item, but the file's vector assets are hosted on
 * figma.com, which this environment's egress policy blocks outright
 * (confirmed via repeated 403s on every asset host, not a transient
 * failure) — so the literal path data can't be extracted, only each icon's
 * *identity*, which Figma's own component descriptions confirm for three of
 * these (home-01/"house", invoice-03/"bill", help-circle, notification-02).
 * These are hand-authored stand-ins matching that identity and the file's
 * outline-icon visual language, not extracted Figma vector data — swap for
 * the real exports once that host is reachable or a designer exports them
 * directly.
 */
/** Stroke weight matching the file's icon set (1.5px on a 24px box). */
const NAV_STROKE = 1.5;

export function DashboardGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path
        d="M3 10.6 12 3l9 7.6V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8.4Z"
        strokeWidth={NAV_STROKE}
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function BriefcaseGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="7" width="19" height="13.5" rx="3" strokeWidth={NAV_STROKE} />
      <path
        d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7"
        strokeWidth={NAV_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function ResumeGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="2.5" width="16" height="19" rx="3.5" strokeWidth={NAV_STROKE} />
      <path d="M8.5 9.5h7M8.5 13.5h7M8.5 17.5h4" strokeWidth={NAV_STROKE} strokeLinecap="round" />
    </Icon>
  );
}

export function CoverLetterGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="2.5" width="16" height="19" rx="3.5" strokeWidth={NAV_STROKE} />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h3.5" strokeWidth={NAV_STROKE} strokeLinecap="round" />
      <path d="M15.5 16h.01" strokeWidth={NAV_STROKE} strokeLinecap="round" />
    </Icon>
  );
}

/** The file uses a boxed "in" mark for the LinkedIn Analyzer entry. */
export function AnalyzerGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4.5" strokeWidth={NAV_STROKE} />
      <path d="M8.2 10.7v5.6" strokeWidth={NAV_STROKE} strokeLinecap="round" />
      <circle cx="8.2" cy="7.9" r="0.85" fill="currentColor" stroke="none" />
      <path
        d="M12.2 16.3v-5.6M12.2 13.4a2.4 2.4 0 0 1 4.8 0v2.9"
        strokeWidth={NAV_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function InterviewGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4.5" strokeWidth={NAV_STROKE} />
      <circle cx="12" cy="10" r="2.6" strokeWidth={NAV_STROKE} />
      <path d="M7.6 17.8a4.7 4.7 0 0 1 8.8 0" strokeWidth={NAV_STROKE} strokeLinecap="round" />
    </Icon>
  );
}

export function AutoApplyGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth={NAV_STROKE} />
      <path d="M12.9 6.5 8.4 12.8h3.4l-.7 4.7 4.5-6.3h-3.4l.7-4.7Z" strokeWidth={NAV_STROKE} strokeLinejoin="round" />
    </Icon>
  );
}

export function OfferNegotiationGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="2.5" width="16" height="19" rx="3.5" strokeWidth={NAV_STROKE} />
      <path d="M8.5 8.5h7M8.5 12.5h7M8.5 16.5h3" strokeWidth={NAV_STROKE} strokeLinecap="round" />
    </Icon>
  );
}

export function HelpCircleGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth={NAV_STROKE} />
      <path
        d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.8"
        strokeWidth={NAV_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="16.6" r="0.85" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function BellGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path
        d="M6.3 10.4a5.7 5.7 0 0 1 11.4 0c0 3.7 1.4 5.2 1.4 5.2H4.9s1.4-1.5 1.4-5.2Z"
        strokeWidth={NAV_STROKE}
        strokeLinejoin="round"
      />
      <path d="M9.8 18.2a2.4 2.4 0 0 0 4.4 0" strokeWidth={NAV_STROKE} strokeLinecap="round" />
    </Icon>
  );
}

/**
 * `checkmark-square-02` and `checkmark-circle-02` as the Dropdown page uses
 * them (Figma nodes 433:9136 and 433:9157): a rounded square that is an
 * outline when unchecked and filled with Primary/Base when checked, and a
 * filled circle with a white tick for the card menu's selected row.
 *
 * Geometry is taken from the nodes' own insets — the outline square sits at
 * `inset 10.42%` of a 24px box with a 1.5px stroke, the checked one at
 * `inset 7.29%`, the circle at `inset 5.21%` — because the exported vectors
 * live on figma.com, which this environment's egress proxy blocks. The
 * corner radius is read off the render rather than the vector, so it is the
 * one value here that is approximate.
 */
export function CheckboxSquareGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" strokeWidth={1.5} />
    </Icon>
  );
}

export function CheckboxSquareCheckedGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="1.75" y="1.75" width="20.5" height="20.5" rx="6" fill="currentColor" stroke="none" />
      <path
        d="m7.6 12.1 2.9 2.9 5.9-6.2"
        stroke="var(--wsu-color-text-on-primary)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function CheckCircleSolidGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10.75" fill="currentColor" stroke="none" />
      <path
        d="m7.4 12.2 3 3 6.2-6.5"
        stroke="var(--wsu-color-text-on-primary)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

/**
 * The five row glyphs the Dropdown page's menus use — `file-star`,
 * `search-list-01`, `edit-02`, `repeat` and `delete-02` (Figma node
 * 433:9130) — plus `file-upload` and `plus-sign` from its other rows.
 * Like the rest of this file these are house-style stand-ins drawn from
 * the rendered node, not the file's exported Hugeicons vectors: those live
 * on figma.com, which this environment's egress proxy blocks. They exist so
 * the Storybook stories can show the file's own examples; swap them for the
 * real exports when the icon pass happens.
 */
const ROW_STROKE = 1.6;

export function FileStarGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path
        d="M13.5 3H8a2.5 2.5 0 0 0-2.5 2.5v6M13.5 3l5 5v10.5A2.5 2.5 0 0 1 16 21h-4M13.5 3v3.5A1.5 1.5 0 0 0 15 8h3.5"
        strokeWidth={ROW_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m7.6 13.4 1.1 2.2 2.4.35-1.75 1.7.41 2.4-2.16-1.13L5.44 20l.41-2.4L4.1 15.9l2.4-.35z"
        strokeWidth={ROW_STROKE}
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function SearchListGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="M4 5.5h16M4 10h11M4 14.5h5" strokeWidth={ROW_STROKE} strokeLinecap="round" />
      <circle cx="14" cy="16.5" r="3.5" strokeWidth={ROW_STROKE} />
      <path d="m17 19.5 2.5 2.5" strokeWidth={ROW_STROKE} strokeLinecap="round" />
    </Icon>
  );
}

export function EditGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path
        d="M16.4 3.9a2.1 2.1 0 0 1 3 3L9.1 17.2a2 2 0 0 1-.9.5l-3.4.9.9-3.4a2 2 0 0 1 .5-.9z"
        strokeWidth={ROW_STROKE}
        strokeLinejoin="round"
      />
      <path d="m14.6 5.7 3.7 3.7" strokeWidth={ROW_STROKE} strokeLinecap="round" />
    </Icon>
  );
}

export function RepeatGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path
        d="M7.5 7.5h9a3.5 3.5 0 0 1 0 7h-9a3.5 3.5 0 0 1 0-7"
        strokeWidth={ROW_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m9.6 5.4-2.1 2.1 2.1 2.1M14.4 12.4l2.1 2.1-2.1 2.1" strokeWidth={ROW_STROKE} strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function TrashGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="M4 6.5h16M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" strokeWidth={ROW_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 6.5 7.3 18a2.5 2.5 0 0 0 2.5 2.3h4.4a2.5 2.5 0 0 0 2.5-2.3l.8-11.5" strokeWidth={ROW_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.3 10.5v5.6M13.7 10.5v5.6" strokeWidth={ROW_STROKE} strokeLinecap="round" />
    </Icon>
  );
}

export function FileUploadGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path
        d="M13.5 3H8a2.5 2.5 0 0 0-2.5 2.5v13A2.5 2.5 0 0 0 8 21h8a2.5 2.5 0 0 0 2.5-2.5V8zm0 0v3.5A1.5 1.5 0 0 0 15 8h3.5"
        strokeWidth={ROW_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 17v-6m0 0-2.2 2.2M12 11l2.2 2.2" strokeWidth={ROW_STROKE} strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function PlusGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}

/**
 * `multiplication-sign-square` — the close control on every Modal Header
 * variant in the file (node 433:9558). A filled dark rounded square with a
 * white cross, drawn at the node's own `inset 7.29%` of a 24px box; only
 * the corner radius is read off the render. Distinct from `CloseGlyph`,
 * which is the bare cross used elsewhere.
 */
export function CloseSquareGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <rect x="1.75" y="1.75" width="20.5" height="20.5" rx="6" fill="currentColor" stroke="none" />
      <path
        d="m8.7 8.7 6.6 6.6M15.3 8.7l-6.6 6.6"
        stroke="var(--wsu-color-text-on-primary)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Icon>
  );
}

/**
 * `presentation-bar-chart-02` — the leading glyph on the file's "With Icon"
 * and "With Description" modal headers (node 433:9569). Another house-style
 * stand-in drawn from the rendered node, per the note above.
 */
export function ChartGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <path d="M3 3h18M4.5 3v9.5A2.5 2.5 0 0 0 7 15h10a2.5 2.5 0 0 0 2.5-2.5V3" strokeWidth={ROW_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15v6m0 0-3 0m3 0 3 0" strokeWidth={ROW_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 11.5v-2M12 11.5v-4M15.5 11.5v-3" strokeWidth={ROW_STROKE} strokeLinecap="round" />
    </Icon>
  );
}

/**
 * `star-circle` — the trailing mark on the badge in the file's "With Badge"
 * modal header (node 433:9565), drawn at that node's `inset 5.21%` of a
 * 24px box. A house-style stand-in, per the note above.
 */
export function StarCircleGlyph(props: GlyphProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10.75" fill="currentColor" stroke="none" />
      <path
        d="m12 6.6 1.65 3.35 3.7.54-2.68 2.6.63 3.68L12 15.03l-3.3 1.74.63-3.68-2.68-2.6 3.7-.54z"
        fill="var(--wsu-color-text-on-primary)"
        stroke="none"
      />
    </Icon>
  );
}
