export function FormField({ label, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="text-accent-pink ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
