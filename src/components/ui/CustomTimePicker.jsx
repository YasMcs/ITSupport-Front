import { useState, useRef, useEffect } from "react";

// Generar opciones de tiempo
const generateHours = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i.toString().padStart(2, "0"));
  }
  return hours;
};

const MINUTES = ["00", "15", "30", "45"];

export function CustomTimePicker({ value, onChange, placeholder = "Seleccionar hora" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const hours = generateHours();

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (hour, minute) => {
    const timeValue = `${hour}:${minute}`;
    onChange(timeValue);
    setIsOpen(false);
  };

  // Parsear el valor actual
  const currentValue = value ? value.split(":") : [null, null];

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input simulado (botón) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600 flex items-center justify-between"
      >
        <span className={value ? "text-text-primary" : "text-text-muted/50"}>
          {value ? value : placeholder}
        </span>
        {/* Ícono de reloj */}
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Dropdown flotante */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl shadow-lg overflow-hidden">
          <div className="flex">
            {/* Columna de Horas */}
            <div className="flex-1 max-h-48 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleSelect(hour, currentValue[1] || "00")}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    currentValue[0] === hour
                      ? "bg-purple-electric text-white"
                      : "text-text-primary hover:bg-white/10"
                  }`}
                >
                  {hour}
                </button>
              ))}
            </div>

            {/* Separador vertical */}
            <div className="w-px bg-dark-purple-700" />

            {/* Columna de Minutos */}
            <div className="flex-1 max-h-48 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {MINUTES.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => handleSelect(currentValue[0] || "00", minute)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    currentValue[1] === minute
                      ? "bg-purple-electric text-white"
                      : "text-text-primary hover:bg-white/10"
                  }`}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
