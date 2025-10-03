
import type { Config } from "tailwindcss";
// Fix: Use ES module import instead of require for TypeScript compatibility.
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(190 100% 24%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(240 10% 3.9%)',
        primary: {
          DEFAULT: 'hsl(190 100% 24%)', // #006d77
          foreground: 'hsl(0 0% 98%)', // #fafafa
        },
        secondary: {
          DEFAULT: 'hsl(208 100% 97.1%)', // #f0f8ff
          foreground: 'hsl(240 5.9% 10%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: 'hsl(0 0% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(208 100% 97.1%)',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
        accent: {
          DEFAULT: 'hsl(190 30% 75%)',
          foreground: 'hsl(240 5.9% 10%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(240 10% 3.9%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(240 10% 3.9%)',
        },
      },
      borderRadius: {
        lg: `0.5rem`,
        md: `calc(0.5rem - 2px)`,
        sm: `calc(0.5rem - 4px)`,
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "kenburns": {
          '0%': { transform: 'scale(1.05) translate(0, 0)', 'transform-origin': 'center center' },
          '100%': { transform: 'scale(1.2) translate(-1%, 1%)', 'transform-origin': 'center center' },
        },
        "fade-in": {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        "scroll": {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        "progress-bar": {
          'from': { transform: 'scaleX(0)' },
          'to': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "kenburns": "kenburns 25s ease-out alternate infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "scroll": "scroll 40s linear infinite",
        "progress-bar": "progress-bar 7s linear",
      },
    },
  },
  plugins: [
    typography,
  ],
};
export default config;
