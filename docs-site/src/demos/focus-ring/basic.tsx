import { FocusRing } from "react-aria";

export default function FocusRingBasic() {
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Click with a mouse — no ring. Tab to the button — the ring appears.
      </p>
      <FocusRing focusRingClass="wsu-hookDemo__focusRing">
        <button type="button" className="wsu-hookDemo__button">
          Tab to me
        </button>
      </FocusRing>
    </div>
  );
}
