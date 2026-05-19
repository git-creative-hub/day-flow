/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        df: {
          bg:       '#0f0f0e',
          surface:  '#1a1a18',
          surface2: '#242422',
          border:   '#2e2e2a',
          accent:   '#d4a843',
          accent2:  '#8fb87a',
          text:     '#e8e4dc',
          text2:    '#9a9590',
          text3:    '#5a5650',
          danger:   '#c06050',
          rollover: '#7a9fc0',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono:  ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
