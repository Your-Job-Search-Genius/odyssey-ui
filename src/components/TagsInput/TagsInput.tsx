import { forwardRef, useId, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useControllableState } from "../../utils/useControllableState";
import { CloseGlyph } from "../Icon/glyphs";
import "./TagsInput.css";

export interface TagsInputProps {
  /** Visible, programmatically-associated label (WCAG 3.3.2). */
  label: string;
  /** Controlled tag list. Use `defaultValue` for the uncontrolled form. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  placeholder?: string;
  helperText?: ReactNode;
  /** Presence puts the field in the error state and is announced via `role="alert"`. */
  errorMessage?: ReactNode;
  disabled?: boolean;
  /** Rejects a duplicate rather than adding it. Defaults to true. */
  allowDuplicates?: boolean;
  /** How a tag's remove button is named, e.g. `(t) => \`Remove ${t}\``. */
  removeLabel?: (tag: string) => string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * TagsInput — the "Tags" type from Figma's Inputs page (node 433:10374).
 * Split out of `Input` rather than added as a prop, because it owns a real
 * value model (an array, not a string) and its own keyboard contract.
 *
 * Enter commits the typed text; Backspace on an empty field removes the
 * last tag. Each tag is a list item with its own remove button, so the set
 * is navigable and every tag is individually removable by keyboard, and
 * additions and removals are announced through a polite live region —
 * none of which the file specifies, but all of which the pattern needs to
 * be operable (WCAG 2.1.1, 4.1.3).
 */
export const TagsInput = forwardRef<HTMLInputElement, TagsInputProps>(function TagsInput(
  {
    label,
    value,
    defaultValue = [],
    onValueChange,
    placeholder = "Add tags (press Enter to add)",
    helperText,
    errorMessage,
    disabled,
    allowDuplicates = false,
    removeLabel = (tag) => `Remove ${tag}`,
    className,
    style,
  },
  ref,
) {
  const [tags, setTags] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const inputId = useId();
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const invalid = Boolean(errorMessage);

  const describedBy = [invalid ? errorId : null, helperText ? helperId : null].filter(Boolean).join(" ") || undefined;

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    if (!allowDuplicates && tags.includes(tag)) {
      setAnnouncement(`${tag} is already added`);
      setDraft("");
      return;
    }
    setTags([...tags, tag]);
    setAnnouncement(`${tag} added`);
    setDraft("");
  }

  function removeTag(index: number) {
    const tag = tags[index];
    setTags(tags.filter((_, i) => i !== index));
    setAnnouncement(`${tag} removed`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      event.preventDefault();
      removeTag(tags.length - 1);
    }
  }

  return (
    <div className={className ? `wsu-TagsInput ${className}` : "wsu-TagsInput"} style={style}>
      <label className="wsu-TagsInput__label" htmlFor={inputId}>
        {label}
      </label>

      <div
        className="wsu-TagsInput__field"
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
      >
        {tags.length > 0 ? (
          <ul className="wsu-TagsInput__list">
            {tags.map((tag, index) => (
              <li key={`${tag}-${index}`} className="wsu-TagsInput__tag">
                <span className="wsu-TagsInput__tagLabel">{tag}</span>
                <button
                  type="button"
                  className="wsu-TagsInput__remove"
                  onClick={() => removeTag(index)}
                  disabled={disabled}
                  aria-label={removeLabel(tag)}
                >
                  <CloseGlyph size="0.75rem" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          className="wsu-TagsInput__control"
          value={draft}
          placeholder={tags.length === 0 ? placeholder : undefined}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(draft)}
        />
      </div>

      <span className="wsu-TagsInput__announcer" role="status" aria-live="polite">
        {announcement}
      </span>

      {invalid ? (
        <p id={errorId} className="wsu-TagsInput__message wsu-TagsInput__message--error" role="alert">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="wsu-TagsInput__message">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
