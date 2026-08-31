import { useId, useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { useControllableState } from "../../utils/useControllableState";
import "./OtpInput.css";

export interface OtpInputProps {
  /** Visible label for the whole group (WCAG 3.3.2 — the group, not any single box, is what's labeled). */
  label: string;
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once when every box has a character. */
  onComplete?: (value: string) => void;
  type?: "numeric" | "alphanumeric";
  disabled?: boolean;
  errorMessage?: string;
  helperText?: string;
}

const NUMERIC_RE = /^[0-9]$/;
const ALPHANUMERIC_RE = /^[a-zA-Z0-9]$/;

/**
 * OtpInput — not present in the source Figma file (on the "missing
 * components" list); the segmented-boxes pattern follows WAI-ARIA APG's
 * PIN/OTP input recommendations. Plain semantic `<input>` elements — no
 * behavior library needed, just careful focus management: typing
 * auto-advances, Backspace on an empty box moves back, arrow keys move
 * between boxes, and pasting a full code distributes it across every box
 * at once. The group has one accessible name (`label`); each box is
 * individually named ("Digit N of length") so screen reader users can
 * tell them apart.
 */
export function OtpInput({
  label,
  length = 6,
  value,
  defaultValue,
  onChange,
  onComplete,
  type = "numeric",
  disabled,
  errorMessage,
  helperText,
}: OtpInputProps) {
  const [code, setCode] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? "",
    onChange,
  });
  const digits = Array.from({ length }, (_, i) => code[i] ?? "");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const reactId = useId();
  const groupId = `${reactId}-otp`;
  const errorId = `${groupId}-error`;
  const helperId = `${groupId}-helper`;
  const invalid = Boolean(errorMessage);
  const pattern = type === "numeric" ? NUMERIC_RE : ALPHANUMERIC_RE;

  function commit(nextDigits: string[]) {
    const next = nextDigits.join("");
    setCode(next);
    if (next.length === length && nextDigits.every(Boolean)) onComplete?.(next);
  }

  function handleChange(index: number, raw: string) {
    const char = raw.slice(-1);
    if (char && !pattern.test(char)) return;
    const next = [...digits];
    next[index] = char;
    commit(next);
    if (char && index < length - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      const next = [...digits];
      next[index - 1] = "";
      commit(next);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(index: number, e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").split("").filter((c) => pattern.test(c));
    if (!pasted.length) return;
    e.preventDefault();
    const next = [...digits];
    let cursor = index;
    for (const char of pasted) {
      if (cursor >= length) break;
      next[cursor] = char;
      cursor++;
    }
    commit(next);
    inputRefs.current[Math.min(cursor, length - 1)]?.focus();
  }

  return (
    <div className="wsu-OtpInput">
      <span id={groupId} className="wsu-OtpInput__label">
        {label}
      </span>
      <div role="group" aria-labelledby={groupId} className="wsu-OtpInput__boxes">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode={type === "numeric" ? "numeric" : "text"}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : helperText ? helperId : undefined}
            className="wsu-OtpInput__box"
            data-invalid={invalid || undefined}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
          />
        ))}
      </div>
      {invalid ? (
        <p id={errorId} className="wsu-OtpInput__message wsu-OtpInput__message--error" role="alert">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="wsu-OtpInput__message">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
