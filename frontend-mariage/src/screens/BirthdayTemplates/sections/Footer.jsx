import React from 'react';

const Footer = ({
  isArabic,
  footerText
}) => {
  return (
    <footer className="w-full py-8 text-center border-t border-[#6a0109]/10 bg-gradient-to-b from-transparent to-[#ffe088]/5 flex flex-col items-center justify-center gap-3 select-none">
      <p className="font-amiri text-base sm:text-lg text-[#6a0109] font-bold">
        {footerText}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-[#7b5455] font-semibold font-sans">
        <span className="flex items-center gap-1">
          <span>{isArabic ? 'جميع الحقوق محفوظة © لـ' : 'Copyright © Reserved to'}</span>
          <span className="font-extrabold text-[#6a0109] tracking-wider">WIL</span>
        </span>
        
      </div>
    </footer>
  );
};

export default Footer;
