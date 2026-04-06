import { useEffect, useMemo, useRef, useState } from "react";

export function Select({ value, onChange, options, placeholder, className = "", disabled = false }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const normalizedOptions = useMemo(() => {
    const baseOptions = Array.isArray(options) ? options : [];
    if (!placeholder) return baseOptions;

    return [{ value: "", label: placeholder }, ...baseOptions];
  }, [options, placeholder]);

  const selectedOption = normalizedOptions.find((option) => String(option.value) === String(value));
  const selectedLabel = selectedOption?.label ?? placeholder ?? "Seleccionar";

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((current) => !current)}
        className={`flex min-w-[140px] w-full items-center justify-between gap-3 overflow-hidden rounded-xl border border-dark-purple-700 bg-dark-purple-800/95 px-3 py-2 text-left text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 hover:border-dark-purple-600 focus:border-purple-electric focus:outline-none focus:ring-2 focus:ring-purple-electric/30 disabled:cursor-not-allowed disabled:opacity-70 ${
          open ? "border-purple-electric ring-2 ring-purple-electric/30" : ""
        }`}
      >
        <span className={`${value ? "text-text-primary" : "text-text-secondary"} truncate`}>
          {selectedLabel}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-dark-purple-700/90 bg-[#171126]/95 shadow-[0_18px_45px_rgba(9,6,23,0.35)] backdrop-blur-xl">
          <div className="max-h-64 overflow-y-auto py-2">
            {normalizedOptions.map((option) => {
              const isSelected = String(option.value) === String(value);

              return (
                <button
                  key={`${option.value}-${option.label}`}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                    isSelected
                      ? "bg-purple-electric/12 text-text-primary"
                      : "text-text-secondary hover:bg-white/[0.05] hover:text-text-primary"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <svg className="h-4 w-4 shrink-0 text-purple-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
