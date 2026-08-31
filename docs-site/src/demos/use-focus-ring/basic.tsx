import { useFocusRing } from "react-aria";

export default function UseFocusRingBasic() {
  const { isFocusVisible, focusProps } = useFocusRing();
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Tab to the button — <code>isFocusVisible</code> drives the ring via inline style.
      </p>
      <button
        type="button"
        className="wsu-hookDemo__button"
        {...focusProps}
        style={{ boxShadow: isFocusVisible ? "var(--wsu-shadow-focus-ring)" : "none" }}
      >
        Test
      </button>
    </div>
  );
}
