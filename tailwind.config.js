/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'kwik-green': '#2D7337',
        'kwik-red': '#CC0000',
        'kwik-yellow': '#FED41D',
      },
    },
  },
  plugins: [],
};