import { forwardRef, useId, useState } from "react";
import type { CSSProperties, ForwardedRef, ReactElement, ReactNode, RefAttributes } from "react";
import { TextField, Input as AriaInput, Label, Text } from "react-aria-components";
import type { InputProps as RACInputProps, TextFieldProps } from "react-aria-components";
import { EyeIcon } from "@your-job-search-genius/icons";
import "./Input.css";

type StyledInputProps = Omit<TextFieldProps, "children" | "className" | "style"> & {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required, no `aria-label` escape hatch). */
  label: string;
  unstyled?: false;
  placeholder?: string;
  /** Shown below the field when there's no error. Rendered via react-aria-components' `Text` `description` slot. */
  helperText?: ReactNode;
  /**
   * Presence puts the field in the error state (red border, error icon, `role="alert"`) unless
   * `isInvalid` is passed explicitly — WCAG 3.3.1 (errors identified in text, not color alone) and
   * WCAG 4.1.3 (announced via a live region). This state doesn't exist in the source Figma file at
   * all; see docs/design-inventory.md §2.4.
   */
  errorMessage?: ReactNode;
  leadingIcon?: ReactNode;
  /** Ignored for `type="password"`, which always renders the built-in show/hide toggle instead. */
  trailingIcon?: ReactNode;
  /**
   * A leading element divided from the field by a rule — the file's
   * "Leading Dropdown" (a country select) and "Web" (an `https://` prefix)
   * types. Pass a real control for the dropdown case so it stays operable;
   * this slot only supplies the divider and spacing.
   */
  prefix?: ReactNode;
  /**
   * A trailing control inside the field — the file's "Web" type puts a
   * Paste button here. The field tightens its right padding to 5px when
   * this is present, as the file does.
   */
  action?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type UnstyledInputProps = Omit<RACInputProps, "className" | "style"> & {
  /**
   * Renders only the bare react-aria-components `Input` — no label, field
   * box, icons, or helper/error chrome. Use inside a composite such as
   * `Group` that supplies the shared field box and focus ring, or as the
   * text-entry primitive inside components like `TagsInput`/`OtpInput`.
   * Supply `label` and/or `aria-label` for an accessible name.
   */
  unstyled: true;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export type InputProps = StyledInputProps | UnstyledInputProps;

/**
 * Input — built on `react-aria-components`' `TextField`/`Input`. Exposes
 * their full prop set directly (`isDisabled`, `isRequired`, `isInvalid`,
 * `isReadOnly`, `validate`, `validationBehavior`, value-based `onChange`,
 * every native text-input DOM attribute, ...) rather than a narrowed/renamed
 * subset, so any RAC `TextField` capability is available with no translation
 * layer. `unstyled` renders the bare RAC `Input` leaf instead (its own
 * native-event `onChange`, `disabled`/`required`/`readOnly`), for
 * composition inside `Group` or a custom widget that owns its own
 * keyboard/value logic (`TagsInput`, `OtpInput`).
 */
function InputRender(props: InputProps, ref: ForwardedRef<HTMLInputElement>) {
  const reactId = useId();
  // Called unconditionally (Rules of Hooks) even though only the styled
  // branch's password toggle uses it.
  const [revealPassword, setRevealPassword] = useState(false);

  if (props.unstyled) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluded from `rest` so it isn't forwarded to the DOM
    const { unstyled, label, className, style, id, "aria-label": ariaLabel, ...rest } = props;

    return (
      <AriaInput
        ref={ref}
        id={id ?? reactId}
        aria-label={ariaLabel ?? label}
        className={
          className
            ? `wsu-Input__control wsu-Input__control--unstyled ${className}`
            : "wsu-Input__control wsu-Input__control--unstyled"
        }
        style={style}
        {...rest}
      />
    );
  }

  const {
    label,
    helperText,
    errorMessage,
    leadingIcon,
    trailingIcon,
    prefix,
    action,
    placeholder,
    id,
    className,
    style,
    type = "text",
    isInvalid: isInvalidProp,
    ...rest
  } = props;
  const inputId = id ?? reactId;
  const isPassword = type === "password";
  const invalid = isInvalidProp ?? Boolean(errorMessage);

  return (
    <TextField
      {...rest}
      id={inputId}
      type={type}
      isInvalid={invalid}
      className={className ? `wsu-Input ${className}` : "wsu-Input"}
      style={style}
    >
      {({ isDisabled, isInvalid, isRequired }) => (
        <>
          <Label className="wsu-Input__label">
            {label}
            {isRequired ? (
              <span className="wsu-Input__required" aria-hidden="true">
                {" "}
                *
              </span>
            ) : null}
          </Label>
          <div
            className="wsu-Input__field"
            data-invalid={isInvalid || undefined}
            data-disabled={isDisabled || undefined}
            data-has-action={action ? "" : undefined}
          >
            {prefix ? <span className="wsu-Input__prefix">{prefix}</span> : null}
            {leadingIcon ? (
              <span className="wsu-Input__icon" aria-hidden="true">
                {leadingIcon}
              </span>
            ) : null}
            <AriaInput
              ref={ref}
              type={isPassword && revealPassword ? "text" : type}
              placeholder={placeholder}
              className="wsu-Input__control"
            />
            {isPassword ? (
              <button
                type="button"
                className="wsu-Input__toggle"
                onClick={() => setRevealPassword((v) => !v)}
                disabled={isDisabled}
                aria-pressed={revealPassword}
                aria-label={revealPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon size="1rem" />
              </button>
            ) : trailingIcon ? (
              <span className="wsu-Input__icon" aria-hidden="true">
                {trailingIcon}
              </span>
            ) : null}
            {action ? <span className="wsu-Input__action">{action}</span> : null}
          </div>
          {isInvalid ? (
            <Text slot="errorMessage" role="alert" className="wsu-Input__message wsu-Input__message--error">
              {errorMessage}
            </Text>
          ) : helperText ? (
            <Text slot="description" className="wsu-Input__message">
              {helperText}
            </Text>
          ) : null}
        </>
      )}
    </TextField>
  );
}

/**
 * Wrapped and cast (rather than `forwardRef<HTMLInputElement, InputProps>(...)` directly) because
 * `PropsWithoutRef`/`Omit` don't distribute over the `InputProps` union — applying them to a raw
 * union collapses it to only the fields common to both `StyledInputProps` and `UnstyledInputProps`,
 * which silently breaks discrimination for every prop unique to either branch.
 */
export const Input = forwardRef(InputRender) as (
  props: InputProps & RefAttributes<HTMLInputElement>,
) => ReactElement | null;
