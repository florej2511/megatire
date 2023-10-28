/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      screens: {
        'phone': '270px',
        'tablet': '600px',
        'laptop': '1024px',
        'desktop': '1280px',
        'screen': '1536px',
        'cesarTv': '2000px'
      },
      colors: {
        primary: '#1d4489',
        secondary: '#ffffff',
        third: '#1e1c2a',
        extra: '#C94843',
      },
    },
  },
  plugins: [],
  safelist: [
    'scale-0'
  ]
}

