import { Component } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LexGuard Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-lex-parchment flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-lex-ivory border border-lex-beige shadow-2xl p-12 text-center">
            {/* Decorative corners */}
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-4 h-4 border-t border-l border-lex-beige"></div>
              <div className="absolute -top-10 -right-10 w-4 h-4 border-t border-r border-lex-beige"></div>
            </div>

            <ShieldAlert className="mx-auto h-16 w-16 text-[#4a0d0d] mb-6" />
            
            <h2 className="text-3xl font-serif text-lex-walnut mb-4">
              Judicial System Error
            </h2>
            
            <p className="text-lex-walnut/70 font-serif italic mb-2">
              An unexpected error occurred in the LexGuard chambers.
            </p>
            
            <div className="bg-[#fcf8f8] border border-[#4a0d0d]/20 p-4 mb-8 text-left">
              <p className="text-[#4a0d0d] text-sm font-mono break-all">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-8 py-3 bg-lex-walnut text-lex-parchment font-serif uppercase tracking-widest text-sm hover:bg-lex-walnut/90 transition-colors"
            >
              <RefreshCw size={16} />
              Reconvene Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
