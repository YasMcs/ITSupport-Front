export function Button({ children, variant = "primary", disabled, className = "", ...props }) {
  const base = "px-6 py-3 rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-purple-electric text-white hover:bg-purple-electric-hover shadow-lg shadow-purple-electric/30",
    secondary: "bg-dark-purple-800 text-text-secondary border border-dark-purple-700 hover:bg-dark-purple-700 hover:text-text-primary",
    danger: "bg-accent-pink text-white hover:bg-accent-pink/90 shadow-lg shadow-accent-pink/30",
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
