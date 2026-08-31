import { forwardRef } from "react";
import { Form as AriaForm } from "react-aria-components";
import type { FormProps as AriaFormProps } from "react-aria-components";
import "./Form.css";

export type FormProps = AriaFormProps;

/**
 * Form — built on `react-aria-components`' `Form`: a real `<form>` element
 * that threads `validationErrors` (e.g. from a server response) down to
 * every RAC-based field it contains (Checkbox, Select, ComboBox, TagsInput,
 * ...) via context, and exposes `onInvalid`/`validationBehavior` for the
 * native-vs-ARIA validation split documented in the WCAG doc §6. Hand-rolled
 * fields (Input, Textarea) manage their own `errorMessage` prop already and
 * aren't part of that context, same as everywhere else in this library.
 *
 * Not in source Figma — this is pure layout/behavior scaffolding, so it only
 * supplies the vertical rhythm between fields; visual field styling lives on
 * each field component itself.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form({ className, ...rest }, ref) {
  return <AriaForm ref={ref} className={className ? `wsu-Form ${className}` : "wsu-Form"} {...rest} />;
});
