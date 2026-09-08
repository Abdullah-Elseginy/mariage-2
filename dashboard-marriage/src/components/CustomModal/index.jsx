import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const CustomModal = ({ isOpen, onClose, title, eyebrow, children, footer, headerActions, className = '', contentClassName = '' }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-5">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
      <section className={`dashboard-edit-modal relative flex h-[100dvh] max-h-[100dvh] w-full max-w-6xl flex-col overflow-hidden border border-slate-200 bg-white text-slate-950 shadow-2xl dark:border-[#2b3b4d] dark:bg-[#09121b] dark:text-white sm:h-auto sm:max-h-[calc(100vh-2.5rem)] sm:rounded-lg ${className}`} role="dialog" aria-modal="true" aria-label={title || eyebrow || 'Editor'}>
        <header className="dashboard-modal-header flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-3 py-3 dark:border-white/10 sm:gap-4 sm:px-6 sm:py-4">
          <div className="min-w-0">
            {eyebrow ? <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#8a6d2f]">{eyebrow}</p> : null}
            {title ? <h2 className="text-lg font-black tracking-normal text-slate-950 dark:text-white sm:text-2xl">{title}</h2> : null}
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-gold hover:text-slate-950 dark:border-[#344458] dark:text-slate-300 dark:hover:border-gold dark:hover:text-white" aria-label="Close">
            <FiX />
          </button>
        </header>
        {headerActions ? (
          <div className="dashboard-modal-actions order-2 flex shrink-0 items-center gap-2 border-t border-slate-100 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-[#0b131c] sm:order-none sm:border-b sm:border-t-0 sm:px-6 sm:py-3">
            {headerActions}
          </div>
        ) : null}
        <div className={`dashboard-modal-content order-1 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-3 sm:order-none sm:px-6 sm:py-4 ${contentClassName}`}>{children}</div>
        {footer ? <footer className="border-t border-slate-100 px-3 py-3 dark:border-white/10 sm:px-6 sm:py-4">{footer}</footer> : null}
      </section>
    </div>
  );
};

export default CustomModal;
