/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme tokens backed by CSS variables
        cozy: {
          cream: "var(--color-cream)",
          parchment: "var(--color-parchment)",
          card: "var(--color-card)",
          border: "var(--color-border)",
          brown: {
            DEFAULT: "var(--color-brown-base)",
            dark: "var(--color-brown-dark)",
            medium: "var(--color-brown-medium)",
            light: "var(--color-brown-light)",
            subtle: "var(--color-brown-subtle)",
          },
          sage: {
            DEFAULT: "var(--color-sage-base)",
            dark: "var(--color-sage-dark)",
            light: "var(--color-sage-light)",
            subtle: "var(--color-sage-subtle)",
          },
          terracotta: {
            DEFAULT: "var(--color-terracotta-base)",
            dark: "var(--color-terracotta-dark)",
            light: "var(--color-terracotta-light)",
            subtle: "var(--color-terracotta-subtle)",
          },
          gold: {
            DEFAULT: "var(--color-gold-base)",
            dark: "var(--color-gold-dark)",
            light: "var(--color-gold-light)",
          },
          // Stats colors
          stats: {
            focus: "var(--color-stat-focus)",
            discipline: "var(--color-stat-discipline)",
            vitality: "var(--color-stat-vitality)",
            creativity: "var(--color-stat-creativity)",
          }
        },
        comic: {
          pink: '#ff6b9d',
          pinkLight: '#ff85a1',
          cyan: '#00f0ff',
          cyanLight: '#5ef4ff',
          orange: '#ff6a00',
          orangeLight: '#ff8d3f',
          magenta: '#ff007f',
          magentaLight: '#ff3d9a',
          yellow: '#ffe600',
          lime: '#10b981',
          dark: '#0a0b10',
          darkCard: '#131620',
          border: '#000000'
        }
      },
      fontFamily: {
        bangers: ['"Bangers"', 'Impact', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        pixel: ["var(--font-pixel)", '"Pixelify Sans"', 'cursive', 'sans-serif'],
        sans: ["var(--font-sans)", '"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pixel-sm': '3px 3px 0px 0px #000000',
        'pixel': '5px 5px 0px 0px #000000',
        'pixel-lg': '8px 8px 0px 0px #000000',
        'comic-sm': '3px 3px 0px 0px #000000',
        'comic': '5px 5px 0px 0px #000000',
        'comic-lg': '8px 8px 0px 0px #000000',
        'comic-hover': '9px 9px 0px 0px #000000',
        'cozy-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        'pixel': '6px',
        'cozy': '14px',
        'comic': '16px',
      }
    },
  },
  plugins: [],
}
