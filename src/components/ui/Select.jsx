export function Select({ value, onChange, options, placeholder, className = "", disabled = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-dark-purple-700 bg-dark-purple-800/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 hover:border-dark-purple-600 focus-within:border-purple-electric focus-within:ring-2 focus-within:ring-purple-electric/30 ${className}`}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-w-[140px] w-full appearance-none bg-transparent px-3 py-2 pr-10 text-sm text-text-primary outline-none disabled:cursor-not-allowed disabled:opacity-70"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
}
