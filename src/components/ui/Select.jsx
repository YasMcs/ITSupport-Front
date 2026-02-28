export function Select({ value, onChange, options, placeholder, className = "" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-dark-purple-800 border border-dark-purple-700 rounded-lg px-3 py-2 text-sm text-text-primary focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all min-w-[140px] ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
