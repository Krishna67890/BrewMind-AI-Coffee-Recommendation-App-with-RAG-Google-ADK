/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0c1b3',
          400: '#d3a28e',
          500: '#c27d60',
          600: '#ab5d3f',
          700: '#8f4a33',
          800: '#733c2a',
          900: '#5c3123',
          950: '#2a140e', // Dark Espresso
        },
        cream: {
          50: '#fffdfa',
          100: '#fef9f1',
          200: '#fbf2e1',
          300: '#f7e6c7',
          400: '#f1d29f',
          500: '#ebbd77',
          600: '#e3a14f',
          700: '#c8803b',
          800: '#a36634',
          900: '#84542d',
          950: '#462b16',
        },
        amber: {
          custom: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
