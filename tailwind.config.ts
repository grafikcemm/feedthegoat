import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-card-elevated)',
          hover: 'var(--bg-card-hover)',
          border: 'var(--border-subtle)',
          'border-strong': 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          muted: 'var(--accent-muted)',
          glow: 'var(--accent-glow)',
        },
        status: {
          success: 'var(--success)',
          fire: 'var(--fire)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          quaternary: 'var(--text-quaternary)',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter-tight)', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        '2xl': '20px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
};

export default config;
