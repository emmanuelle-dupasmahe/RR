/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // primary: '#B91C1C',
        primary: '#ff0000',
        'dark-bg': '#121212',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
}
