const baseConfig = require('@chrome-extension-boilerplate/tailwindcss-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}', '../../packages/**/*.{js,ts,jsx,tsx}'],
};
