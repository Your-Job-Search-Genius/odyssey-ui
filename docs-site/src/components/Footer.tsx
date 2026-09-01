import { Link } from "react-router-dom";
import { GithubIcon } from "@your-job-search-genius/icons";

const GITHUB_URL = "https://github.com/Your-Job-Search-Genius/yjsg-ui";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="docs-footer">
      <div className="docs-footer__inner">
        <div className="docs-footer__brand">
          <Link to="/" className="docs-footer__brandlink">
            <span className="docs-header__logo" aria-hidden="true">
              O
            </span>
            Odyssey UI
          </Link>
          <p className="docs-footer__tagline">
            Accessible React components built on react-aria-components —
            themeable, keyboard-ready, and copy-paste friendly.
          </p>
        </div>

        <nav className="docs-footer__col" aria-label="Documentation">
          <h2 className="docs-footer__heading">Documentation</h2>
          <Link to="/getting-started">Getting started</Link>
          <Link to="/components">Components</Link>
          <Link to="/theming">Theming</Link>
        </nav>

        <nav className="docs-footer__col" aria-label="Resources">
          <h2 className="docs-footer__heading">Resources</h2>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            <GithubIcon size={14} />
            GitHub
          </a>
          <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer">
            Report an issue
          </a>
        </nav>
      </div>

      <div className="docs-footer__bar">
        <span>© {year} Odyssey UI</span>
        <span className="docs-footer__built">
          Built on react-aria-components
        </span>
      </div>
    </footer>
  );
}
