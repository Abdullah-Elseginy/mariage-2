import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiUsers, FiImage, FiCopy, FiCheck, FiHeart, 
  FiExternalLink, FiX, FiDownload, FiLock, FiUnlock, FiEye, FiEyeOff, FiLogOut, FiTrash2, FiGlobe
} from 'react-icons/fi';
import JSZip from 'jszip';
import { invitationAPI } from '../../utils/api';
import { normalizeMediaUrl } from '../../utils/invitationContent';
import { Pagination, ConfirmationDialog } from '../../components';
import './index.css';

const OrganizerDashboard = () => {
  const { invitationPath } = useParams();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const labels = isRtl ? {
    loginTitle: '\u0644\u0648\u062d\u0629 \u062a\u0646\u0638\u064a\u0645 \u0627\u0644\u062d\u0641\u0644',
    loginSubtitle: '\u0623\u062f\u062e\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0631\u062f\u0648\u062f \u0627\u0644\u062d\u0636\u0648\u0631 \u0648\u0627\u0644\u0635\u0648\u0631',
    username: '\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645', password: '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
    access: '\u062f\u062e\u0648\u0644 \u0644\u0644\u0644\u0648\u062d\u0629', authenticating: '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0642\u0642...',
    language: 'English', copyLink: '\u0646\u0633\u062e \u0631\u0627\u0628\u0637 \u0627\u0644\u062f\u0639\u0648\u0629', copied: '\u062a\u0645 \u0627\u0644\u0646\u0633\u062e', view: '\u0639\u0631\u0636 \u0627\u0644\u062f\u0639\u0648\u0629',
    total: '\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0631\u062f\u0648\u062f', attending: '\u0633\u064a\u062d\u0636\u0631', notAttending: '\u0644\u0646 \u064a\u062d\u0636\u0631', partyPhotos: '\u0635\u0648\u0631 \u0627\u0644\u062d\u0641\u0644',
    all: '\u0643\u0644 \u0627\u0644\u0631\u062f\u0648\u062f', back: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u062f\u0639\u0648\u0629', submitted: '\u062a\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644'
  } : {
    loginTitle: 'Organizer dashboard', loginSubtitle: 'Sign in to manage invitations, guests and shared moments.', username: 'Username', password: 'Password', access: 'Enter dashboard', authenticating: 'Checking access...', language: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', copyLink: 'Copy invitation link', copied: 'Copied', view: 'View invitation', total: 'Total RSVPs', attending: 'Attending', notAttending: 'Not attending', partyPhotos: 'Party photos', all: 'All responses', back: 'Back to invitation', submitted: 'Submitted'
  };
  const toggleLanguage = () => i18n.changeLanguage(isRtl ? 'en' : 'ar');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('rsvps'); // rsvps, photos
  const [selectedPhoto, setSelectedPhoto] = useState(null); // for lightbox
  const [copied, setCopied] = useState(false);
  const [rsvpFilter, setRsvpFilter] = useState('all'); // all, attending, not_attending

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: null,
    loading: false
  });

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const showConfirmDialog = ({ title, message, confirmText, onConfirm }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm,
      loading: false
    });
  };

  const executeConfirmAction = async () => {
    setConfirmDialog((prev) => ({ ...prev, loading: true }));
    try {
      await confirmDialog.onConfirm();
      closeConfirmDialog();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Action failed.');
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  // Credentials and Authentication
  const [credentials, setCredentials] = useState(() => {
    try {
      const stored = sessionStorage.getItem(`organizer_credentials_${invitationPath}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Pagination states
  const [rsvpPage, setRsvpPage] = useState(1);
  const [photosPage, setPhotosPage] = useState(1);
  const rsvpPageSize = 10;
  const photosPageSize = 12;

  // Downloading states
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadingSingle, setDownloadingSingle] = useState({});

  const downloadBlob = (blob, filename) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  };

  const photoFilename = (photo, blob, index = null) => {
    let ext = 'jpg';
    if (blob.type === 'image/png') ext = 'png';
    else if (blob.type === 'image/webp') ext = 'webp';
    else if (blob.type === 'image/gif') ext = 'gif';

    const guestName = photo.guest_name
      ? photo.guest_name.replace(/[^a-zA-Z0-9]/g, '_')
      : 'guest';
    const prefix = index === null ? `photo_${photo.id}` : String(index + 1);
    return `${prefix}_${guestName}.${ext}`;
  };

  const fetchData = async (authCreds) => {
    setLoading(true);
    setError('');
    try {
      const response = await invitationAPI.getOrganizerData(invitationPath, authCreds);
      setData(response.data.data);
      setIsAuthenticated(true);
      if (authCreds) {
        sessionStorage.setItem(`organizer_credentials_${invitationPath}`, JSON.stringify(authCreds));
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem(`organizer_credentials_${invitationPath}`);
      } else {
        setError(err.response?.data?.message || 'Failed to load organizer dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invitationPath) {
      if (credentials) {
        fetchData(credentials);
      } else {
        setLoading(false); // No credentials saved, display login form immediately
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationPath]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const creds = { username: loginUsername.trim(), password: loginPassword.trim() };
    try {
      const response = await invitationAPI.getOrganizerData(invitationPath, creds);
      setData(response.data.data);
      setCredentials(creds);
      setIsAuthenticated(true);
      sessionStorage.setItem(`organizer_credentials_${invitationPath}`, JSON.stringify(creds));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setLoginError(t('organizer.invalid_credentials', 'Invalid username or password.'));
      } else {
        setLoginError(err.response?.data?.message || 'Failed to authenticate.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(`organizer_credentials_${invitationPath}`);
    setCredentials(null);
    setIsAuthenticated(false);
    setData(null);
  };

  const handleCopyLink = () => {
    const invitationLink = `${window.location.origin}/${invitationPath}`;
    navigator.clipboard?.writeText(invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRsvpFilterChange = (filter) => {
    setRsvpFilter(filter);
    setRsvpPage(1);
  };

  const handleDeleteRsvp = (rsvpId) => {
    showConfirmDialog({
      title: t('organizer.delete_rsvp_title', 'Delete RSVP'),
      message: t('organizer.confirm_delete_rsvp', 'Are you sure you want to delete this RSVP response?'),
      confirmText: t('organizer.delete', 'Delete'),
      onConfirm: async () => {
        await invitationAPI.deleteRsvp(invitationPath, rsvpId, credentials);
        setData((prev) => ({
          ...prev,
          rsvps: prev.rsvps.filter((r) => r.id !== rsvpId)
        }));
      }
    });
  };

  const handleDeleteAllRsvps = () => {
    showConfirmDialog({
      title: t('organizer.delete_all_rsvps_title', 'Delete All RSVPs'),
      message: t('organizer.confirm_delete_all_rsvps', 'WARNING: Are you sure you want to delete ALL RSVP responses? This cannot be undone.'),
      confirmText: t('organizer.delete_all', 'Delete All'),
      onConfirm: async () => {
        await invitationAPI.deleteAllRsvps(invitationPath, credentials);
        setData((prev) => ({
          ...prev,
          rsvps: []
        }));
      }
    });
  };

  const handleDeletePhoto = (photoId, e) => {
    if (e) e.stopPropagation();
    showConfirmDialog({
      title: t('organizer.delete_photo_title', 'Delete Photo'),
      message: t('organizer.confirm_delete_photo', 'Are you sure you want to delete this photo?'),
      confirmText: t('organizer.delete', 'Delete'),
      onConfirm: async () => {
        await invitationAPI.deletePhoto(invitationPath, photoId, credentials);
        setData((prev) => ({
          ...prev,
          guest_photos: prev.guest_photos.filter((p) => p.id !== photoId)
        }));
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto(null);
        }
      }
    });
  };

  const handleDeleteAllPhotos = () => {
    showConfirmDialog({
      title: t('organizer.delete_all_photos_title', 'Delete All Photos'),
      message: t('organizer.confirm_delete_all_photos', 'WARNING: Are you sure you want to delete ALL guest photos? This cannot be undone.'),
      confirmText: t('organizer.delete_all', 'Delete All'),
      onConfirm: async () => {
        await invitationAPI.deleteAllPhotos(invitationPath, credentials);
        setData((prev) => ({
          ...prev,
          guest_photos: []
        }));
        setSelectedPhoto(null);
      }
    });
  };

  const handleDownloadSingle = async (photo, e) => {
    if (e) e.stopPropagation(); // prevent modal opening
    const photoId = photo.id;
    setDownloadingSingle((prev) => ({ ...prev, [photoId]: true }));
    try {
      const response = await invitationAPI.downloadGuestPhoto(invitationPath, photoId, credentials);
      const blob = response.data;
      downloadBlob(blob, photoFilename(photo, blob));
    } catch (err) {
      console.error('Failed to download image:', err);
      alert(t('organizer.download_failed', 'Failed to download this photo. Please try again.'));
    } finally {
      setDownloadingSingle((prev) => ({ ...prev, [photoId]: false }));
    }
  };

  const handleDownloadAll = async () => {
    if (!guest_photos || guest_photos.length === 0) return;
    setDownloadingAll(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("guest_photos");
      
      const downloadPromises = guest_photos.map(async (photo, index) => {
        const response = await invitationAPI.downloadGuestPhoto(invitationPath, photo.id, credentials);
        const blob = response.data;
        folder.file(photoFilename(photo, blob, index), blob);
      });
      
      await Promise.all(downloadPromises);
      
      const content = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
      const filename = `${invitationPath}_guest_photos.zip`;
      downloadBlob(content, filename);
    } catch (err) {
      console.error('Failed to create zip file:', err);
      alert(t('organizer.zip_failed', 'Failed to generate ZIP file. Please try again.'));
    } finally {
      setDownloadingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0B13] text-[#F7EBD2] flex flex-col items-center justify-center p-6">
        <svg className="animate-spin h-10 w-10 text-gold mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-medium tracking-widest uppercase text-gold/80">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0E0B13] text-[#F7EBD2] flex flex-col items-center justify-center p-6 text-center">
        <FiX className="text-6xl text-rose-500 mb-4" />
        <h2 className="text-2xl font-serif mb-2">Error Loading Dashboard</h2>
        <p className="text-[#F7EBD2]/70 max-w-md mb-6">{error}</p>
        <Link to="/" className="px-6 py-2.5 bg-gold text-[#0B0A10] font-black rounded-lg transition hover:bg-[#F7EBD2]">
          Go Home
        </Link>
      </div>
    );
  }

  // Render Login Card if not authenticated
  if (!isAuthenticated || !data) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="organizer-page organizer-login-shell min-h-screen bg-[#0E0B13] text-[#F7EBD2] flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

        <div className="organizer-login-card w-full max-w-md bg-[#181320]/80 border border-gold/15 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FiLock className="text-3xl text-gold" />
            </div>
            <h1 className="text-2xl font-serif text-[#F7EBD2] mb-2">
              {labels.loginTitle}
            </h1>
            <p className="text-xs text-[#F7EBD2]/60 tracking-wider">
              {labels.loginSubtitle}
            </p>
          </div>

          <button type="button" onClick={toggleLanguage} className="organizer-language-toggle"><FiGlobe /> {labels.language}</button>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gold/80 mb-2">
                {labels.username}
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder={labels.username}
                className="w-full min-h-11 bg-[#0e0b13] border border-gold/20 rounded-lg px-4 py-2 text-sm text-[#F7EBD2] transition focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gold/80 mb-2">
                {labels.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-11 bg-[#0e0b13] border border-gold/20 rounded-lg pl-4 pr-10 py-2 text-sm text-[#F7EBD2] transition focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F7EBD2]/50 hover:text-gold transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-bold text-center mt-1">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full min-h-11 bg-gold text-[#0b0a10] font-black rounded-lg tracking-wider transition hover:bg-[#F7EBD2] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#0b0a10]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {labels.authenticating}
                </>
              ) : (
                <>
                  <FiUnlock />
                  {labels.access}
                </>
              )}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <Link
              to={`/${invitationPath}`}
              className="text-xs font-bold text-gold/60 hover:text-gold transition-colors inline-flex items-center gap-1"
            >
              <FiArrowLeft className="text-[10px]" />
              {labels.back}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { invitation, rsvps = [], guest_photos = [] } = data;
  const groomName = invitation.groom_name?.en || invitation.groom_name || '';
  const brideName = invitation.bride_name?.en || invitation.bride_name || '';
  const coupleName = invitation.couple_display_name?.en || invitation.couple_display_name || `${groomName} & ${brideName}`;

  const attendingCount = rsvps.filter((r) => r.attending).length;
  const notAttendingCount = rsvps.length - attendingCount;

  const filteredRsvps = rsvps.filter((rsvp) => {
    if (rsvpFilter === 'attending') return rsvp.attending;
    if (rsvpFilter === 'not_attending') return !rsvp.attending;
    return true;
  });

  // RSVP Slicing
  const totalRsvpPages = Math.ceil(filteredRsvps.length / rsvpPageSize);
  const paginatedRsvps = filteredRsvps.slice(
    (rsvpPage - 1) * rsvpPageSize,
    rsvpPage * rsvpPageSize
  );

  // Photos Slicing
  const totalPhotosPages = Math.ceil(guest_photos.length / photosPageSize);
  const paginatedPhotos = guest_photos.slice(
    (photosPage - 1) * photosPageSize,
    photosPage * photosPageSize
  );

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="organizer-page organizer-dashboard-shell min-h-screen bg-[#0E0B13] text-[#F7EBD2] font-sans pb-16">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden border-b border-gold/15 bg-radial-gradient from-[#2d1b32]/35 to-[#120c15] py-10 md:py-16">
        <div className="container mx-auto px-6 max-w-6xl relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Link
                to={`/${invitationPath}`}
                className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gold hover:text-[#F7EBD2] transition-colors`}
              >
                <FiArrowLeft className={isRtl ? 'rotate-180' : ''} />
                {t('organizer.back_to_invitation')}
              </Link>
              <span className="h-4 w-px bg-gold/30"></span>
              <span className="text-xs text-gold/80 px-2 py-0.5 border border-gold/20 rounded bg-gold/5">
                {invitation.template ? invitation.template.toUpperCase() : 'CLASSIC'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-[#F7EBD2] mb-1">
              {coupleName}
            </h1>
            <p className="text-sm text-[#F7EBD2]/60 tracking-wider">
              {t('organizer.title')}
            </p>
          </div>

          <div className="organizer-header-actions flex flex-wrap gap-3">
            <button type="button" onClick={toggleLanguage} className="organizer-language-toggle"><FiGlobe /> {labels.language}</button>
            <button
              onClick={handleCopyLink}
              className="inline-flex min-h-11 items-center gap-2 px-4 rounded-lg bg-[#191520] border border-gold/30 text-gold font-bold text-sm transition hover:bg-gold hover:text-[#0b0a10]"
            >
              {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
              {copied ? labels.copied : labels.copyLink}
            </button>
            <Link
              to={`/${invitationPath}`}
              className="inline-flex min-h-11 items-center gap-2 px-4 rounded-lg bg-gold text-[#0b0a10] font-black text-sm transition hover:bg-[#F7EBD2]"
            >
              <FiExternalLink />
              {labels.view}
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex min-h-11 items-center gap-2 px-4 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 font-bold text-sm transition hover:bg-rose-900 hover:text-white cursor-pointer"
            >
              <FiLogOut />
              {t('organizer.logout', 'Logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 max-w-6xl mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#181320] border border-gold/10 p-4 rounded-xl text-center">
            <span className="block text-xs font-black tracking-widest text-[#F7EBD2]/50 uppercase mb-1">{labels.total}</span>
            <strong className="text-3xl font-serif text-gold">{rsvps.length}</strong>
          </div>
          <div className="bg-[#181320] border border-gold/10 p-4 rounded-xl text-center">
            <span className="block text-xs font-black tracking-widest text-[#F7EBD2]/50 uppercase mb-1">{labels.attending}</span>
            <strong className="text-3xl font-serif text-emerald-400">{attendingCount}</strong>
          </div>
          <div className="bg-[#181320] border border-gold/10 p-4 rounded-xl text-center">
            <span className="block text-xs font-black tracking-widest text-[#F7EBD2]/50 uppercase mb-1">{labels.notAttending}</span>
            <strong className="text-3xl font-serif text-rose-400">{notAttendingCount}</strong>
          </div>
          <div className="bg-[#181320] border border-gold/10 p-4 rounded-xl text-center">
            <span className="block text-xs font-black tracking-widest text-[#F7EBD2]/50 uppercase mb-1">{labels.partyPhotos}</span>
            <strong className="text-3xl font-serif text-purple-400">{guest_photos.length}</strong>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gold/15 mb-6">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-sm font-black tracking-wider uppercase transition-colors cursor-pointer ${activeTab === 'rsvps' ? 'border-gold text-gold bg-gold/5' : 'border-transparent text-[#F7EBD2]/60 hover:text-gold'}`}
          >
            <FiUsers />
            {t('organizer.rsvps_tab', { count: rsvps.length })}
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-sm font-black tracking-wider uppercase transition-colors cursor-pointer ${activeTab === 'photos' ? 'border-gold text-gold bg-gold/5' : 'border-transparent text-[#F7EBD2]/60 hover:text-gold'}`}
          >
            <FiImage />
            {t('organizer.photos_tab', { count: guest_photos.length })}
          </button>
        </div>

        {/* Tab Panel Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'rsvps' ? (
            <motion.div
              key="rsvps-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filter Controls & Delete All */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: labels.all },
                    { id: 'attending', label: labels.attending },
                    { id: 'not_attending', label: labels.notAttending },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleRsvpFilterChange(btn.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${rsvpFilter === btn.id ? 'bg-gold text-[#0B0A10]' : 'bg-[#181320] text-[#F7EBD2]/70 hover:bg-[#201b2a] border border-gold/10'}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {data.is_admin && filteredRsvps.length > 0 && (
                  <button
                    onClick={handleDeleteAllRsvps}
                    className="inline-flex min-h-10 items-center justify-center gap-2 px-4 rounded-lg bg-rose-950/45 border border-rose-500/30 text-rose-300 font-bold text-xs transition hover:bg-rose-900 hover:text-white cursor-pointer shadow-md w-fit"
                  >
                    <FiTrash2 />
                    {t('organizer.delete_all_rsvps', 'Delete All RSVPs')}
                  </button>
                )}
              </div>

              {paginatedRsvps.length === 0 ? (
                <div className="bg-[#181320] border border-gold/10 rounded-xl p-12 text-center text-[#F7EBD2]/50">
                  <FiUsers className="text-4xl text-gold/30 mx-auto mb-3" />
                  <p>{t('organizer.no_rsvps')}</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    {paginatedRsvps.map((rsvp) => (
                      <motion.div
                        layout
                        key={rsvp.id}
                        className="bg-[#181320] border border-gold/10 p-5 rounded-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <strong className="text-lg font-serif text-[#F7EBD2] flex items-center gap-2">
                              {rsvp.full_name}
                              <span className="text-xs text-[#F7EBD2]/40 font-sans font-normal">
                                ({rsvp.locale === 'ar' ? 'العربية' : 'English'})
                              </span>
                            </strong>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${rsvp.attending ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'}`}
                              >
                                {rsvp.attending ? t('organizer.status_attending') : t('organizer.status_not_attending')}
                              </span>
                              {data.is_admin && (
                                <button
                                  onClick={() => handleDeleteRsvp(rsvp.id)}
                                  className="p-1.5 text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                                  title="Delete RSVP"
                                >
                                  <FiTrash2 className="text-sm" />
                                </button>
                              )}
                            </div>
                          </div>

                          {rsvp.message && (
                            <div className="bg-[#0e0b13]/60 border-l-2 border-gold/40 px-3 py-2 my-3 text-sm italic text-[#F7EBD2]/80 font-serif leading-relaxed">
                              "{rsvp.message}"
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#F7EBD2]/40 mt-2">
                          <FiHeart className="text-gold/60" />
                          <span>{labels.submitted} {new Date(rsvp.created_at || rsvp.updated_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Pagination 
                    currentPage={rsvpPage} 
                    totalPages={totalRsvpPages} 
                    onPageChange={setRsvpPage} 
                  />
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="photos-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header inside photos panel */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-serif text-gold">
                  {t('organizer.guest_photos_title', 'Guest Uploads')}
                </h3>
                {guest_photos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.is_admin && (
                      <button
                        onClick={handleDeleteAllPhotos}
                        className="inline-flex min-h-11 items-center gap-2 px-4 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 font-bold text-sm transition hover:bg-rose-900 hover:text-white cursor-pointer shadow-md"
                      >
                        <FiTrash2 />
                        {t('organizer.delete_all_photos', 'Delete All Photos')}
                      </button>
                    )}
                    <button
                      onClick={handleDownloadAll}
                      disabled={downloadingAll}
                      className="inline-flex min-h-11 items-center gap-2 px-4 rounded-lg bg-gold text-[#0b0a10] font-black text-sm transition hover:bg-[#F7EBD2] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer"
                    >
                      {downloadingAll ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-[#0b0a10]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('organizer.zipping', 'Zipping...')}
                        </>
                      ) : (
                        <>
                          <FiDownload />
                          {t('organizer.download_all', 'Download All Photos')}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {paginatedPhotos.length === 0 ? (
                <div className="bg-[#181320] border border-gold/10 rounded-xl p-12 text-center text-[#F7EBD2]/50">
                  <FiImage className="text-4xl text-gold/30 mx-auto mb-3" />
                  <p>{t('organizer.no_photos')}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedPhotos.map((photo, index) => (
                      <motion.div
                        layout
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-gold/10 bg-[#181320] cursor-pointer shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={normalizeMediaUrl(photo.image_url)}
                          alt={`Party moment by ${photo.guest_name || 'Guest'}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300?text=Broken+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                          <div className="flex justify-between items-end gap-2">
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-black tracking-wide text-gold">
                                {photo.guest_name
                                  ? t('organizer.upload_by', { name: photo.guest_name })
                                  : t('organizer.upload_anonymous')}
                              </span>
                              <span className="text-[10px] text-[#F7EBD2]/50 mt-0.5">
                                {new Date(photo.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-1.5">
                              {data.is_admin && (
                                <button
                                  onClick={(e) => handleDeletePhoto(photo.id, e)}
                                  className="p-2 bg-rose-950/80 border border-rose-500/30 text-rose-300 rounded-lg transition hover:bg-rose-900 hover:text-white cursor-pointer"
                                  title={t('organizer.delete_photo', 'Delete Photo')}
                                >
                                  <FiTrash2 />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDownloadSingle(photo, e)}
                                disabled={downloadingSingle[photo.id]}
                                className="p-2 bg-gold text-[#0b0a10] rounded-lg transition hover:bg-[#F7EBD2] disabled:opacity-50 cursor-pointer"
                                title={t('organizer.download_photo', 'Download Photo')}
                              >
                                {downloadingSingle[photo.id] ? (
                                  <svg className="animate-spin h-4 w-4 text-[#0b0a10]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <FiDownload />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Pagination 
                    currentPage={photosPage} 
                    totalPages={totalPhotosPages} 
                    onPageChange={setPhotosPage} 
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-3xl p-2 bg-black/45 rounded-full hover:bg-black/80 transition-colors cursor-pointer"
              aria-label="Close lightbox"
            >
              <FiX />
            </button>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[70vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={normalizeMediaUrl(selectedPhoto.image_url)}
                alt={`Uploaded by ${selectedPhoto.guest_name || 'Guest'}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-gold/15"
              />
            </motion.div>

            <div
              className="mt-4 text-center max-w-md bg-black/60 px-6 py-3 rounded-xl border border-gold/10 backdrop-blur-md flex flex-col items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="text-lg font-serif text-[#F7EBD2]">
                  {selectedPhoto.guest_name
                    ? t('organizer.upload_by', { name: selectedPhoto.guest_name })
                    : t('organizer.upload_anonymous')}
                </p>
                <p className="text-xs text-[#F7EBD2]/50 mt-1">
                  {new Date(selectedPhoto.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                {data.is_admin && (
                  <button
                    onClick={(e) => handleDeletePhoto(selectedPhoto.id, e)}
                    className="mt-1 inline-flex items-center gap-2 px-4 py-2 bg-rose-950/80 border border-rose-500/30 text-rose-300 font-bold rounded-lg transition hover:bg-rose-900 hover:text-white cursor-pointer text-sm"
                  >
                    <FiTrash2 />
                    {t('organizer.delete_photo', 'Delete Photo')}
                  </button>
                )}
                <button
                  onClick={(e) => handleDownloadSingle(selectedPhoto, e)}
                  disabled={downloadingSingle[selectedPhoto.id]}
                  className="mt-1 inline-flex items-center gap-2 px-4 py-2 bg-gold text-[#0b0a10] font-black rounded-lg transition hover:bg-[#F7EBD2] disabled:opacity-50 text-sm cursor-pointer"
                >
                  {downloadingSingle[selectedPhoto.id] ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-[#0b0a10]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('organizer.zipping', 'Downloading...')}
                    </>
                  ) : (
                    <>
                      <FiDownload />
                      {t('organizer.download_photo', 'Download Photo')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={executeConfirmAction}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={t('common.cancel', 'Cancel')}
        confirmLoading={confirmDialog.loading}
        icon={<FiTrash2 size={32} />}
        stripeColorClass="bg-rose-500"
        iconBgColorClass="bg-rose-500/10"
        iconTextColorClass="text-rose-500"
        iconRingColorClass="ring-rose-500/5"
      />
    </div>
  );
};

export default OrganizerDashboard;
