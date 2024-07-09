/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'window-controls-overlay': {
          raw: '(display-mode: window-controls-overlay)'
        }
      }
    },

  },
  plugins: [],
}

