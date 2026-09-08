import React from 'react';
import { FiCheck } from 'react-icons/fi';
import birthTemplate1 from '../../../assets/images/birthTemplate1.png';
import birthTemplate2 from '../../../assets/images/birthTemplate2.png';
import id9Preview from '../../../assets/images/id9.png';

// ── Template definitions ──────────────────────────────────────────────────────
export const birthdayTemplateOptions = [
  {
    globalId: 8,
    id: 'default',
    image: birthTemplate1,
    label: 'Classic Romantic',
    description: 'A warm, romantic design with soft rose tones, polaroid photos, love letters, and a heartfelt countdown. Perfect for intimate birthday celebrations.',
    palette: ['#fef8f4', '#6a0109', '#e9c349', '#dfbfbc'],
    emoji: '🌹',
    badge: 'Romantic',
  },
  {
    globalId: 9,
    id: 'romantic',
    image: id9Preview,
    label: 'Love & Velvet',
    description: 'A premium crimson velvet design with classic gold filigrees, floating rose petals, a golden padlock gate, and vintage love letter parchment scrolls. Pure romance.',
    palette: ['#3a0412', '#e5c158', '#ff9a9e', '#fff5f7'],
    emoji: '💖',
    badge: 'Velvet',
  },
  {
    globalId: 10,
    id: 'neon',
    image: birthTemplate2,
    label: 'Neon Galaxy',
    description: 'A modern dark neon design with aurora backgrounds, glitch text, glowing countdown digits, and cinematic particle effects. Bold and unforgettable.',
    palette: ['#05070f', '#00f5ff', '#8b5cf6', '#f472b6'],
    emoji: '✨',
    badge: 'Modern',
  },
];

const BirthdayTemplatePicker = ({ value, onChange }) => {
  const selected = value || 'default';

  return (
    <div className="col-span-full">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        Birthday Template
      </p>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Choose the visual theme for this birthday greeting. Each template has a unique design language and animation style.
      </p>

      <div role="radiogroup" aria-label="Birthday Template" className="grid gap-4 sm:grid-cols-2">
        {birthdayTemplateOptions.map((template) => {
          const isSelected = selected === template.id;

          return (
            <button
              key={template.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(template.id)}
              className={`group relative overflow-hidden rounded-2xl border text-start transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b131c] ${
                isSelected
                  ? 'border-[#b49344] bg-white shadow-[0_20px_50px_rgba(180,147,68,0.22)] ring-2 ring-[#D6B15C]/55 dark:border-gold dark:bg-[#0e1721] dark:shadow-[0_24px_60px_rgba(214,177,92,0.18)]'
                  : 'border-slate-200/90 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-[#d4bc7a] hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)] dark:border-[#2a3646] dark:bg-[#0e1721] dark:shadow-[0_18px_44px_rgba(0,0,0,0.28)] dark:hover:border-gold/70'
              }`}
            >
              {/* Image visual preview */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#15202b]">
                <img
                  src={template.image}
                  alt={template.label}
                  className={`h-full w-full object-cover object-top transition duration-500 ${
                    isSelected ? 'scale-[1.02]' : 'scale-100 group-hover:scale-[1.03]'
                  }`}
                  draggable={false}
                />

                {/* Gradient overlay */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b131c]/80 via-[#0b131c]/10 to-transparent transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                  }`}
                />

                {/* Selection checkmark */}
                <span
                  className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition duration-300 ${
                    isSelected
                      ? 'border-[#f0cf83] bg-[#D6B15C] text-[#111820] shadow-[0_8px_24px_rgba(214,177,92,0.45)]'
                      : 'border-white/25 bg-black/35 text-white/70 opacity-0 group-hover:opacity-100'
                  } ${isSelected ? 'opacity-100' : ''}`}
                  aria-hidden="true"
                >
                  <FiCheck className="text-lg" strokeWidth={3} />
                </span>

                {/* Color swatches */}
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {template.palette.map((color, ci) => (
                    <div
                      key={ci}
                      className="w-4 h-4 rounded-full border-2 border-white/30 shadow"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Text content */}
              <div className="relative px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a6d2f] dark:text-gold">
                      {isSelected ? 'Selected' : 'Preview'}
                    </p>
                    <h3 className="mt-1 text-lg font-black tracking-tight text-slate-950 dark:text-white">
                    {template.emoji} {template.label}
                    <span className="ms-2 inline-flex rounded-full bg-gold/20 px-2 py-0.5 align-middle text-[10px] font-black text-[#8a6d2f] dark:text-gold">
                      ID {template.globalId}
                    </span>
                    </h3>
                  </div>
                  <span
                    className={`mt-1 inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                      isSelected
                        ? 'bg-[#111820] text-gold dark:bg-gold dark:text-[#111820]'
                        : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300'
                    }`}
                  >
                    {template.badge}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BirthdayTemplatePicker;
