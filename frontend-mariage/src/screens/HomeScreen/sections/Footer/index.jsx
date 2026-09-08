import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGlobe } from "react-icons/fa";
import { mnu_logo } from "../../assets";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-surface border-t border-white/10 pt-12 pb-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-center text-center md:text-right">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src={mnu_logo} alt="MNU Logo" className="h-12 w-auto" />
              <div>
                <h3 className="text-lg font-bold text-white">جامعة المنوفية الأهلية</h3>
                <p className="text-xs text-gray-400">Menoufia National University</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              نظام ذكي متكامل لإدارة البطاقات الجامعية وتسهيل الخدمات الطلابية بأحدث التقنيات.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h4 className="text-white font-semibold mb-2">روابط سريعة</h4>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">سياسة الخصوصية</a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">شروط الاستخدام</a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">الدعم الفني</a>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h4 className="text-white font-semibold">تواصل معنا</h4>
            <div className="flex gap-3">
              <SocialIcon icon={<FaFacebookF />} href="#" />
              <SocialIcon icon={<FaTwitter />} href="#" />
              <SocialIcon icon={<FaInstagram />} href="#" />
              <SocialIcon icon={<FaGlobe />} href="https://mnu.menofia.education/en" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            جميع الحقوق محفوظة © {currentYear} <span className="text-primary font-semibold">ادارة تكنولوجيا المعلومات جامعة المنوفية الاهلية</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 transform hover:-translate-y-1"
  >
    {icon}
  </a>
);

export default Footer;
