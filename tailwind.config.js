/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#009cca",
        "primary-hover": "#008ab5",
        secondary: "#64d3ff",
        "secondary-hover": "#4ac9ff",
        highlight: "#c8f8ff",
        contrast: "#f0972d",
        "contrast-hover": "#e08a20",
        background: "#1a1a1e",
        surface: "#242429",
        "surface-elevated": "#2d2d33",
        muted: "#9ca3af",
        "text-primary": "#f9fafb",
        "text-secondary": "#d1d5db",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "card-hover":
          "0 10px 15px -3px rgb(0 0 0 / 0.25), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        glow: "0 0 20px -5px rgb(0, 156, 202 / 0.3)",
        "glow-contrast": "0 0 20px -5px rgb(240, 151, 45 / 0.3)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
