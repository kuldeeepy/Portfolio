/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlack: "#1b1b18",
        primaryWhite: "#fdfdfc",
      },
    },
  },
  plugins: [],
};
