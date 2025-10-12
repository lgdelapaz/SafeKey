/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        'xs-large': '1.05rem',
        'sm-large': '1.15rem',
        'base-large': '1.25rem',
        'lg-large': '1.35rem',
        'xl-large': '1.5rem',
        '2xl-large': '1.75rem',
      },
    },
  },
  plugins: [],
}