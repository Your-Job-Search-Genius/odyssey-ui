import { Link, PreviewTrigger, Button } from "@your-job-search-genius/odyssey-ui";

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

export default function PreviewTriggerInteractions() {
  return (
    <p style={{ maxWidth: 480, font: "var(--wsu-font-body-md)", color: "var(--wsu-color-text-body)" }}>
      Previews open after a warmup delay (600ms by default) on hover or keyboard focus; once one is showing, others
      open immediately. While a preview is open, <kbd>Tab</kbd> moves focus into it — try tabbing to{" "}
      <code>#1234</code> below, then <kbd>Tab</kbd> again to reach &quot;View issue&quot; — and <kbd>Escape</kbd>{" "}
      closes it and returns focus to the trigger. Merged fixes for{" "}
      <IssuePreview number={1234} title="Add PreviewTrigger component" status="Open" author="mayachen" /> and{" "}
      <IssuePreview number={5678} title="Improve Popover safe area behavior" status="Closed" author="cwebb" />.
    </p>
  );
}
