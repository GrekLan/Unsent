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
        licorice: "#1F151C",
        "licorice-light": "#2a1e26",
        cappuccino: "#58382B",
        "cappuccino-light": "#6d4a3b",
        paleviolet: "#C56F8C",
        "paleviolet-light": "#d98ba3",
        antiquewhite: "#FEEDDB",
      },
      animation: {
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        "sparkle-delay": "sparkle 2s ease-in-out 0.5s infinite",
        "sparkle-delay-2": "sparkle 2.5s ease-in-out 1s infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-up-delay":
          "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards",
        "fade-up-delay-2":
          "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards",
        "fade-up-delay-3":
          "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.45s forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "border-rotate": "border-rotate 4s linear infinite",
        "slide-in-right":
          "slide-in-right 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-left":
          "slide-in-left 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1) rotate(180deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "border-rotate": {
          "0%": { "--border-angle": "0deg" },
          "100%": { "--border-angle": "360deg" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow":
          "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(197,111,140,0.15) 0%, transparent 70%)",
        "card-glow":
          "radial-gradient(ellipse at 50% 0%, rgba(197,111,140,0.08) 0%, transparent 60%)",
      },
      boxShadow: {
        "glow-sm": "0 0 15px -3px rgba(197,111,140,0.3)",
        glow: "0 0 25px -5px rgba(197,111,140,0.3)",
        "glow-lg": "0 0 50px -5px rgba(197,111,140,0.25)",
        "inner-glow": "inset 0 1px 0 0 rgba(254,237,219,0.05)",
        "soft": "0 18px 50px -24px rgba(0,0,0,0.65)",
        "glass": "0 0 0 1px rgba(254,237,219,0.04), 0 18px 50px -24px rgba(0,0,0,0.65)",
      },
    },
  },
  plugins: [],
};
export default config;
