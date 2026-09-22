import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fog: '#F4F6F8',
        ink: { DEFAULT: '#0E1726', soft: '#2E3A4E' },
        muted: '#5A6678',
        faint: '#8A94A6',
        line: '#E2E6EC',
        lens: { DEFAULT: '#2456F5', soft: '#EAF0FF', dark: '#1B3FC2' },
        danger: '#D92D20',
        good: '#0B8F5B',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 1px 2px rgba(14,23,38,.04), 0 16px 32px -16px rgba(14,23,38,.18)',
      },
    },
  },
  plugins: [],
}

export default config
