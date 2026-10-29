import type { Config } from "tailwindcss";

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        dark: "#1b1b1b",
        light: "#f5f5f5",
        // Brand palette, taken from the shop sign: poppy red, leaf green on black.
        cream: { DEFAULT: "#F8F2E9", deep: "#EFE4D3" },
        ink: { DEFAULT: "#1E1916", soft: "#4A403A", muted: "#6F635C" },
        // `deep` is for small red text: plain poppy is too light to read on cream.
        poppy: { DEFAULT: "#C8333A", deep: "#B82E35", dark: "#A3262D", light: "#F5DCD6" },
        leaf: { DEFAULT: "#4F8A34", dark: "#3A6826", light: "#E1ECD6" },
        crust: "#B9773E",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
    // Desktop-first breakpoints: `md:` means "767px and below".
    screens: {
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
      xs: { max: "479px" },
    },
  },
  plugins: [],
} satisfies Config;
