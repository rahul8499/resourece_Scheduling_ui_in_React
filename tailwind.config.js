/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: [ 'Inter', 'sans-serif'],
      },
      colors: {
        primaryColour: "#184D47",
        secondaryColour: 'rgba(235, 242, 228)',
        shadeColour: 'rgba(201, 235, 162)',
        btnColour: 'rgba(84, 115, 38)',
        btntwoColour: 'rgba(127, 181, 175)'
        

      },
    },
  },
  plugins: [],
};


