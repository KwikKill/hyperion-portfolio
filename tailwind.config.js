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
        'theme-bg': '#1a1a1a',
        'theme-foreground': '#feee3b',
        'theme-border': '#393838',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
  plugins: [require('@tailwindcss/forms')],
};
