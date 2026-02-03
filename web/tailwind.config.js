/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#2D1B69',
        'dark-navy': '#0A0E27',
        'periwinkle': '#8B9FDE',
        'bright-cyan': '#00D9FF',
        'muted-teal': '#6B9B9E',
      },
    },
  },
  plugins: [],
}
