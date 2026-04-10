/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050A14',
        surface: '#0D1626',
        surface2: '#111E33',
        border: '#1E3052',
        accent: '#00E5FF',
        accent2: '#FF4D6D',
        accent3: '#7B61FF',
        muted: '#6B8CAE',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
