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
        fondo: '#07070a',
        primario: '#6f57c8',
        texto: '#eae6ff',
        // Dark Purple Premium (compatibilidad)
        'dark-purple': {
          '900': '#07070a', // Fondo principal
          '800': '#14111b', // Superficies/Cards
          '700': '#1d1827', // Hover states
        },
        'purple': {
          'electric': '#6f57c8', // Primario
          'electric-hover': '#614ab5',
        },
        'accent': {
          'pink': '#8b5cf6',
          'blue': '#6f57c8',
          'orange': '#7c3aed',
        },
        'text': {
          'primary': '#eae6ff', // Texto principal
          'secondary': '#ddd6fe',
          'muted': '#9f95c8',
        },
      },
      textColor: {
        'text': {
          'primary': '#eae6ff',
          'secondary': '#ddd6fe',
          'muted': '#9f95c8',
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
