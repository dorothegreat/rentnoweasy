/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  colors: {
    appbg: "#0F172A",
    card: "#1E293B",
    border: "#334155"
  }
}
  },
  plugins: [],
};
