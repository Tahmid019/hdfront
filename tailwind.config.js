/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#F5F4EF',
        surface:  '#FFFFFF',
        dark:     '#1A1A1A',
        sidebar:  '#F0EFE9',
        accent:   '#C8F135',
        muted:    '#8A8A8A',
        border:   '#E5E3DC',
        warning:  '#F59E0B',
        critical: '#EF4444',
        success:  '#22C55E',
        info:     '#3B82F6',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
