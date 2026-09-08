import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck as Check, FiChevronDown as ChevronDown, FiSearch as Search } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const CustomDropdown = ({
  label,
  name,
  id,
  options = [],
  value,
  onChange,
  error,
  placeholder = "Select...",
  className = "",
  disabled = false,
  Icon,
  icon,
  menuPlacement = "bottom",
  searchable = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  getSearchText,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const inputId = id || name;
  const startIcon = icon || Icon;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const rootRef = useRef(null);

  const normalizedOptions = useMemo(
    () => options.map((option) => (typeof option === "object" ? option : { value: option, label: option })),
    [options]
  );

  const selectedOption = normalizedOptions.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    if (!searchable) return normalizedOptions;

    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return normalizedOptions;

    return normalizedOptions.filter((option) => {
      const searchText = getSearchText
        ? getSearchText(option)
        : [option.label, option.value].filter(Boolean).join(" ");

      return String(searchText || "").toLowerCase().includes(normalizedQuery);
    });
  }, [getSearchText, normalizedOptions, searchable, searchQuery]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const emitChange = (nextValue) => {
    if (!onChange) return;
    const selected = normalizedOptions.find((option) => option.value === nextValue);
    onChange({
      target: {
        name,
        id: inputId,
        value: nextValue,
        dataset: selected?.dataset || {},
      },
    });
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((current) => !current);
    }
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((current) => !current);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={className} style={{ width: "100%", maxWidth: "100%", minWidth: 0, position: "relative", boxSizing: "border-box" }}>
      {label ? (
        <label
          htmlFor={inputId}
          style={{
            display: "block",
            marginBottom: 8,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            color: "var(--text-muted)",
          }}
        >
          {label}
        </label>
      ) : null}

      <button
        id={inputId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          minHeight: 56,
          borderRadius: 18,
          border: error ? "1.5px solid rgba(239,68,68,0.55)" : "1.5px solid var(--border)",
          background: error
            ? "linear-gradient(180deg, rgba(239,68,68,0.08), rgba(239,68,68,0.03))"
            : "linear-gradient(180deg, color-mix(in srgb, var(--bg-card) 94%, transparent), color-mix(in srgb, var(--bg-dark) 96%, transparent))",
          color: selectedOption ? "var(--text-primary)" : "var(--text-muted)",
          fontSize: 14,
          fontWeight: selectedOption ? 600 : 500,
          outline: "none",
          transition: "var(--transition)",
          fontFamily: "inherit",
          boxShadow: isOpen
            ? "0 0 0 4px var(--primary-glow), 0 18px 36px rgba(0,0,0,0.12)"
            : "0 12px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
          padding: isRTL ? "0 52px 0 18px" : "0 18px 0 52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          cursor: disabled ? "not-allowed" : "pointer",
          position: "relative",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {startIcon ? (
          <span
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [isRTL ? "right" : "left"]: 16,
              color: isOpen ? "var(--primary)" : "var(--text-muted)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {typeof startIcon === "function" ? startIcon() : startIcon}
          </span>
        ) : null}

        <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedOption?.label || placeholder}
        </span>

        <span
          style={{
            color: isOpen ? "var(--primary)" : "var(--text-muted)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease, color 0.2s ease",
            flexShrink: 0,
          }}
        >
          <ChevronDown size={18} />
        </span>
      </button>

      {isOpen ? (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: menuPlacement === "top" ? "auto" : "calc(100% + 10px)",
            bottom: menuPlacement === "top" ? "calc(100% + 10px)" : "auto",
            left: 0,
            right: 0,
            maxWidth: "100%",
            boxSizing: "border-box",
            zIndex: 30,
            padding: 8,
            borderRadius: 20,
            border: "1px solid var(--border)",
            background: "color-mix(in srgb, var(--bg-card) 96%, transparent)",
            boxShadow: "0 24px 50px rgba(0,0,0,0.18)",
            backdropFilter: "blur(18px)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {searchable ? (
            <div
              style={{
                position: "relative",
                flexShrink: 0,
                zIndex: 1,
                background: "color-mix(in srgb, var(--bg-card) 96%, transparent)",
                borderRadius: 14,
              }}
            >
              <Search
                size={15}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  [isRTL ? "right" : "left"]: 12,
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                style={{
                  width: "100%",
                  minHeight: 42,
                  boxSizing: "border-box",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--text-primary)",
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: isRTL ? "0 38px 0 12px" : "0 12px 0 38px",
                }}
              />
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              maxHeight: searchable ? 220 : 240,
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            {filteredOptions.length === 0 ? (
              <div style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
                {emptyMessage}
              </div>
            ) : filteredOptions.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    emitChange(option.value);
                    setIsOpen(false);
                  }}
                  style={{
                    width: "100%",
                    minHeight: 46,
                    border: "none",
                    borderRadius: 14,
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(26,107,69,0.18), rgba(52,211,153,0.08))"
                      : "transparent",
                    color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                    padding: isRTL ? "0 14px 0 12px" : "0 12px 0 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: isSelected ? 700 : 600,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{option.label}</span>
                  <span
                    style={{
                      opacity: isSelected ? 1 : 0,
                      color: "var(--primary)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {error ? (
        <div
          style={{
            marginTop: 8,
            color: "#f87171",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default CustomDropdown;
