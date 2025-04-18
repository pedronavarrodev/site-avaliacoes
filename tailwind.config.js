/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9F8C5B",
        secondary: "#BFB08B",
        gold: {
          50: "#FAF7F0",
          100: "#F5EFE0",
          200: "#E8DFC1",
          300: "#D4C598",
          400: "#BFB08B",
          500: "#9F8C5B",
          600: "#8C7A4D",
          700: "#6B5D3B",
          800: "#4D432A",
          900: "#2E2819"
        }
      },
    },
  },
  plugins: [],
} 