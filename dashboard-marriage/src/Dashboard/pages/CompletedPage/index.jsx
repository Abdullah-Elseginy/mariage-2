import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../DashboardLayout';
import InvitationsPage from '../InvitationsPage';
import EidGreetingsPage from '../EidGreetingsPage';
import BirthdayGreetingsPage from '../BirthdayGreetingsPage';
import LoveMessagesPage from '../LoveMessagesPage';
import { invitationsApi } from '../../../utils/invitationsApi';
import { eidGreetingsApi } from '../../../utils/eidGreetingsApi';
import { birthdayGreetingsApi } from '../../../utils/birthdayGreetingsApi';
import { loveMessagesApi } from '../../../utils/loveMessagesApi';

export default function CompletedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invitations'); // 'invitations', 'eid', or 'birthday'
  const [invitationsCount, setInvitationsCount] = useState(0);
  const [eidCount, setEidCount] = useState(0);
  const [birthdayCount, setBirthdayCount] = useState(0);
  const [loveCount, setLoveCount] = useState(0);

  const loadCounts = async () => {
    try {
      const invResponse = await invitationsApi.list(1);
      setInvitationsCount(invResponse.meta?.total || invResponse.data?.length || 0);
    } catch (err) {
      console.error(err);
    }

    try {
      const eidResponse = await eidGreetingsApi.list(1);
      setEidCount(eidResponse.meta?.total || eidResponse.data?.length || 0);
    } catch (err) {
      console.error(err);
    }

    try {
      const birthdayResponse = await birthdayGreetingsApi.list(1);
      setBirthdayCount(birthdayResponse.meta?.total || birthdayResponse.data?.length || 0);
    } catch (err) {
      console.error(err);
    }

    try {
      const loveResponse = await loveMessagesApi.list(1);
      setLoveCount(loveResponse.meta?.total || loveResponse.data?.length || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCounts();
  }, [activeTab]); // reload counts when tab switches

  return (
    <DashboardLayout
      activeView="completed"
      invitationsCount={invitationsCount}
      eidCount={eidCount}
      birthdayCount={birthdayCount}
      loveCount={loveCount}
      onCreate={() => navigate('/invitations/new')}
      onShowCompleted={() => navigate('/completed')}
      onCreateEid={() => navigate('/eid-greetings/new')}
      onCreateBirthday={() => navigate('/birthday-greetings/new')}
      onCreateLove={() => navigate('/love-messages/new')}
      onShowSettings={() => navigate('/settings')}
    >
      <div className="mb-5">
        <h1 className="text-3xl font-black tracking-normal text-slate-950 dark:text-white lg:text-4xl">
          {t('dashboard.sidebar.completed_work', 'Completed templates')}
        </h1>
      </div>

      {(() => {
        const tabs = [
          { id: 'invitations', label: t('dashboard.sidebar.invitations', 'Invitations') },
          { id: 'eid', label: t('dashboard.eid.sidebar', 'Eid Greetings') },
          { id: 'birthday', label: t('dashboard.birthday.sidebar', 'Birthday Greetings') },
          { id: 'love', label: 'Love Messages' },
        ];

        return (
          <div className="mb-6 flex flex-nowrap gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white/70 p-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#0e1721]/50 sm:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-11 min-w-[140px] flex-none rounded-lg px-4 text-xs font-black transition-all duration-300 sm:flex-1 ${
                  activeTab === tab.id
                    ? 'bg-gold text-[#111820] shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.02]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        );
      })()}

      <div className="min-w-0">
        <div className={activeTab === 'invitations' ? 'block' : 'hidden'}>
          <InvitationsPage embedded active={activeTab === 'invitations'} />
        </div>
        <div className={activeTab === 'eid' ? 'block' : 'hidden'}>
          <EidGreetingsPage embedded active={activeTab === 'eid'} />
        </div>
        <div className={activeTab === 'birthday' ? 'block' : 'hidden'}>
          <BirthdayGreetingsPage embedded active={activeTab === 'birthday'} />
        </div>
        <div className={activeTab === 'love' ? 'block' : 'hidden'}>
          <LoveMessagesPage embedded active={activeTab === 'love'} />
        </div>
      </div>
    </DashboardLayout>
  );
}
