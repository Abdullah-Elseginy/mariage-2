import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const Album = ({
  isArabic,
  albumTitle,
  albumDesc,
  albumPhotos,
  onPhotoClick
}) => {
  const hasPhotos = albumPhotos.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl border border-white/50 bg-white/95 md:bg-gradient-to-br md:from-white/60 md:via-[#fef8f4]/50 md:to-white/40 backdrop-blur-sm group romantic-glow select-none text-slate-800"
    >
      <div className="relative z-20 w-full flex flex-col items-center space-y-8">
        <div className="flex items-center justify-center gap-3 w-full">
          <Camera size={22} className="text-[#6a0109] animate-pulse" />
          <h2 className="font-montserrat text-lg md:text-xl text-[#6a0109] uppercase tracking-widest font-extrabold text-center">
            {albumTitle}
          </h2>
          <Camera size={22} className="text-[#6a0109] animate-pulse" />
        </div>

        <p className="font-sans text-xs md:text-sm text-[#7b5455] font-semibold text-center max-w-lg leading-relaxed px-2">
          {albumDesc}
        </p>

        <div className="w-full relative mt-4">
          {hasPhotos ? (
            <>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 w-full px-2 pb-6 pt-6 hide-scrollbar items-center">
                {albumPhotos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, rotate: index % 2 === 0 ? -4 : 4 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: index % 2 === 0 ? -2 : 2 }}
                    viewport={{ once: true, margin: '-50px' }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="album-photo-frame relative w-44 sm:w-56 aspect-[4/5] snap-center shrink-0 rounded-xl shadow-md cursor-zoom-in group/photo border-2 bg-white p-1.5 flex flex-col sticker-glow"
                    onClick={() => onPhotoClick(photo)}
                  >
                    <div className="w-full h-full rounded-lg overflow-hidden relative border border-neutral-100">
                      <img
                        src={photo}
                        alt={`Memory ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-110"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 mt-1 text-[#7b5455] font-semibold text-[10px] sm:text-xs opacity-80 select-none">
                <span className="animate-bounce-horizontal text-base">←</span>
                <span>{isArabic ? 'مرري للتصفح' : 'Swipe to explore'}</span>
                <span className="animate-bounce-horizontal text-base">→</span>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#c8a99a] bg-[#fffaf7] px-6 py-10 text-center text-sm font-semibold text-[#7b5455]">
              {isArabic ? 'لم يتم رفع صور بعد.' : 'No photos uploaded yet.'}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default Album;
