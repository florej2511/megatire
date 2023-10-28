/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      screens: {
        'phone': '270px',
        'tablet': '640px',
        'laptop': '1024px',
        'desktop': '1280px',
        'screen': '1536px',
        'tv': '2000px'
      },
      colors: {
        primary: '#1d4489',
        secondary: '#fff',
        third: '#1e1c2a',
        extra: '#C94843',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|border|hover)-(primary|secondary|third)/,
      variants: ['hover', 'focus'],
    },
  ]
}