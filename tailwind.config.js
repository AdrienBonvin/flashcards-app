/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#009cca",
        secondary: "#64d3ff",
        highlight: "#c8f8ff",
        contrast: "#f0972d",
        background: "#242424",
      },
    },
  },
  plugins: [],
};
