import { useFocusVisible } from "react-aria";

export default function UseFocusVisibleBasic() {
  const { isFocusVisible } = useFocusVisible();
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Click with the mouse, then press Tab — the readout flips globally.
      </p>
      <p>
        Focus visible: <strong>{String(isFocusVisible)}</strong>
      </p>
      <div className="wsu-hookDemo__row">
        <label className="wsu-hookDemo__field">
          First name
          <input className="wsu-hookDemo__input" />
        </label>
        <label className="wsu-hookDemo__field">
          Last name
          <input className="wsu-hookDemo__input" />
        </label>
      </div>
    </div>
  );
}
