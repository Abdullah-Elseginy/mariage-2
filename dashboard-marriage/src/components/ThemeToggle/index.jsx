import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/ThemeProvider";

const ThemeToggle = ({ className = "", compact = false }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const modeLabel = t(isDark ? "theme.light" : "theme.dark");
  const switchLabel = t(isDark ? "theme.switch_to_light" : "theme.switch_to_dark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={switchLabel}
      title={switchLabel}
      className={`inline-flex min-h-11 items-center border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-gold hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:border-gold ${compact ? "justify-center rounded-lg px-2.5 py-2" : "gap-2 rounded-lg px-3 py-2"} text-sm font-semibold ${className}`}
    >
      <span className={`flex ${compact ? "h-7 w-7 rounded-md" : "h-8 w-8 rounded-md"} items-center justify-center bg-slate-100 text-[#8a6d2f] dark:bg-black/20 dark:text-gold`}>
        {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
      </span>
      {!compact ? <span className="hidden sm:inline">{modeLabel}</span> : null}
    </button>
  );
};

export default ThemeToggle;
