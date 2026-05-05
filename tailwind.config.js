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
    },
  },
  plugins: [],
}
