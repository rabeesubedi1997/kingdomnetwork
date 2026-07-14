const typography = require('@tailwindcss/typography')
const forms = require('@tailwindcss/forms')

const brand = {
  primary: '#09333f',
  secondary: '#516f78',
  accent: '#7fa0a1',
  gold: '#ffcd57',
  dark: '#08313c',
  surface: '#f9f6fe',
  white: '#ffffff',
  text: '#1e293b',
  muted: '#67768e',
}

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
    },
    extend: {
      colors: {
        brand: {
          primary: brand.primary,
          secondary: brand.secondary,
          accent: brand.accent,
          gold: brand.gold,
          dark: brand.dark,
          surface: brand.surface,
          white: brand.white,
          text: brand.text,
          muted: brand.muted,
        },
        primary: 'var(--color-brand-primary)',
        'primary-hover': 'var(--color-brand-secondary)',
        surface: 'var(--color-brand-surface)',
        text: 'var(--color-brand-text)',
        'text-muted': 'var(--color-brand-muted)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [typography, forms],
}
