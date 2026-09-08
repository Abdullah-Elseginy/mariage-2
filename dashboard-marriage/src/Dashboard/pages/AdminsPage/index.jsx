import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FiSave, FiTrash2, FiUserPlus, FiUsers, FiServer, FiGlobe, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../DashboardLayout';
import { useToast } from '../../../components/ToastProvider';
import { useDocumentTitle } from '../../../utils/useDocumentTitle';
import { adminsApi } from '../../../utils/adminsApi';
import { invitationsApi } from '../../../utils/invitationsApi';
import { eidGreetingsApi } from '../../../utils/eidGreetingsApi';
import { birthdayGreetingsApi } from '../../../utils/birthdayGreetingsApi';
import { getBackendMode, setBackendMode } from '../../../utils/apiConfig';

export default function AdminsPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Synced');
  const [invitationsCount, setInvitationsCount] = useState(0);
  const [eidCount, setEidCount] = useState(0);
  const [birthdayCount, setBirthdayCount] = useState(0);

  const [backendMode, setLocalBackendMode] = useState(getBackendMode());
  const [testingGlobal, setTestingGlobal] = useState(false);
  const [testingLocal, setTestingLocal] = useState(false);

  const testConnection = async (mode) => {
    if (mode === 'global') setTestingGlobal(true);
    else setTestingLocal(true);

    const url = mode === 'local'
      ? 'http://127.0.0.1:8000/api/v1/health'
      : 'https://adequate-blessing-production-4ffe.up.railway.app/api/v1/health';

    try {
      const startTime = performance.now();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`Server responded with HTTP ${response.status}`);
      }
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      toast.success(
        mode === 'local'
          ? `تم الاتصال بالخادم المحلي بنجاح! سرعة الاستجابة: ${latency}ms`
          : `تم الاتصال بالخادم العام بنجاح! سرعة الاستجابة: ${latency}ms`
      );
    } catch (err) {
      console.error(err);
      toast.error(
        mode === 'local'
          ? 'تعذر الاتصال بالخادم المحلي. يرجى التأكد من تشغيل php artisan serve على المنفذ 8000.'
          : 'تعذر الاتصال بالخادم العام. يرجى التحقق من اتصالك بالإنترنت.'
      );
    } finally {
      if (mode === 'global') setTestingGlobal(false);
      else setTestingLocal(false);
    }
  };

  const loadCounts = useCallback(async () => {
    try {
      const invRes = await invitationsApi.list(1);
      setInvitationsCount(invRes.meta?.total || invRes.data?.length || 0);
    } catch {}
    try {
      const eidRes = await eidGreetingsApi.list(1);
      setEidCount(eidRes.meta?.total || eidRes.data?.length || 0);
    } catch {}
    try {
      const birthdayRes = await birthdayGreetingsApi.list(1);
      setBirthdayCount(birthdayRes.meta?.total || birthdayRes.data?.length || 0);
    } catch {}
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  useDocumentTitle('Admin Settings | Marriage Admin');

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminsApi.list();
      setAdmins(response.data || []);
      setStatus('Synced');
    } catch (error) {
      setStatus(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Username and password are required.');
      return;
    }

    setLoading(true);
    setStatus('Creating admin account...');
    try {
      await adminsApi.create({
        username: username.trim(),
        password: password.trim(),
      });
      toast.success('Admin account created successfully!');
      setUsername('');
      setPassword('');
      await loadAdmins();
    } catch (error) {
      setStatus(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (admin.username === 'wil') {
      toast.error('Cannot delete the main admin account (wil).');
      return;
    }
    if (admins.length <= 1) {
      toast.error('Cannot delete the only remaining admin account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete admin "${admin.username}"?`)) {
      return;
    }

    setLoading(true);
    setStatus('Deleting admin...');
    try {
      await adminsApi.remove(admin.id);
      toast.success('Admin account deleted.');
      await loadAdmins();
    } catch (error) {
      setStatus(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Settings | Marriage Admin</title>
      </Helmet>
      <DashboardLayout
        activeView="settings"
        invitationsCount={invitationsCount}
        eidCount={eidCount}
        birthdayCount={birthdayCount}
        onCreate={() => navigate('/invitations/new')}
        onShowCompleted={() => navigate('/completed')}
        onCreateEid={() => navigate('/eid-greetings/new')}
        onCreateBirthday={() => navigate('/birthday-greetings/new')}
        onShowSettings={() => navigate('/settings')}
      >
        <header className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#8a6d2f] dark:text-gold/80">Settings | الإعدادات</p>
            <h1 className="text-4xl font-black text-slate-950 dark:text-white">System Settings | إعدادات النظام</h1>
          </div>
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 dark:border-[#2a3646] dark:bg-[#101923] dark:text-slate-300">
            {status}
          </span>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Server Connection Settings Panel */}
          <section className="col-span-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#253141] dark:bg-[#0b131c] sm:p-6">
            <header className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-2">
                <span className="shrink-0 text-xl text-[#8a6d2f] dark:text-gold"><FiServer /></span>
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">Server Connection Settings | إعدادات اتصال خادم البيانات</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Choose whether the dashboard connects to your local development backend or the global cloud.</p>
                </div>
              </div>
              <span className="self-start sm:self-center rounded-full bg-gold/10 px-3 py-1 text-xs font-black text-[#8a6d2f] dark:text-gold">
                Current Active: {getBackendMode() === 'local' ? 'Local Server (محلي)' : 'Global Production (عام)'}
              </span>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Global Production Card */}
              <article 
                onClick={() => setLocalBackendMode('global')}
                className={`group relative flex flex-col justify-between cursor-pointer rounded-xl border p-4 transition-all duration-300 sm:p-5 ${
                  backendMode === 'global' 
                    ? 'border-gold bg-gold/5 shadow-[0_12px_24px_rgba(214,177,92,0.08)]' 
                    : 'border-slate-200 bg-slate-50/50 hover:border-gold/50 dark:border-white/10 dark:bg-white/[0.02]'
                }`}
              >
                <div className="mobile-wrap-summary flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-lg text-lg transition-colors duration-300 ${
                      backendMode === 'global' ? 'bg-gold/20 text-[#8a6d2f] dark:text-gold' : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                    }`}>
                      <FiGlobe />
                    </span>
                    <div className="min-w-0">
                      <strong className="block text-base font-black text-slate-950 dark:text-white">Global Database | الخادم العام (Railway Cloud)</strong>
                      <span className="mt-0.5 block break-all font-mono text-xs text-slate-400 dark:text-slate-500">adequate-blessing-production-4ffe.up.railway.app</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        قاعدة البيانات المرفوعة على الويب حالياً. استخدم هذا الوضع لتعديل البيانات الفعالة والمنشورة للعملاء.
                      </p>
                    </div>
                  </div>
                  {backendMode === 'global' && (
                    <span className="h-2.5 w-2.5 rounded-full bg-gold animate-pulse mt-1.5" />
                  )}
                </div>

                <div className="mobile-stack-actions mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-400">Production Database</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      testConnection('global');
                    }}
                    disabled={testingGlobal}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 hover:border-gold hover:text-[#8a6d2f] dark:border-[#2a3646] dark:bg-[#101923] dark:text-slate-300 dark:hover:text-gold"
                  >
                    {testingGlobal ? (
                      <span className="flex items-center gap-1">
                        <svg className="animate-spin h-3.5 w-3.5 text-slate-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الفحص...
                      </span>
                    ) : (
                      <>
                        <FiActivity /> Test Connection | فحص الاتصال
                      </>
                    )}
                  </button>
                </div>
              </article>

              {/* Local Development Card */}
              <article 
                onClick={() => setLocalBackendMode('local')}
                className={`group relative flex flex-col justify-between cursor-pointer rounded-xl border p-4 transition-all duration-300 sm:p-5 ${
                  backendMode === 'local' 
                    ? 'border-gold bg-gold/5 shadow-[0_12px_24px_rgba(214,177,92,0.08)]' 
                    : 'border-slate-200 bg-slate-50/50 hover:border-gold/50 dark:border-white/10 dark:bg-white/[0.02]'
                }`}
              >
                <div className="mobile-wrap-summary flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-lg text-lg transition-colors duration-300 ${
                      backendMode === 'local' ? 'bg-gold/20 text-[#8a6d2f] dark:text-gold' : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                    }`}>
                      <FiServer />
                    </span>
                    <div className="min-w-0">
                      <strong className="block text-base font-black text-slate-950 dark:text-white">Local Server | الخادم المحلي (localhost)</strong>
                      <span className="mt-0.5 block break-all font-mono text-xs text-slate-400 dark:text-slate-500">http://127.0.0.1:8000</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        خادم التطوير المحلي على جهازك. استخدم هذا الوضع لتعديل وضبط شكل القوالب وتجربتها محلياً بأمان.
                      </p>
                    </div>
                  </div>
                  {backendMode === 'local' && (
                    <span className="h-2.5 w-2.5 rounded-full bg-gold animate-pulse mt-1.5" />
                  )}
                </div>

                <div className="mobile-stack-actions mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-400">Local Database</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      testConnection('local');
                    }}
                    disabled={testingLocal}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 hover:border-gold hover:text-[#8a6d2f] dark:border-[#2a3646] dark:bg-[#101923] dark:text-slate-300 dark:hover:text-gold"
                  >
                    {testingLocal ? (
                      <span className="flex items-center gap-1">
                        <svg className="animate-spin h-3.5 w-3.5 text-slate-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الفحص...
                      </span>
                    ) : (
                      <>
                        <FiActivity /> Test Connection | فحص الاتصال
                      </>
                    )}
                  </button>
                </div>
              </article>
            </div>

            {/* Save Connection Button */}
            {backendMode !== getBackendMode() && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setBackendMode(backendMode)}
                  className="mobile-full-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#111820] px-6 text-sm font-black text-white transition-all hover:scale-[1.02] hover:bg-[#22303d] dark:bg-gold dark:text-[#111820] dark:hover:bg-[#f0cf83] cursor-pointer"
                >
                  <FiSave /> Save Server Mode | تطبيق وحفظ نوع الخادم
                </button>
              </div>
            )}
          </section>
          {/* Create Admin Panel */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-[#253141] dark:bg-[#0b131c] sm:p-5">
            <header className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/10">
              <span className="text-[#8a6d2f] dark:text-gold text-lg"><FiUserPlus /></span>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Add New Admin</h2>
            </header>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. abdullah"
                  className="w-full min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-gold focus:outline-none dark:border-[#344458] dark:bg-[#0e1721] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-gold focus:outline-none dark:border-[#344458] dark:bg-[#0e1721] dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mobile-full-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#111820] px-5 text-sm font-black text-white transition hover:bg-[#22303d] dark:bg-gold dark:text-[#111820] dark:hover:bg-[#f0cf83] disabled:opacity-50 cursor-pointer"
              >
                <FiSave />
                Save Admin
              </button>
            </form>
          </section>

          {/* Admins List Panel */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-[#253141] dark:bg-[#0b131c] sm:p-5">
            <header className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/10">
              <span className="text-[#8a6d2f] dark:text-gold text-lg"><FiUsers /></span>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Active Admins</h2>
            </header>

            <div className="space-y-3">
              {admins.map((admin) => (
                <article
                  key={admin.id}
                  className="mobile-wrap-summary flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-[#273445] dark:bg-[#101923]"
                >
                  <div>
                    <strong className="block text-base font-black text-slate-950 dark:text-white">
                      {admin.username}
                    </strong>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Created {new Date(admin.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAdmin(admin)}
                    disabled={admin.username === 'wil' || loading}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-rose-400/25 dark:bg-[#0b131c] dark:text-rose-300 dark:hover:border-rose-300 cursor-pointer"
                    title={admin.username === 'wil' ? 'Main admin cannot be deleted' : 'Delete account'}
                  >
                    <FiTrash2 />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </DashboardLayout>
    </>
  );
}
