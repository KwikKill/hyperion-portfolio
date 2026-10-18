/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,js,jsx,tsx}',
  ],
  safelist: [
    {
      pattern: /grid-cols-\d+/,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
        bg: 'rgb(var(--color-background))',
        accent: 'rgb(var(--color-accent))',
        text: 'rgb(var(--color-text))',
        hover: 'rgb(var(--color-hover))',
        terminal: 'rgb(var(--color-terminal))',
        'terminal-hover': 'rgb(var(--color-terminal-hover))',
        // Text on a primary (or terminal) background: black on the dark themes, white on Solarpunk.
        'on-primary': 'rgb(var(--color-on-primary))',
        error: 'rgb(var(--color-error))',
        // The greys used by the portfolio follow the cyberpunk theme, so labels stay readable
        // on Solarpunk's light background. Tailwind's own values elsewhere (tailwind.css).
        gray: {
          300: 'rgb(var(--color-gray-300))',
          400: 'rgb(var(--color-gray-400))',
          500: 'rgb(var(--color-gray-500))',
          600: 'rgb(var(--color-gray-600))',
        },
      },
      screens: {
        custom1: '1900px',
        custom2: '1700px',
        varysmall: '400px',
      },
    },
    fontFamily: {
      'sd-dystopian': ['"SD Dystopian"', 'sans-serif'],
      'sd-glitch-robot': ['"SD Glitch Robot"', 'sans-serif'],
      'cyberway-riders': ['"Cyberway Riders"', 'sans-serif'],
      'cybergame-regular': ['"Cybergame Regular"', 'sans-serif'],
      valorax: ['"Valorax"', 'sans-serif'],
      cyberpunk: ['"Cyberpunk"', 'sans-serif'],
      'cyberpunk-italic': ['"Cyberpunk Italic"', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
    },
  },
};
