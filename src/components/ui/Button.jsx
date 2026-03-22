export function Button({ children, variant = "primary", disabled, className = "", ...props }) {
  const base = "px-6 py-3 rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-purple-electric/90 text-white hover:bg-purple-electric",
    secondary: "bg-dark-purple-800 text-text-secondary border border-dark-purple-700 hover:bg-dark-purple-700 hover:text-text-primary",
    danger: "bg-purple-electric/80 text-white hover:bg-purple-electric/90",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
