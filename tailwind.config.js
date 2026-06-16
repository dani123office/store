/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#151515",
        border: "#E2E2E2",
      },
      fontFamily: {
        sans: ['"Fira Sans"', "sans-serif"],
      },
    },
  },
  plugins: ["@tailwindcss/forms"],
};
