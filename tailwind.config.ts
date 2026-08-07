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
        marvel: {
          dark: "#0a0a0f",
          darker: "#050508",
          card: "#12121a",
          border: "#1f1f2e",
          red: "#e62429",
          gold: "#f3d053",
          cyan: "#00f0ff",
          purple: "#9d4edd",
          green: "#2ec4b6",
        },
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'Consolas', 'monospace'],
        display: ['var(--font-geist-sans)', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'arc-reactor': 'arcSpin 10s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(230, 36, 41, 0.4)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px rgba(230, 36, 41, 0.8)' },
        },
        arcSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
