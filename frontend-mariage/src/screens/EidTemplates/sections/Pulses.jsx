import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiVolume2, FiVolumeX, FiUser, FiMessageSquare } from 'react-icons/fi';
import { CustomInput, CustomBottom } from '../../../components';

const Pulses = ({ pulses, onSendPulse, onToggleMusic, isMusicPlaying, loveCount, lovePulses, isArabic }) => {
  const [senderName, setSenderName] = useState('');
  const [messageText, setMessageText] = useState('');

  if (!pulses || (!pulses.title && !pulses.description && !pulses.button)) return null;

  const handleSend = () => {
    onSendPulse(senderName, messageText);
    setSenderName('');
    setMessageText('');
  };

  return (
    <motion.section
      id="pulses-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="eid-section-stack"
    >
      <div className="eid-pulse-board-card">
        {/* Corner Ornaments */}
        <div className="eid-ornament-corner eid-ornament-top-left" />
        <div className="eid-ornament-corner eid-ornament-top-right" />
        <div className="eid-ornament-corner eid-ornament-bottom-left" />
        <div className="eid-ornament-corner eid-ornament-bottom-right" />

        <div className="text-center">
          <p className="eid-mini-kicker inline-flex justify-center text-sm tracking-widest font-extrabold text-gold">
            <FiHeart className="mr-2 ml-2 text-lg text-gold animate-pulse" /> {pulses.title || (isArabic ? 'لوحة نبضات المحبة' : 'Love pulses board')}
          </p>
          <div className="eid-header-divider" />
          {pulses.description ? (
            <p className="text-[#F7EBD2]/80 text-sm leading-relaxed max-w-md mx-auto mt-2">
              {pulses.description}
            </p>
          ) : null}
        </div>

        {/* Custom Input Fields */}
        <div className="flex flex-col gap-4 mt-6">
          <CustomInput
            name="pulse-sender-name"
            placeholder={isArabic ? 'اسمك الكريم' : 'Your name'}
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            inputClassName="border-gold/30 focus:border-gold bg-[#100E16]/80 text-[#F7EBD2] placeholder:text-[#F7EBD2]/30 text-sm md:text-base py-2.5 rounded-xl transition-all duration-300"
            Icon={FiUser}
          />
          <CustomInput
            name="pulse-sender-message"
            as="textarea"
            rows={2}
            placeholder={isArabic ? 'اكتب تبريكاتك الطيبة للعروسين...' : 'Write your warm blessings...'}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            inputClassName="border-gold/30 focus:border-gold bg-[#100E16]/80 text-[#F7EBD2] placeholder:text-[#F7EBD2]/30 text-sm md:text-base py-2.5 rounded-xl transition-all duration-300"
            Icon={FiMessageSquare}
          />
        </div>

        {/* Action Buttons Stack */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-6 justify-center">
          <CustomBottom
            text={`${pulses.button || (isArabic ? 'أرسل نبضة محبة' : 'Send warm pulse')} (${loveCount})`}
            onClick={handleSend}
            buttonStyles="bg-gradient-to-r from-gold via-[#f0cf83] to-gold text-[#0B0A10] border-none font-bold hover:opacity-95 transition-all duration-300 shadow-[0_0_20px_rgba(214,177,92,0.3)] hover:scale-[1.02]"
            styles="w-full sm:w-1/2"
            rightIcon={<FiHeart className="text-[#0B0A10]" />}
          />
          
          <CustomBottom
            text={isMusicPlaying ? pulses.music_on || (isArabic ? 'إيقاف لحن العيد' : 'Pause Eid melody') : pulses.music_off || (isArabic ? 'تشغيل لحن العيد' : 'Play Eid melody')}
            onClick={onToggleMusic}
            buttonStyles={`bg-[#181320] text-gold border border-gold/30 hover:border-gold hover:bg-[#181320] font-semibold transition-all duration-300 hover:scale-[1.02] ${isMusicPlaying ? 'bg-gold/15 border-gold shadow-[0_0_15px_rgba(214,177,92,0.15)]' : ''}`}
            styles="w-full sm:w-1/2"
            rightIcon={isMusicPlaying ? <FiVolumeX /> : <FiVolume2 />}
          />
        </div>
      </div>

      <div className="eid-log mt-6">
        {lovePulses.length ? lovePulses.map((pulse) => (
          <motion.div 
            key={pulse.id} 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="eid-log-row flex items-center justify-between p-4 bg-[#181320]/65 border border-gold/15 rounded-2xl hover:border-gold/35 transition-all duration-300"
          >
            <time className="text-xs text-gold/70 font-mono">{pulse.timestamp}</time>
            <p className="text-[#F7EBD2] text-sm font-medium flex-1 text-center mx-4">{pulse.message}</p>
            <FiHeart className="text-gold text-lg animate-pulse" />
          </motion.div>
        )) : (
          <div className="p-6 bg-[#181320]/40 border border-dashed border-gold/20 rounded-2xl text-center text-[#F7EBD2]/50 italic text-sm">
            {pulses.empty || (isArabic ? 'لا توجد نبضات بعد. أرسل الأولى.' : 'No pulses yet. Send the first one.')}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Pulses;
