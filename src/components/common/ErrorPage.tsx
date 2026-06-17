import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';

export function ErrorPage() {
  const error = useRouteError();
  const { language } = useAppStore();

  let title = t('common.errorSomethingWentWrong', language);
  let message = t('common.errorUnexpected', language);
  let status = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = `${status} - ${error.statusText}`;
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 20% 50%, #001B44 0%, #0F1416 40%, #0A0F10 70%)' }}>
      <div className="glass-card p-8 md:p-12 max-w-md w-full text-center">
        <AlertTriangle size={56} className="mx-auto mb-4 text-wc-red/60" />
        <h1 className="text-2xl font-black text-text mb-2">{title}</h1>
        <p className="text-text-secondary text-sm mb-8">{message}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-wc-blue text-white text-sm font-semibold hover:bg-wc-blue/90 transition-colors"
        >
          <Home size={16} />
          {t('common.backToHome', language)}
        </Link>
      </div>
    </div>
  );
}
