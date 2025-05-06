/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        danger: '#f44250',
        success: 'oklch(62.7% 0.194 149.214)',
        warning: '#fecc1b',
        process: '#3992ff',
        // button action
        // light mode
        'light-text-primary': '#09090B',
        'light-text-secondary': '#323232',
        'light-bg-primary': '#FFFFFF',
        'light-bg-secondary': '#f7f7f7',
        'light-border': '#c6c6c6',
        'light-action': '#3358ff',
        'light-action-hover': '#3358ff33',
        // dark mode
        'dark-text-primary': '#FAFAFA',
        'dark-text-secondary': '#A1A1AA',
        'dark-bg-primary': '#09090b',
        'dark-bg-secondary': '#151518',
        'dark-border': '#b8c0cc33',
        'dark-action': '#FAFAFA',
        'dark-action-hover': '#fafafae6',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}