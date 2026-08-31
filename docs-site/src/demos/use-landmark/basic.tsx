import { useRef, type ReactNode } from "react";
import { useLandmark } from "react-aria";

function Navigation({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);
  const { landmarkProps } = useLandmark({ role: "navigation" }, ref);
  return (
    <nav ref={ref} className="wsu-hookDemo__landmark" {...landmarkProps}>
      {children}
    </nav>
  );
}

function Search() {
  const ref = useRef<HTMLFormElement | null>(null);
  const { landmarkProps } = useLandmark({ role: "search" }, ref);
  return (
    <form ref={ref} className="wsu-hookDemo__landmark" {...landmarkProps}>
      <label className="wsu-hookDemo__field" htmlFor="docs-landmark-search">
        Search
        <input id="docs-landmark-search" type="search" className="wsu-hookDemo__input" />
      </label>
    </form>
  );
}

function Region({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);
  const { landmarkProps } = useLandmark(
    { role: "region", "aria-label": "Example region" },
    ref,
  );
  return (
    <article ref={ref} className="wsu-hookDemo__landmark" {...landmarkProps}>
      {children}
    </article>
  );
}

export default function UseLandmarkBasic() {
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Press F6 / Shift+F6 to cycle between the landmarks below.
      </p>
      <Navigation>
        <h3 style={{ margin: "0 0 0.5rem", font: "var(--wsu-font-body-sm-semibold)" }}>
          Navigation
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
          <li>
            <a href="#docs-link-1">Link 1</a>
          </li>
          <li>
            <a href="#docs-link-2">Link 2</a>
          </li>
        </ul>
      </Navigation>
      <Search />
      <Region>
        <h3 style={{ margin: "0 0 0.5rem", font: "var(--wsu-font-body-sm-semibold)" }}>
          Region
        </h3>
        <p style={{ margin: 0, font: "var(--wsu-font-body-sm)" }}>
          Landmark content lives here.
        </p>
      </Region>
    </div>
  );
}
