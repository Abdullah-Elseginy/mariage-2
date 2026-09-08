import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import "./index.css";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const Gallery = ({ invitation }) => {
  const { t } = useTranslation();
  const galleryCopy = invitation?.gallery || {};
  const galleryImages = useMemo(() => galleryCopy.image_urls || [], [galleryCopy.image_urls]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [openedImage, setOpenedImage] = useState(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const slideStepRef = useRef(1);

  const dragProgress = clamp(dragOffset / slideStepRef.current, -1, 1);

  useEffect(() => {
    if (!openedImage) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpenedImage(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openedImage]);

  const slides = useMemo(
    () =>
      galleryImages.map((src, index) => {
        const rawOffset = index - activeIndex;
        const wrappedOffset =
          rawOffset > galleryImages.length / 2
            ? rawOffset - galleryImages.length
            : rawOffset < -galleryImages.length / 2
              ? rawOffset + galleryImages.length
              : rawOffset;

        const visibleOffset = clamp(wrappedOffset, -2, 2);
        const visualOffset = clamp(visibleOffset + dragProgress, -2, 2);
        const distance = Math.min(Math.abs(visualOffset), 1);
        const isActive = visibleOffset === 0;
        const isAdjacent = Math.abs(visibleOffset) === 1;
        const scale = 1 - distance * 0.28;
        const opacity = 1 - distance * 0.56;
        const brightness = 1 - distance * 0.26;
        const saturation = 1 - distance * 0.24;

        return {
          src,
          index,
          offset: visibleOffset,
          visualOffset,
          scale,
          opacity,
          brightness,
          saturation,
          isActive,
          isAdjacent,
          isVisible: Math.abs(visibleOffset) <= 1 || Math.abs(visualOffset) < 1,
        };
      }),
    [activeIndex, dragProgress, galleryImages]
  );

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % galleryImages.length);
  };

  const handlePointerDown = (event) => {
    isDragging.current = true;
    didDrag.current = false;
    dragStartX.current = event.clientX;
    slideStepRef.current = Math.max(window.innerWidth * 0.64, 1);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging.current) return;

    const nextOffset = clamp(event.clientX - dragStartX.current, -slideStepRef.current, slideStepRef.current);
    didDrag.current = Math.abs(nextOffset) > 6;
    setDragOffset(nextOffset);
  };

  const handlePointerUp = (event) => {
    if (!isDragging.current) return;

    isDragging.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (dragOffset <= -slideStepRef.current * 0.24) {
      goToNext();
    } else if (dragOffset >= slideStepRef.current * 0.24) {
      goToPrevious();
    }

    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    isDragging.current = false;
    setDragOffset(0);
  };

  const handleSlideClick = (index) => {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }

    if (index === activeIndex) {
      setOpenedImage(galleryImages[index]);
      return;
    }

    setActiveIndex(index);
  };

  if (galleryCopy.is_enabled === false) return null;
  if (!galleryImages.length) return null;

  return (
    <div id="gallery" className="py-24 bg-white relative">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blush/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-champagne/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-dark mb-4"
          >
            {galleryCopy.title}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gold mx-auto rounded-full"
          ></motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="gallery-carousel"
        >
          <button
            type="button"
            className="gallery-nav gallery-nav-left"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <FaChevronLeft aria-hidden="true" />
          </button>

          <div
            className={dragOffset ? "gallery-carousel-stage is-dragging" : "gallery-carousel-stage"}
            aria-live="polite"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {slides.map(({
              src,
              index,
              offset,
              visualOffset,
              scale,
              opacity,
              brightness,
              saturation,
              isActive,
              isAdjacent,
              isVisible,
            }) => (
              <button
                key={src}
                type="button"
                className={[
                  "gallery-slide",
                  isActive ? "is-active" : "",
                  isAdjacent ? "is-adjacent" : "",
                  isVisible ? "is-visible" : "",
                ].join(" ")}
                style={{
                  "--slide-offset": offset,
                  "--slide-visual-offset": visualOffset,
                  "--slide-scale": scale,
                  "--slide-opacity": opacity,
                  "--slide-brightness": brightness,
                  "--slide-saturation": saturation,
                  zIndex: isActive ? 3 : isAdjacent ? 2 : 1,
                }}
                onClick={() => handleSlideClick(index)}
                aria-label={t('gallery.image_alt', { number: index + 1 })}
                aria-current={isActive ? "true" : undefined}
                tabIndex={isVisible ? 0 : -1}
              >
                <img
                  src={src}
                  alt={t('gallery.image_alt', { number: index + 1 })}
                  loading={Math.abs(offset) <= 1 ? "eager" : "lazy"}
                  draggable="false"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="gallery-nav gallery-nav-right"
            onClick={goToNext}
            aria-label="Next image"
          >
            <FaChevronRight aria-hidden="true" />
          </button>

          <div className={`gallery-dots ${invitation?.locale === 'ar' ? 'is-rtl' : ''}`} aria-label="Gallery pagination">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {openedImage && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={t('gallery.image_alt', { number: activeIndex + 1 })}
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={() => setOpenedImage(null)}
              aria-label={t('common.close')}
            >
              <FaTimes aria-hidden="true" />
            </button>
            <motion.img
              src={openedImage}
              alt={t('gallery.image_alt', { number: activeIndex + 1 })}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
