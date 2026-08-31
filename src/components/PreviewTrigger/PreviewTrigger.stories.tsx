import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Focusable } from "react-aria-components";
import { PreviewTrigger } from "./PreviewTrigger";
import { Link } from "../Link/Link";
import { Button } from "../Button";

const meta: Meta<typeof PreviewTrigger> = {
  title: "Custom Components/PreviewTrigger",
  component: PreviewTrigger,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file** (on the project's \"missing components\" list alongside `Tooltip`). Built on `react-aria-components`' `PreviewTrigger`: a non-modal popover that opens on hover, focus, or long press. Unlike `Tooltip`, its content may be interactive — reuses the same `.wsu-Popover` chrome `Popover` carries. **Use when:** a rich preview of something referenced inline (a user profile behind an @mention, an issue behind its number). **Don't use when:** the content is a short line of text (use `Tooltip`) or the preview should only open on explicit click (use `Popover`).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PreviewTrigger>;

function avatarInitials(initials: string) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--wsu-color-secondary-bg)",
        color: "var(--wsu-color-text-heading)",
        font: "var(--wsu-font-body-sm-semibold)",
      }}
    >
      {initials}
    </div>
  );
}

interface Profile {
  handle: string;
  name: string;
  bio: string;
  initials: string;
}

function ProfilePreview({ handle, name, bio, initials }: Profile) {
  return (
    <PreviewTrigger trigger={<Link href="#">@{handle}</Link>}>
      <div style={{ width: 280 }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {avatarInitials(initials)}
          <div style={{ minWidth: 0 }}>
            <div style={{ font: "var(--wsu-font-body-sm-semibold)", color: "var(--wsu-color-text-heading)" }}>{name}</div>
            <div style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-subtle)" }}>@{handle}</div>
          </div>
          <Button style={{ marginLeft: "auto" }} variant="secondary" size="sm">
            Follow
          </Button>
        </div>
        <div style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-body)", marginTop: "0.75rem" }}>{bio}</div>
      </div>
    </PreviewTrigger>
  );
}

/**
 * The common case: hovering or focusing an inline `Link` opens a richer,
 * interactive preview than a `Tooltip` could hold — here, a profile card
 * with its own `Button`. Reuses `Popover`'s chrome so the preview matches
 * the rest of the system's overlay language.
 */
export const Playground: Story = {
  render: () => (
    <p style={{ maxWidth: 480, font: "var(--wsu-font-body-md)", color: "var(--wsu-color-text-body)" }}>
      Just shipped a new release with help from{" "}
      <ProfilePreview handle="mayachen" name="Maya Chen" bio="UI engineer, accessibility advocate, and component library enthusiast." initials="MC" />{" "}
      and <ProfilePreview handle="cwebb" name="Charles Webb" bio="Design systems, docs, and developer experience." initials="CW" />!
    </p>
  ),
};

interface Issue {
  number: number;
  title: string;
  status: "Open" | "Closed";
  author: string;
}

function IssuePreview({ number, title, status, author }: Issue) {
  return (
    <PreviewTrigger trigger={<Link href="#">#{number}</Link>}>
      <div style={{ width: 280 }}>
        <div style={{ font: "var(--wsu-font-body-sm-semibold)", color: "var(--wsu-color-text-heading)" }}>{title}</div>
        <div style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-subtle)", marginTop: "0.25rem" }}>
          #{number} · {status}
        </div>
        <div style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-subtle)", marginTop: "0.25rem" }}>Opened by {author}</div>
        <Button style={{ marginTop: "0.75rem" }} variant="secondary" size="sm">
          View issue
        </Button>
      </div>
    </PreviewTrigger>
  );
}

/**
 * Previews appear after a warmup delay (`delay`, default 600ms) on hover or
 * keyboard focus; once one preview is showing, others open immediately, and
 * waiting out the `closeDelay` (default 200ms) resets the warmup timer.
 * While a preview is open, `Tab` moves focus into it — try tabbing to
 * `#1234` below, then `Tab` again to reach "View issue" — and `Escape`
 * closes it and returns focus to the trigger.
 */
export const Interactions: Story = {
  render: () => (
    <p style={{ maxWidth: 480, font: "var(--wsu-font-body-md)", color: "var(--wsu-color-text-body)" }}>
      Merged fixes for <IssuePreview number={1234} title="Add PreviewTrigger component" status="Open" author="mayachen" /> and{" "}
      <IssuePreview number={5678} title="Improve Popover safe area behavior" status="Closed" author="cwebb" />.
    </p>
  ),
};

/**
 * `PreviewTrigger`'s trigger just needs to forward its ref and spread DOM
 * props onto a focusable element with an ARIA role — it doesn't have to be
 * a `react-aria-components` primitive. Wrap a plain or third-party element
 * in `Focusable` (from `react-aria-components`) so it picks up the
 * hover/focus/long-press handlers, and give it an explicit role so screen
 * readers can announce the preview.
 */
export const CustomTrigger: Story = {
  render: () => (
    <PreviewTrigger
      trigger={
        <Focusable>
          <span role="link" tabIndex={0} className="wsu-Link">
            Custom trigger
          </span>
        </Focusable>
      }
    >
      <p style={{ margin: 0, maxWidth: "16rem" }}>This preview was triggered by a plain element wrapped in Focusable, not the library&apos;s Link.</p>
    </PreviewTrigger>
  ),
};

/** All four base placements, each with its arrow rotated to match. */
export const Placements: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "3rem", padding: "4rem" }}>
      {(["top", "right", "bottom", "left"] as const).map((placement) => (
        <PreviewTrigger key={placement} placement={placement} trigger={<Link href="#">{placement}</Link>}>
          <p style={{ margin: 0 }}>Placement: {placement}</p>
        </PreviewTrigger>
      ))}
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <PreviewTrigger delay={0} trigger={<Link href="#">@mayachen</Link>}>
      <Button variant="secondary" size="sm">
        Follow
      </Button>
    </PreviewTrigger>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("link", { name: "@mayachen" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(await canvas.findByRole("button", { name: "Follow" })).toBeVisible();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Follow" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
  },
};
