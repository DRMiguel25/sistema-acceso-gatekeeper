/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        itses: {
          navy: '#0c1e33',
          dark: '#07101c',
          gold: '#b8914c',
          glow: 'rgba(184, 145, 76, 0.3)'
        }
      }
    },
  },
  plugins: [],
}
