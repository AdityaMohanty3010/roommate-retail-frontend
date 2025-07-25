/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ include all source files
  ],
  theme: {
    extend: {
      fontFamily: {
        copper: ['"Copperplate"', 'Georgia', 'serif'], // For classical serif titles
      },
    },
  },
  plugins: [],
};
