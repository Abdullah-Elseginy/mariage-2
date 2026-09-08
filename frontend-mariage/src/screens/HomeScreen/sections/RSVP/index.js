import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useDispatch, useSelector } from 'react-redux';
import { CustomBottom, CustomInput } from '../../../../components';
import { submitInvitationRsvp } from '../../../../store/invitationSlice';

const replaceName = (text, name) => (text || '').replace('{{name}}', name);

const RSVP = ({ invitation, invitationPath }) => {
  const dispatch = useDispatch();
  const { rsvpStatus, rsvpError } = useSelector((state) => state.invitation);
  const copy = invitation?.rsvp || {};
  const pathKey = invitation?.public_path || invitationPath;
  const [formData, setFormData] = useState({ name: '', attending: 'yes', message: '' });
  const [submitted, setSubmitted] = useState(() => localStorage.getItem('rsvp_submitted_' + pathKey) === 'true');
  const [guestNameForThanks, setGuestNameForThanks] = useState(() => localStorage.getItem('rsvp_guest_name_' + pathKey) || '');
  const [attendingForThanks, setAttendingForThanks] = useState(() => localStorage.getItem('rsvp_attending_' + pathKey) || 'yes');

  if (copy.is_enabled === false) return null;
  if (!copy.title || !copy.submit || !copy.yes || !copy.no) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(submitInvitationRsvp({
        invitation_path: invitation?.public_path || invitationPath,
        full_name: formData.name,
        attending: formData.attending === 'yes',
        message: formData.message,
        locale: invitation?.locale || 'en',
      })).unwrap();

      if (formData.attending === 'yes') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F4E1E1', '#F7E7CE', '#D4AF37'],
        });
      }
      localStorage.setItem('rsvp_submitted_' + pathKey, 'true');
      localStorage.setItem('rsvp_guest_name_' + pathKey, formData.name);
      localStorage.setItem('rsvp_attending_' + pathKey, formData.attending);
      setGuestNameForThanks(formData.name);
      setAttendingForThanks(formData.attending);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="rsvp" className="py-20 bg-white relative">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-10">
          <span className="text-gold uppercase tracking-[0.24em] text-sm font-bold">{copy.kicker}</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#F7EBD2] mb-4">{copy.title}</h2>
          <div className="w-16 h-1 bg-gold mx-auto"></div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-[#17101A]/90 p-6 md:p-8 rounded-xl shadow-sm border border-champagne">
          {submitted ? (
            <div className="text-center py-8">
              <h3 className="text-3xl font-serif text-[#F7EBD2] mb-4">{replaceName(copy.thanks, guestNameForThanks.split(' ')[0])}</h3>
              <p className="text-lg text-[#F7EBD2]/70">{attendingForThanks === 'yes' ? copy.yes_reply : copy.no_reply}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 pb-1">
              <CustomInput label={copy.name} name="name" type="text" required placeholder={copy.name_placeholder} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <div>
                <label className="block text-[#F7EBD2] font-medium mb-2">{copy.attending}</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {['yes', 'no'].map((option) => (
                    <label key={option} className="flex-1 cursor-pointer">
                      <input type="radio" name="attending" value={option} className="peer sr-only" checked={formData.attending === option} onChange={(e) => setFormData({ ...formData, attending: e.target.value })} />
                      <div className="min-h-12 flex items-center justify-center text-center px-4 py-3 border border-champagne rounded-lg bg-[#100E16] text-[#F7EBD2]/80 peer-checked:bg-gold peer-checked:text-[#0B0A10] peer-checked:border-gold transition-colors">{copy[option]}</div>
                    </label>
                  ))}
                </div>
              </div>
              <CustomInput as="textarea" label={copy.message} name="message" rows="3" placeholder={copy.message_placeholder} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              {rsvpError ? <p className="text-sm text-rose-200">{rsvpError}</p> : null}
              <CustomBottom type="submit" text={copy.submit} loading={rsvpStatus === 'loading'} disabled={rsvpStatus === 'loading'} buttonStyles="bg-gold text-[#0B0A10] hover:bg-[#F7EBD2] hover:text-[#0B0A10] active:bg-[#C9B56A] active:text-[#0B0A10]" />
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RSVP;
