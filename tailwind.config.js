import { colors } from "zaui-tokens";

/* eslint-env node */
module.exports = {
  darkMode: ["selector", '[zaui-theme="dark"]'],
  purge: {
    enabled: true,
    content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  },
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        "primary-light": "var(--primary-light)",
        secondary: "var(--secondary-color)",
        background: "var(--background-color)",
        surface: "var(--surface-color)",
        main: "var(--text-main)",
        muted: "var(--text-muted)",
      },
      fontFamily: {
        mono: ["Roboto Mono", "monospace"],
      },
      keyframes: {
        'spin-vertical': {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(360deg)' },
        }
      },
      animation: {
        'spin-vertical': 'spin-vertical 1s linear infinite',
      }
    },
  },
};
