export function FormField({ label, error, children, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#b7b0d4]">
        {label}
        {required && <span className="text-accent-pink ml-1">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-accent-pink leading-tight mt-1">{error}</span>
      )}
    </div>
  );
}

