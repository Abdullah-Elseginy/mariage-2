export const getLookupLabel = (option, { t, i18n } = {}) => {
  if (!option) return "";

  if (option.label_key && typeof i18n?.exists === "function" && i18n.exists(option.label_key)) {
    return t(option.label_key);
  }

  const language = i18n?.resolvedLanguage || i18n?.language || "ar";
  const normalizedLanguage = language.split("-")[0];

  if (option.labels?.[language]) {
    return option.labels[language];
  }

  if (option.labels?.[normalizedLanguage]) {
    return option.labels[normalizedLanguage];
  }

  return option.label || String(option.value ?? "");
};

export const mapLookupOptions = (options = [], helpers = {}) =>
  options.map((option) => ({
    ...option,
    label: getLookupLabel(option, helpers),
  }));
