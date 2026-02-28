/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta real del proyecto
        fondo: '#0b0615',
        primario: '#7c4dff',
        texto: '#eae6ff',
        // Dark Purple Premium (compatibilidad)
        'dark-purple': {
          '900': '#0b0615', // Fondo principal
          '800': '#1a1225', // Superficies/Cards
          '700': '#251a35', // Hover states
        },
        'purple': {
          'electric': '#7c4dff', // Primario
          'electric-hover': '#6b3df2',
        },
        'accent': {
          'pink': '#ec4899',
          'blue': '#3b82f6',
          'orange': '#f97316',
        },
        'text': {
          'primary': '#eae6ff', // Texto principal
          'secondary': '#ffffff', // Blanco puro para mejor contraste
          'muted': '#a78bfa',
        },
      },
      textColor: {
        'text': {
          'primary': '#eae6ff',
          'secondary': '#ffffff',
          'muted': '#a78bfa',
        },
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
}
