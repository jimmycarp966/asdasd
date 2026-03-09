import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)'],
        body: ['var(--font-body)'],
      },
      colors: {
        background: 'var(--bg-dark)',
        foreground: 'var(--text-primary)',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'moon-breathe': 'moonBreathe 3s ease-in-out infinite',
        'star-twinkle': 'starTwinkle 3s ease-in-out infinite',
        'fade-up': 'fadeInUp 1s ease-out',
        glow: 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
