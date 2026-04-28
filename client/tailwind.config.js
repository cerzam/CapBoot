/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          900: '#0d0d0d',
          800: '#1a1a1a',
          700: '#242424',
          600: '#2e2e2e',
          500: '#3d3d3d',
        },
        cycle: {
          orange: '#ff6b00',
          'orange-light': '#ff8c38',
          'orange-dark': '#cc5500',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
