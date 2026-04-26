import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Bir Hata Oluştu</h1>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Uygulamada beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
            </p>
            {this.state.error && (
              <div className="bg-slate-50 rounded-lg p-3 mb-6 text-left overflow-auto">
                <p className="text-xs font-mono text-red-600">{this.state.error.message}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Sayfayı Yenile
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
