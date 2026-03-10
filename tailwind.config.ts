import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        premium: '#7c3aed',
        free: '#0ea5e9'
      }
    }
  },
  plugins: []
} satisfies Config;
