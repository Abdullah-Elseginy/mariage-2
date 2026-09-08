import React from "react";
import { Moon, SunMedium } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/ThemeProvider";

const ThemeToggle = ({ className = "", compact = false }) => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const isArabic = i18n.language === "ar";
  const modeLabel = isDark ? (isArabic ? "فاتح" : "Light") : isArabic ? "داكن" : "Dark";
  const switchLabel = isDark
    ? isArabic
      ? "التبديل إلى الوضع الفاتح"
      : "Switch to light mode"
    : isArabic
      ? "التبديل إلى الوضع الداكن"
      : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={switchLabel}
      title={switchLabel}
      className={`theme-toggle inline-flex items-center ${compact ? "justify-center rounded-xl px-2.5 py-2" : "gap-2 rounded-2xl px-3 py-2"} text-sm font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <span className={`theme-toggle-icon flex ${compact ? "h-7 w-7 rounded-md" : "h-8 w-8 rounded-xl"} items-center justify-center`}>
        {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
      {!compact ? <span className="theme-toggle-label hidden sm:inline">{modeLabel}</span> : null}
    </button>
  );
};

export default ThemeToggle;
