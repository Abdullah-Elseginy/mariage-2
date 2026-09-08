import React from 'react';

const CustomBottom = ({
  text,
  title,
  onClick,
  styles = '',
  buttonStyles = '',
  textStyle = '',
  rigthIcon,
  rightIcon,
  type = 'button',
  disabled = false,
  loading = false,
  loadingText = '',
}) => {
  const icon = rightIcon || rigthIcon;

  return (
    <div className={`flex justify-center ${styles}`}>
      <button
        type={type}
        title={title || text}
        onClick={!loading && !disabled ? onClick : undefined}
        disabled={loading || disabled}
        className={`relative flex min-h-14 w-full items-center justify-center gap-3 rounded-lg px-6 py-4 font-semibold uppercase tracking-[0.14em] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gold/25 disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles}`}
      >
        {loading && (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        <span className={`text-sm md:text-base ${textStyle}`}>{loading ? loadingText || text : text}</span>
        {!loading && icon && <span className="text-lg">{icon}</span>}
      </button>
    </div>
  );
};

export default CustomBottom;
