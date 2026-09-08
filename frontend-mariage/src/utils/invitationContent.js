import { getBackendUrl } from './apiConfig';

export const CONTENT_LOCALES = ['en', 'ar'];

export const normalizeLocale = (language) => (language?.startsWith('ar') ? 'ar' : 'en');

export const normalizeMediaUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;

  try {
    const backendOrigin = new URL(getBackendUrl()).origin;
    const mediaUrl = new URL(url, backendOrigin);

    if (mediaUrl.pathname.startsWith('/storage/')) {
      return `${backendOrigin}${mediaUrl.pathname}${mediaUrl.search}${mediaUrl.hash}`;
    }
  } catch {
    return url;
  }

  return url;
};

export const normalizeContentMedia = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeContentMedia);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, normalizeContentMedia(child)])
    );
  }

  return typeof value === 'string' ? normalizeMediaUrl(value) : value;
};


export const isLocalizedBucket = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return 'en' in value || 'ar' in value;
};

const hasLocalizedContent = (bucket) => {
  if (!bucket || typeof bucket !== 'object' || Array.isArray(bucket)) return false;
  return Object.values(bucket).some((value) => value != null && value !== '');
};

const resolveLegacySection = (section) => {
  if (!section || typeof section !== 'object') {
    return {};
  }

  return { ...section };
};

export const resolveLocalizedValue = (value, locale) => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (isLocalizedBucket(value)) {
    const lang = normalizeLocale(locale);
    const localized = value[lang] ?? value.en ?? value.ar;
    return localized == null ? '' : String(localized);
  }

  return '';
};

export const resolveSection = (section, locale) => {
  if (!section || typeof section !== 'object') {
    return {};
  }

  if (isLocalizedBucket(section)) {
    const lang = normalizeLocale(locale);
    const bucket = section[lang] ?? section.en ?? section.ar ?? {};

    if (hasLocalizedContent(bucket)) {
      return typeof bucket === 'object' && !Array.isArray(bucket) ? { ...bucket } : {};
    }

    return resolveLegacySection(section.en || section.ar || {});
  }

  return resolveLegacySection(section);
};

const resolveVisibilitySection = (section, locale, defaultEnabled = true) => {
  if (!section || typeof section !== 'object') return {};

  const localized = resolveSection(section, locale);

  return {
    ...localized,
    is_enabled: section.is_enabled ?? localized.is_enabled ?? defaultEnabled,
  };
};

const resolveGallery = (gallery, locale) => {
  if (!gallery || typeof gallery !== 'object') return {};

  const localized = resolveSection(gallery, locale, 'gallery');
  const imageSources = [
    localized.image_urls,
    gallery.image_urls,
    gallery[normalizeLocale(locale)]?.image_urls,
    gallery.en?.image_urls,
    gallery.ar?.image_urls,
  ];
  const imageUrls = (imageSources.find((images) => Array.isArray(images) && images.length > 0) || [])
    .filter(Boolean)
    .map(normalizeMediaUrl);

  return {
    ...localized,
    is_enabled: gallery.is_enabled ?? localized.is_enabled ?? true,
    image_urls: imageUrls,
  };
};

const resolveCountdown = (countdown, locale) => {
  if (!countdown || typeof countdown !== 'object') return {};

  const localized = resolveSection(countdown, locale, 'countdown');

  return {
    ...localized,
    is_enabled: countdown.is_enabled ?? localized.is_enabled ?? true,
    target_date: countdown.target_date ?? localized.target_date,
  };
};

const resolveAudio = (audio, locale) => {
  if (!audio || typeof audio !== 'object') return {};

  if (isLocalizedBucket(audio)) {
    const localized = resolveSection(audio, locale, 'audio');
    return {
      ...localized,
      is_enabled: audio.is_enabled ?? localized.is_enabled ?? true,
      src: normalizeMediaUrl(audio.src ?? localized.src ?? ''),
      volume: audio.volume ?? localized.volume ?? '0.4',
    };
  }

  const localized = resolveLegacySection(audio);

  return {
    ...localized,
    is_enabled: audio.is_enabled ?? localized.is_enabled ?? true,
    src: normalizeMediaUrl(audio.src ?? localized.src ?? ''),
    volume: audio.volume ?? localized.volume ?? '0.4',
  };
};

const resolveEvent = (event, locale) => {
  if (!event || typeof event !== 'object') return {};

  const localized = resolveSection(event, locale, 'event');

  return {
    ...localized,
    is_enabled: event.is_enabled ?? localized.is_enabled ?? true,
    map_url: event.map_url ?? localized.map_url ?? '',
  };
};

const resolvePartyUpload = (partyUpload, locale) => {
  if (!partyUpload || typeof partyUpload !== 'object') return {};

  const localized = resolveSection(partyUpload, locale, 'party_upload');

  return {
    ...localized,
    is_enabled: partyUpload.is_enabled ?? localized.is_enabled ?? false,
  };
};

const resolveRsvp = (rsvp, locale) => {
  if (!rsvp || typeof rsvp !== 'object') return {};

  const localized = resolveSection(rsvp, locale, 'rsvp');

  return {
    ...localized,
    is_enabled: rsvp.is_enabled ?? localized.is_enabled ?? true,
  };
};

export const resolveInvitationContent = (invitation, language) => {
  if (!invitation) return null;

  const locale = normalizeLocale(language);
  const groomName = resolveLocalizedValue(invitation.groom_name, locale);
  const brideName = resolveLocalizedValue(invitation.bride_name, locale);
  const coupleDisplayName = isLocalizedBucket(invitation.couple_display_name)
    ? resolveLocalizedValue(invitation.couple_display_name, locale)
    : invitation.couple_display_name
      || `${groomName} & ${brideName}`.trim();

  return {
    ...invitation,
    groom_name: groomName,
    bride_name: brideName,
    couple_display_name: coupleDisplayName,
    loading: resolveSection(invitation.loading, locale, 'loading'),
    hero: resolveVisibilitySection(invitation.hero, locale),
    event: resolveEvent(invitation.event, locale),
    love_story: resolveVisibilitySection(invitation.love_story, locale),
    gallery: resolveGallery(invitation.gallery, locale),
    countdown: resolveCountdown(invitation.countdown, locale),
    rsvp: resolveRsvp(invitation.rsvp, locale),
    footer: resolveVisibilitySection(invitation.footer, locale),
    audio: resolveAudio(invitation.audio, locale),
    party_upload: resolvePartyUpload(invitation.party_upload, locale),
  };
};
