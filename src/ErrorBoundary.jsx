import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('Application Error:', error);
    console.error('Error Info:', errorInfo);
    
    // In production, you would send this to an error monitoring service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: '#f6f9fc',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          <div style={{
            background: '#fff',
            padding: '48px',
            borderRadius: '8px',
            border: '1px solid #e6ebf1',
            maxWidth: '480px',
            width: '100%',
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#0a2540',
              margin: '0 0 16px 0',
            }}>
              Something went wrong
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#425466',
              margin: '0 0 24px 0',
              lineHeight: '1.6',
            }}>
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre style={{
                background: '#fef2f2',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '12px',
                textAlign: 'left',
                overflow: 'auto',
                marginBottom: '24px',
                maxHeight: '200px',
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#635bff',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginRight: '12px',
              }}
            >
              Refresh Page
            </button>
            <button
              onClick={this.handleReset}
              style={{
                background: 'transparent',
                color: '#425466',
                border: '1px solid #e6ebf1',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
