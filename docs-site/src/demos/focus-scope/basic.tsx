import { useState } from "react";
import { FocusScope } from "react-aria";

export default function FocusScopeBasic() {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Opening traps Tab inside the dialog and restores focus on close.
      </p>
      <button type="button" className="wsu-hookDemo__button" onClick={() => setOpen(true)}>
        Open
      </button>
      {isOpen ? (
        // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional FocusScope demo
        <FocusScope contain restoreFocus autoFocus>
          <div className="wsu-hookDemo__container" style={{ marginTop: 16 }}>
            <label className="wsu-hookDemo__field">
              First name
              <input className="wsu-hookDemo__input" />
            </label>
            <label className="wsu-hookDemo__field">
              Last name
              <input className="wsu-hookDemo__input" />
            </label>
            <button type="button" className="wsu-hookDemo__button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </FocusScope>
      ) : null}
    </div>
  );
}
