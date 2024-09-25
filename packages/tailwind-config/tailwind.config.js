/** @type {import('tailwindcss').Config} */
module.exports = {
  /** shared theme configuration */
  prefix: 'tw-',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D3B076',
          dark: '#555555',
          light: '#D3B076',
          500: '#C9A566',
        },
        gray: {
          50: '#F2F2F2',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#7F7F7F',
          600: '#666666',
          700: '#4C4C4C',
          800: '#333333',
          900: '#1A1A1A',
        },
        danger: '#FF0000',
        secondary: '#F9D94C',
        tertiary: '#707070',
        background: '#F2F2F2',
        text: '#000000',
        white: '#FFFFFF',
        brown: '#D3B076',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Add Roboto and default sans-serif fonts
      },
    },
  },
  /** shared plugins configuration */
  plugins: [require('@tailwindcss/line-clamp')],
  corePlugins: {
    collapse: false,
  },
};
