/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pm-yellow':      '#F5C842',
        'pm-yellow-deep': '#E5B72E',
        'pm-yellow-soft': '#FBE9A8',
        'pm-black':       '#111111',
        'pm-ink':         '#1A1A1A',
        'pm-navy':        '#1A2B5C',
        'pm-cream':       '#E8D89A',
        'pm-paper':       '#FAFAF7',
        'pm-paper-2':     '#F2F1EB',
        'pm-rule':        '#E2E0D6',
        'pm-muted':       '#6B6B66',
        'pm-error':       '#A03A1A',
        'pm-success':     '#2F6F3E',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInFast: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        breathe: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.45' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':      'fadeUp 0.5s ease-out both',
        'fade-in':      'fadeIn 0.4s ease-out both',
        'fade-in-fast': 'fadeInFast 0.2s ease-out both',
        'ticker':       'ticker 24s linear infinite',
        'breathe':      'breathe 3.5s ease-in-out infinite',
        'shimmer':      'shimmer 1.6s ease-in-out infinite',
        'slide-down':   'slideDown 0.2s ease-out both',
      },
    },
  },
  plugins: [],
}
