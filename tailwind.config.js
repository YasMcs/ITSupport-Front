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
        fondo: '#0b0b12',
        primario: '#7660d8',
        texto: '#eae6ff',
        // Dark Purple Premium (compatibilidad)
        'dark-purple': {
          '900': '#0b0b12', // Fondo principal
          '800': '#171521', // Superficies/Cards
          '700': '#221d31', // Hover states
        },
        'purple': {
          'electric': '#7660d8', // Primario
          'electric-hover': '#684fca',
        },
        'accent': {
          'pink': '#ec4899',
          'blue': '#60a5fa',
          'orange': '#fb923c',
          'cyan': '#22d3ee',
        },
        'text': {
          'primary': '#eae6ff', // Texto principal
          'secondary': '#ded8fb',
          'muted': '#a79fcf',
        },
      },
      textColor: {
        'text': {
          'primary': '#eae6ff',
          'secondary': '#ded8fb',
          'muted': '#a79fcf',
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
