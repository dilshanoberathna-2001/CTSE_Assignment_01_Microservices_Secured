/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: '#E50914',
        netflixHover: '#f40612',
        dark: '#141414',
      }
    },
  },
  plugins: [],
}
