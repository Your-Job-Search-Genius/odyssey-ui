import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  GithubIcon,
  Menu01Icon,
  Search02Icon,
} from "@your-job-search-genius/icons";
import { useReveal } from "../lib/useReveal";
import { Footer } from "./Footer";
import { MobileDrawer } from "./MobileDrawer";
import { SearchPalette } from "./SearchPalette";
import { SidebarNav } from "./SidebarNav";
import { ThemeToggle } from "./ThemeToggle";

const GITHUB_URL = "https://github.com/Your-Job-Search-Genius/yjsg-ui";

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useReveal();

  return (
    <div className="docs-shell">
      <a href="#docs-content" className="docs-skip-link">
        Skip to content
      </a>
      <header className="docs-header">
        <button
          type="button"
          className="docs-icon-btn docs-hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
        >
          <Menu01Icon size={18} />
        </button>
        <Link to="/" className="docs-header__brand">
          <span className="docs-header__logo" aria-hidden="true">
            O
          </span>
          Odyssey UI
          <span className="docs-header__version">v0.1.0</span>
        </Link>
        <nav className="docs-header__nav" aria-label="Main">
          <NavLink to="/getting-started" className="docs-header__link">
            Docs
          </NavLink>
          <NavLink to="/components" end className="docs-header__link">
            Components
          </NavLink>
          <NavLink to="/theming" className="docs-header__link">
            Theming
          </NavLink>
        </nav>
        <div className="docs-header__spacer" />
        <button
          type="button"
          className="docs-search-btn"
          onClick={() => setSearchOpen(true)}
        >
          <Search02Icon size={14} />
          <span className="docs-search-btn__label">Search components…</span>
          <kbd className="docs-kbd">⌘K</kbd>
        </button>
        <ThemeToggle />
        <a
          className="docs-icon-btn"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
        >
          <GithubIcon size={18} />
        </a>
      </header>

      <div className="docs-main">
        <aside className="docs-sidebar">
          <SidebarNav />
        </aside>
        {/* Keyed on the path so each navigation replays the entrance
            animation (docs-page-in) and useReveal re-scans fresh content. */}
        <div
          className="docs-content docs-page-in"
          id="docs-content"
          key={location.pathname}
        >
          <Outlet />
        </div>
      </div>

      <Footer />

      {drawerOpen && <MobileDrawer onClose={() => setDrawerOpen(false)} />}
      <SearchPalette isOpen={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
