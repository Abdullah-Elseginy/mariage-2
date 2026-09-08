import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const toneClasses = {
  error: 'border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-400/30 dark:bg-rose-950 dark:text-rose-50',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-50',
  info: 'border-slate-200 bg-white text-slate-950 dark:border-[#344458] dark:bg-[#101923] dark:text-white',
};

const icons = {
  error: FiAlertCircle,
  success: FiCheckCircle,
  info: FiInfo,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((message, type = 'info') => {
    const id = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const toast = { id, message, type };
    setToasts((current) => [...current.slice(-3), toast]);
    window.setTimeout(() => dismiss(id), type === 'error' ? 7000 : 4500);
  }, [dismiss]);

  const value = useMemo(() => ({
    show,
    success: (message) => show(message, 'success'),
    error: (message) => show(message, 'error'),
    info: (message) => show(message, 'info'),
  }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed right-4 top-4 z-[10000] grid w-[min(420px,calc(100vw-2rem))] gap-3">
          {toasts.map((toast) => {
            const Icon = icons[toast.type] || FiInfo;

            return (
              <div key={toast.id} className={`pointer-events-auto grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-lg border p-4 text-sm font-bold shadow-[0_18px_48px_rgba(15,23,42,0.18)] ${toneClasses[toast.type] || toneClasses.info}`}>
                <Icon className="mt-0.5 text-lg" />
                <p className="leading-6">{toast.message}</p>
                <button type="button" onClick={() => dismiss(toast.id)} className="grid h-7 w-7 place-items-center rounded-md transition hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close notification">
                  <FiX />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}
