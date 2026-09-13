import React from 'react';

/**
 * AppErrorBoundary
 * Top-level application error boundary that prevents white screens of death.
 * Renders a cozy pixel-art recovery screen allowing users to reload or return home safely.
 */
export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[AppErrorBoundary Caught Fatal Error]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="min-h-screen bg-cozy-cream flex items-center justify-center p-4 sm:p-6 font-sans select-none"
        >
          <div className="w-full max-w-lg pixel-box bg-cozy-card p-6 sm:p-10 rounded-pixel shadow-pixel-lg border-4 border-cozy-brown-dark text-center space-y-6">
            {/* Themed Broken Quill / Sanctuary Icon */}
            <div className="w-20 h-20 mx-auto pixel-box bg-cozy-terracotta-subtle rounded-pixel flex items-center justify-center text-4xl shadow-pixel-sm border-2 border-cozy-terracotta-dark">
              📜💥
            </div>

            <div className="space-y-2">
              <h1 className="font-pixel text-xl sm:text-2xl text-cozy-brown-dark font-bold">
                Something Went Wrong in Your Study Haven
              </h1>
              <p className="text-xs sm:text-sm text-cozy-brown-medium leading-relaxed max-w-md mx-auto">
                An unexpected disturbance occurred in the archives. Don't worry, your character level, quest progress, and Cozy Coins remain safely preserved in the database.
              </p>
            </div>

            {/* Recovery Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto touch-target pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-sm px-5 py-2.5 rounded-pixel font-bold shadow-pixel-sm transition focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
              >
                🔄 Reload Sanctuary
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto touch-target pixel-box-interactive bg-cozy-parchment hover:bg-cozy-brown-subtle text-cozy-brown-dark font-pixel text-sm px-5 py-2.5 rounded-pixel font-bold shadow-pixel-sm transition focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
              >
                🏠 Go to Dashboard
              </button>
            </div>

            {/* Optional Collapsible Technical Details for Debugging */}
            {this.state.error && (
              <div className="text-left pt-4 border-t border-cozy-border">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="text-[11px] font-pixel text-cozy-brown-medium hover:text-cozy-brown-dark underline"
                >
                  {this.state.showDetails ? '▼ Hide Error Details' : '▶ View Error Details (for scholars & devs)'}
                </button>
                {this.state.showDetails && (
                  <pre className="mt-2 p-3 bg-cozy-parchment/80 rounded border border-cozy-border text-[10px] text-cozy-terracotta-dark font-mono overflow-x-auto max-h-36">
                    {this.state.error.toString()}
                    {'\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
