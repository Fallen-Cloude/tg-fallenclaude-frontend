/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Unbounded"', 'sans-serif'],
        body:    ['"Nunito"', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#6366f1',
          hover:   '#4f46e5',
        },
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          DEFAULT: '#080b12',
          card:    '#0d1220',
          border:  '#1a2340',
          muted:   '#131929',
        }
      },
      borderRadius: {
        xl:  '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      animation: {
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in':  'fadeIn 0.25s ease',
        'pop':      'pop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer':  'shimmer 1.6s linear infinite',
      },
      keyframes: {
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        pop:     { from: { transform: 'scale(0.92)' }, to: { transform: 'scale(1)' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-none::-webkit-scrollbar': {
          'display': 'none',
        },
      })
    }
  ]
}
