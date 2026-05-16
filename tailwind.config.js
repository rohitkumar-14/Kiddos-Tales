/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fredoka', 'sans-serif'],
      },
      colors: {
        kidPink: '#FF9EBB',
        kidYellow: '#FFD700',
        kidBlue: '#74E2FF',
        kidGreen: '#98FB98',
      }
    },
  },
  plugins: [],
}

