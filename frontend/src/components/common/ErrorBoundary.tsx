import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch JavaScript errors in child components.
 * Prevents entire page from crashing when a single component fails.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--surface-dark)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            margin: '20px',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              marginBottom: '16px',
            }}
          >
            ⚠️
          </div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '500',
              color: 'var(--accent-lime)',
              fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em',
              margin: '0 0 8px 0',
            }}
          >
            Something went wrong
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted-on-dark)',
              margin: '0 0 20px 0',
            }}
          >
            This section failed to load. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: 'var(--accent-lime)',
              color: 'var(--surface-card)',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
