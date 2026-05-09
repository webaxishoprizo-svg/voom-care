import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
            <div className="max-w-md space-y-4">
              <h1 className="text-2xl font-display text-foreground">Something went wrong</h1>
              <p className="text-sm text-muted-foreground">
                Please refresh the page. If the problem persists, contact support.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium"
              >
                Reload
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
