import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loveMessageAPI } from '../../utils/api';
import { extractApiData, extractApiError } from '../../utils/apiHelpers';
import RouteDataLoader from '../RouteDataLoader';
import HappyMessageTemplate from './templates/HappyMessageTemplate';
import PlatformFooter from '../../components/PlatformFooter';
import { normalizeContentMedia, normalizeLocale } from '../../utils/invitationContent';

const LoveMessages = () => {
  const { loveMessagePath } = useParams();
  const { i18n } = useTranslation();
  const initializedLanguage = useRef(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setStatus('loading');

    loveMessageAPI.getByPath(loveMessagePath)
      .then((response) => {
        if (!active) return;
        setMessage(extractApiData(response));
        setStatus('succeeded');
      })
      .catch((requestError) => {
        if (!active) return;
        setError(extractApiError(requestError, 'Love message not found.'));
        setStatus('failed');
      });

    return () => {
      active = false;
    };
  }, [loveMessagePath]);

  useEffect(() => {
    if (!message?.locale) return;
    if (!initializedLanguage.current) {
      i18n.changeLanguage(message.locale);
      initializedLanguage.current = true;
    }
  }, [i18n, message?.locale]);

  const activeLocale = normalizeLocale(i18n.resolvedLanguage || i18n.language || message?.locale);

  useEffect(() => {
    document.documentElement.lang = activeLocale;
    document.documentElement.dir = activeLocale === 'ar' ? 'rtl' : 'ltr';
  }, [activeLocale]);

  const normalizedMessage = useMemo(() => message ? ({
    ...message,
    content: normalizeContentMedia(message.content || {}),
  }) : null, [message]);

  if (status === 'loading') return <RouteDataLoader />;
  if (status === 'failed' || !message) return <RouteDataLoader error={error} />;

  const template = normalizedMessage.template || 'happy-message';

  if (template === 'happy-message') {
    return (
      <div className="wil-font-theme" data-font-family={normalizedMessage.font_family || 'elegant'} dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}>
        <HappyMessageTemplate message={normalizedMessage} />
        <PlatformFooter locale={activeLocale} theme="love-message" />
      </div>
    );
  }

  return (
    <>
      <HappyMessageTemplate message={normalizedMessage} />
      <PlatformFooter locale={activeLocale} theme="love-message" />
    </>
  );
};

export default LoveMessages;
