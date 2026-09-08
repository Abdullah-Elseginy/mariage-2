import React, { useEffect, useState } from 'react';
import { FiHeart, FiMenu } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar';
import '../index.css';

const DashboardLayout = ({ children, activeView, invitationsCount, eidCount, birthdayCount, loveCount, onCreate, onShowCompleted, onCreateEid, onCreateBirthday, onCreateLove, onShowSettings }) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeView]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <main className="dashboard-shell min-h-screen bg-slate-100 font-sans text-slate-950 transition-colors dark:bg-[#070b10] dark:text-slate-50 md:grid md:h-screen md:grid-cols-[16rem_minmax(0,1fr)] md:overflow-hidden xl:grid-cols-[19rem_minmax(0,1fr)]">
      <header className="dashboard-mobile-header sticky top-0 z-40 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#111820]/95 md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gold/35 bg-gold/15 text-[#8a6d2f] dark:text-gold"><FiHeart /></span>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-[#8a6d2f] dark:text-gold/80">{t('dashboard.brand.kicker')}</p>
            <strong className="block truncate text-sm font-black">{t('dashboard.brand.title')}</strong>
          </div>
        </div>
        <button type="button" onClick={() => setMobileMenuOpen(true)} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-xl text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-white" aria-label="Open dashboard navigation" aria-expanded={mobileMenuOpen}>
          <FiMenu />
        </button>
      </header>

      {mobileMenuOpen ? <button type="button" aria-label="Close dashboard navigation" className="fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)} /> : null}

      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} activeView={activeView} invitationsCount={invitationsCount} eidCount={eidCount} birthdayCount={birthdayCount} loveCount={loveCount} onCreate={onCreate} onShowCompleted={onShowCompleted} onCreateEid={onCreateEid} onCreateBirthday={onCreateBirthday} onCreateLove={onCreateLove} onShowSettings={onShowSettings} />
      <section className="dashboard-content min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-5 md:h-screen md:overflow-y-auto lg:px-8 lg:py-7">{children}</section>
    </main>
  );
};

export default DashboardLayout;
