// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0E3328', // Forest Green
        dark: '#091A16', // Dark Green/Black
        accent: '#D4F670', // Bright Lime Green (Podcast Coach reference)
        sage: '#B9C9BE', // Soft green/grey
        ivory: '#F4F1EA', // Warm cream/ivory
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
