/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#087BFF',
          red: '#9270FF',
          yellow: '#19C8FF',
          green: '#19C8FF',
        },
        sharda: {
          blue: '#087BFF',
          red: '#9270FF',
          yellow: '#19C8FF',
          green: '#19C8FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
