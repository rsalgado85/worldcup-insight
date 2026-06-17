import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { t } from '@/constants/translations';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function getLanguage(): 'en' | 'es' {
  try {
    const raw = localStorage.getItem('worldcup-store');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.language === 'en' || parsed?.state?.language === 'es') {
        return parsed.state.language;
      }
    }
  } catch { /* ignore */ }
  return 'es';
}

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

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const lang = getLanguage();

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="glass-card p-8 max-w-md w-full text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-danger/10">
                <AlertTriangle size={32} className="text-danger" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-text-primary">{t('common.errorSomethingWentWrong', lang)}</h2>
            <p className="text-sm text-text-secondary">
              {this.state.error?.message || t('common.errorUnexpected', lang)}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <RefreshCw size={16} />
              {t('common.errorTryAgain', lang)}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
