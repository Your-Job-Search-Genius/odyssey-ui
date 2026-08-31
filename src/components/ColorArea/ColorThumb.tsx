import { ColorThumb as AriaColorThumb } from "react-aria-components";
import type { ColorThumbProps as AriaColorThumbProps } from "react-aria-components";

export type ColorThumbProps = Pick<AriaColorThumbProps, "className" | "style">;

/**
 * ColorThumb — the draggable circle inside `ColorArea`. Split out as its
 * own file (not its own .css/.stories/.test, per the `Menu`/`MenuHeader`
 * precedent) purely so it's independently importable if a future
 * `ColorSlider`/`ColorWheel` needs the same visual. Styling lives in
 * ColorArea.css under `.wsu-ColorThumb`.
 */
export function ColorThumb(props: ColorThumbProps) {
  return <AriaColorThumb className="wsu-ColorThumb" {...props} />;
}
