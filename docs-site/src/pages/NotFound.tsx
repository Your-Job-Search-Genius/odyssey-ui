import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <article className="docs-article">
      <span className="docs-eyebrow">404</span>
      <h1>Page not found</h1>
      <p className="docs-lede">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <p>
        <Link className="docs-btn docs-btn--primary" to="/">
          Back to home
        </Link>
      </p>
    </article>
  );
}
