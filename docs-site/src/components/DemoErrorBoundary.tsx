import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors (including failed lazy imports) inside a single demo
 * so one broken example never blanks the rest of the page.
 */
export class DemoErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="docs-demo__error" role="alert">
          <strong>This demo failed to render.</strong>
          {this.state.error.message}
          <div>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
