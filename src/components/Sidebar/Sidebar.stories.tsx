import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import type { SidebarItemData } from "./Sidebar";
import {
  Home03Icon,
  Briefcase01Icon,
  File01Icon,
  Mail01Icon,
  Linkedin01Icon,
  UserQuestion01Icon,
  FlashIcon,
  LegalDocument01Icon,
  HelpCircleIcon,
  Notification02Icon,
  ArrowUp01SharpIcon,
} from "@your-job-search-genius/icons";

/**
 * The exact item set from Figma's "Side Navigation" frame (node 433:11097).
 * Every href is "#" so the nav is clickable in Storybook without navigating away.
 */
const items: SidebarItemData[] = [
  { id: "dashboard", label: "Dashboard", href: "#", icon: <Home03Icon /> },
  { id: "job-board", label: "Job Board", href: "#", icon: <Briefcase01Icon /> },
  { id: "resume", label: "Resume", href: "#", icon: <File01Icon /> },
  { id: "cover-letter", label: "Cover Letter", href: "#", icon: <Mail01Icon /> },
  { id: "linkedin", label: "LinkedIn Analyzer", href: "#", icon: <Linkedin01Icon /> },
  {
    id: "interview",
    label: "Interview",
    icon: <UserQuestion01Icon />,
    children: [
      { id: "mock", label: "Mock Interview", href: "#" },
      { id: "prep", label: "Job Preparation", href: "#" },
      { id: "questions", label: "Question Bank", href: "#" },
    ],
  },
  { id: "auto-apply", label: "Auto Apply", href: "#", icon: <FlashIcon /> },
  { id: "offer", label: "Offer Negotiation", href: "#", icon: <LegalDocument01Icon /> },
];

const meta: Meta<typeof Sidebar> = {
  title: "Figma Components/Composites/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Plain semantic `<nav>`/`<ul>` — no behavior library needed. Nested items use `<details>`/`<summary>` for free keyboard/expanded-state support, same as Card. **Use when:** primary app navigation. The active item is marked with `aria-current="page"` and a visible indicator, never color alone — a rail inside a tinted pill on top-level items, a tinted pill on submenu items, matching Figma\'s two distinct active treatments. Only Default/Expanded states are implemented — Figma\'s "Minimized" property rendered pixel-identical to "Expanded" in every sample pulled, so a true icon-only collapsed rail isn\'t shipped (see docs/design-inventory.md §2.11). **Icons:** the glyphs here are hand-authored stand-ins — the file\'s vector assets are hosted on a domain this environment\'s egress policy blocks, so exact path data couldn\'t be extracted. Geometry (18px box, 1.5px stroke) matches the file; the paths themselves are approximations. Swap the `icon` prop for real exports when available — the component hardcodes no icon.',
      },
    },
  },
  args: { "aria-label": "Main", items },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Playground: Story = {
  args: { activeId: "resume" },
};

export const WithExpandedSubmenu: Story = {
  args: { activeId: "mock" },
};

export const NoActiveItem: Story = {};

export const WithoutIcons: Story = {
  name: "Without icons (icon prop is optional)",
  args: {
    items: [
      { id: "home", label: "Home", href: "#" },
      { id: "resumes", label: "Resumes", href: "#" },
      {
        id: "interview",
        label: "Interview",
        children: [
          { id: "mock", label: "Mock Interview", href: "#" },
          { id: "questions", label: "Question Bank", href: "#" },
        ],
      },
    ],
    activeId: "resumes",
  },
};

/* --- Full-frame parity story ------------------------------------------------
 * Reproduces Figma node 433:11097 end to end at its real 217x808 size, so it
 * can be diffed against the frame directly. The header and footer blocks are
 * separate components in the file (a "Header" component set and a loose
 * container), so they're composed here through the `header`/`footer` props
 * rather than baked into Sidebar itself.
 * -------------------------------------------------------------------------- */

function InstitutionHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4375rem" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "1.8125rem", // 29px
          height: "1.6875rem", // 27px
          borderRadius: "0.3333rem", // 5.333px
          backgroundColor: "#022afd",
          color: "#55b1f3",
          font: "500 0.9423rem/1.3461rem var(--wsu-font-family)", // 15.077px / 21.538px
        }}
        aria-hidden="true"
      >
        M
      </span>
      <span style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-heading)" }}>
        Institution Na...
      </span>
    </div>
  );
}

/** Matches a Sidebar item's geometry exactly; the file renders these in text-subtle. */
function UtilityRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.3125rem",
        boxSizing: "border-box",
        width: "100%",
        padding: "0.375rem 0.625rem 0.375rem 0.3125rem",
        border: "none",
        background: "transparent",
        borderRadius: "0.4375rem",
        color: "var(--wsu-color-text-disabled)",
        font: "var(--wsu-font-body-sm)",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span aria-hidden="true" style={{ width: "0.125rem", height: "1.375rem", flexShrink: 0 }} />
      <span
        aria-hidden="true"
        style={{ display: "inline-flex", width: "1.125rem", height: "1.125rem", flexShrink: 0 }}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function AccountFooter() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8125rem" /* 13px */ }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.1875rem" /* 3px */ }}>
        <UtilityRow icon={<HelpCircleIcon size="1.125rem" />} label="Help and Support" />
        <UtilityRow icon={<Notification02Icon size="1.125rem" />} label="Notifications" />
      </div>
      {/* 197px rule in a 185px content box — it bleeds 6px past the padding on each side. */}
      <hr
        style={{
          margin: "0 -0.375rem",
          border: 0,
          borderTop: "1px solid var(--wsu-color-border-default)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.8125rem", // 29px
              height: "1.6875rem", // 27px
              borderRadius: "0.375rem", // 6px
              backgroundColor: "#000000",
              color: "#ffffff",
              font: "500 0.875rem/1.3461rem var(--wsu-font-family)",
            }}
          >
            MC
          </span>
          <span style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-heading)" }}>
            Moremi Chris
          </span>
        </div>
        <ArrowUp01SharpIcon size="1.125rem" style={{ color: "var(--wsu-color-text-heading)" }} />
      </div>
    </div>
  );
}

export const FigmaFrameParity: Story = {
  name: "Figma frame parity (217x808)",
  parameters: {
    docs: {
      description: {
        story:
          "The complete Figma frame (node 433:11097) at its real size, for direct visual diffing. Header and footer are composed via the `header`/`footer` props — they're separate components in the source file, not part of Sidebar itself.",
      },
    },
  },
  args: {
    activeId: "mock",
    style: { height: "50.5rem" }, // 808px
    header: <InstitutionHeader />,
    footer: <AccountFooter />,
  },
};
