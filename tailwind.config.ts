import type { Config } from "tailwindcss";

export default {
  darkMode: ['class', '[data-theme="dark"]'], // Support both class and data-theme
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)",
        "primary-dark": "var(--primary-dark)",
        accent: "var(--accent)",
        "header-bg": "var(--header-bg)",
        "header-text": "var(--header-text)",
        "footer-bg": "var(--footer-bg)",
        "footer-text": "var(--footer-text)",
        "footer-text-secondary": "var(--footer-text-secondary)",
        "card-bg": "var(--card-bg)",
      },
      animation: {
        scaleIn: 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;