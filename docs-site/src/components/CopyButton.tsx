import { useEffect, useRef, useState } from "react";
import { Copy01Icon, Tick02Icon } from "@your-job-search-genius/icons";

interface CopyButtonProps {
  /** Text to copy, or a promise-returning getter for lazily loaded source. */
  getText: () => string | Promise<string>;
  label?: string;
}

export function CopyButton({ getText, label = "Copy code" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      const text = await getText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — leave state as is.
    }
  };

  return (
    <button
      type="button"
      className="docs-copy"
      data-copied={copied || undefined}
      onClick={copy}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Tick02Icon size={13} /> : <Copy01Icon size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
