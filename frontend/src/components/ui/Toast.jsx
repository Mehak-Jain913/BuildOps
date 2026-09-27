import React from 'react';
import { useToast } from '../../hooks/useToast';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Global Toast Container component rendering active notification toasts
 */
export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    error: <AlertCircle className="w-4 h-4 text-red-600" />,
    info: <Info className="w-4 h-4 text-blue-600" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white',
    warning: 'border-amber-200 bg-white',
    error: 'border-red-200 bg-white',
    info: 'border-blue-200 bg-white',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-2',
            borders[t.type] || borders.info
          )}
        >
          <div className="mt-0.5 shrink-0">{icons[t.type] || icons.info}</div>
          <div className="flex-1 min-w-0">
            {t.title && <h5 className="text-xs font-bold text-slate-900">{t.title}</h5>}
            {t.message && <p className="text-xs text-slate-600 mt-0.5">{t.message}</p>}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
