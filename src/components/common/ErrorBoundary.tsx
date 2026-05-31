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
            backgroundColor: '#0a0a0a',
            borderRadius: '12px',
            border: '1px solid rgba(234, 179, 8, 0.2)',
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
              fontWeight: '700',
              color: '#EAB308',
              fontFamily: 'Poppins, sans-serif',
              margin: '0 0 8px 0',
            }}
          >
            Something went wrong
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: '#9CA3AF',
              margin: '0 0 20px 0',
            }}
          >
            This section failed to load. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#EAB308',
              color: '#000000',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '700',
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
