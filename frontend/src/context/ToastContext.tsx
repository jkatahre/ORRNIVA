import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Check, Heart, Info, X } from 'lucide-react';

type ToastKind = 'success' | 'info' | 'wishlist';
interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
  image?: string;
  action?: { label: string; to: string };
}

interface ToastApi {
  show: (t: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((ts) => ts.filter((t) => t.id !== id)), []);

  const show = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = nextId.current++;
      setToasts((ts) => [...ts.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismiss(id), 3800);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full animate-toast items-center gap-3 border border-sand bg-ivory p-3 pr-2 shadow-[0_12px_40px_-12px_rgba(43,39,36,0.35)] sm:w-[360px]"
          >
            {t.image ? (
              <img src={t.image} alt="" className="h-14 w-12 flex-none object-cover" />
            ) : (
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-cream">
                {t.kind === 'wishlist' ? <Heart size={16} /> : t.kind === 'info' ? <Info size={16} /> : <Check size={16} />}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
                {t.kind === 'success' && <Check size={14} className="text-success" />}
                {t.title}
              </p>
              {t.message && <p className="truncate text-[12px] text-muted">{t.message}</p>}
              {t.action && (
                <Link
                  to={t.action.to}
                  onClick={() => dismiss(t.id)}
                  className="mt-0.5 inline-block text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal underline underline-offset-4"
                >
                  {t.action.label}
                </Link>
              )}
            </div>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="self-start p-1 text-taupe hover:text-ink">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
