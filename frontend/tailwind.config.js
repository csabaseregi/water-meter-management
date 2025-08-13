/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors based on your design system
        'mohu-yellow': '#F7DD3C',
        'mohu-lime': '#A3E635',
        'mohu-green': '#16A34A',
        'mohu-blue': '#2563EB',
      }
    },
  },
  plugins: [],
}