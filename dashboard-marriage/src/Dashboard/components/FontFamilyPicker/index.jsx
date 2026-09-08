import React from 'react';
import { FiCheck } from 'react-icons/fi';

export const fontFamilyOptions = [
  {
    id: 'elegant',
    label: 'Elegant',
    latin: '"Playfair Display", serif',
    arabic: '"Amiri", serif',
    englishSample: 'A Beautiful Celebration',
    arabicSample: 'لحظات جميلة لا تنسى',
  },
  {
    id: 'romantic',
    label: 'Romantic',
    latin: '"Cormorant Garamond", serif',
    arabic: '"Aref Ruqaa", serif',
    englishSample: 'Forever Starts Here',
    arabicSample: 'وتبدأ حكايتنا الجميلة',
  },
  {
    id: 'modern',
    label: 'Modern',
    latin: '"Outfit", sans-serif',
    arabic: '"Cairo", sans-serif',
    englishSample: 'Made for Your Moment',
    arabicSample: 'صنعت خصيصا للحظتكم',
  },
  {
    id: 'classic',
    label: 'Classic',
    latin: '"Lora", serif',
    arabic: '"Noto Naskh Arabic", serif',
    englishSample: 'With Love and Joy',
    arabicSample: 'بكل الحب والفرح',
  },
  {
    id: 'playful',
    label: 'Playful',
    latin: '"Handjet", cursive',
    arabic: '"Lalezar", cursive',
    englishSample: 'Party Starts With Love',
    arabicSample: 'نحتفل بالحب والفرحة',
  },
  {
    id: 'cheerful',
    label: 'Cheerful',
    latin: '"Comfortaa", sans-serif',
    arabic: '"Alexandria", sans-serif',
    englishSample: 'A Joyful Invitation',
    arabicSample: 'دعوة مبهجة ليوم جميل',
  },
  {
    id: 'sunny',
    label: 'Sunny',
    latin: '"Quicksand", sans-serif',
    arabic: '"Changa", sans-serif',
    englishSample: 'Smiles, Flowers, Forever',
    arabicSample: 'ابتسامات وورد إلى الأبد',
  },
  {
    id: 'bloom',
    label: 'Bloom',
    latin: '"Josefin Sans", sans-serif',
    arabic: '"El Messiri", sans-serif',
    englishSample: 'Bloom Into Forever',
    arabicSample: 'نبدأ العمر بحب مزهر',
  },
];

const FontFamilyPicker = ({ value = 'elegant', onChange }) => (
  <div className="col-span-full">
    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      Typography
    </p>
    <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
      Choose one paired Arabic and English font style for the complete public page.
    </p>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="radiogroup" aria-label="Typography">
      {fontFamilyOptions.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={`relative min-h-40 overflow-hidden rounded-lg border p-4 text-start transition ${
              selected
                ? 'border-gold bg-[#fffaf0] ring-2 ring-gold/40 dark:bg-gold/10'
                : 'border-slate-200 bg-white hover:border-gold/60 dark:border-[#344458] dark:bg-[#101923]'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a6d2f] dark:text-gold">{option.label}</span>
            <strong className="mt-4 block text-xl text-slate-950 dark:text-white" style={{ fontFamily: option.latin }}>
              {option.englishSample}
            </strong>
            <span className="mt-3 block text-end text-xl text-slate-800 dark:text-slate-100" dir="rtl" style={{ fontFamily: option.arabic }}>
              {option.arabicSample}
            </span>
            {selected && <span className="absolute end-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-gold text-[#111820]"><FiCheck /></span>}
          </button>
        );
      })}
    </div>
  </div>
);

export default FontFamilyPicker;
