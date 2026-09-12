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
        }
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", '"Pixelify Sans"', 'cursive', 'sans-serif'],
        sans: ["var(--font-sans)", '"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px 0px var(--color-brown-dark)',
        'pixel': '4px 4px 0px 0px var(--color-brown-dark)',
        'pixel-lg': '6px 6px 0px 0px var(--color-brown-dark)',
        'cozy-soft': '0 4px 20px -2px rgba(74, 59, 50, 0.08)',
      },
      borderRadius: {
        'pixel': '4px',
        'cozy': '14px',
      }
    },
  },
  plugins: [],
}
