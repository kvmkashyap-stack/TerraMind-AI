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
        background: "#FBFBF8",
        foreground: "#1A2520",
        surface: {
          50: "#FFFFFF",
          100: "#FBFBF9",
          200: "#F5F7F3",
          300: "#EAEFE6",
          400: "#DFE7DA",
        },
        forest: {
          950: "#0B1D14",
          900: "#133022",
          800: "#1B4332",
          700: "#245842",
          600: "#2D6A4F",
          500: "#40916C",
          400: "#52B788",
          300: "#74C69D",
          200: "#B7E4C7",
          100: "#D8F3DC",
          50: "#EDFAF0",
        },
        water: {
          950: "#082133",
          900: "#0F3A53",
          800: "#1A5276",
          700: "#246B96",
          600: "#2E86B8",
          500: "#469EC7",
          400: "#6CB3D4",
          300: "#99CEE3",
          200: "#C8E6F3",
          100: "#E1F2FA",
          50: "#F0F8FD",
        },
        earth: {
          900: "#3D312A",
          800: "#57463C",
          700: "#755F51",
          600: "#8D7B68",
          500: "#A89682",
          400: "#C2B29F",
          300: "#DBCFBE",
          200: "#EBE3D7",
          100: "#F5EFE7",
          50: "#FAF7F2",
        },
        amberState: {
          900: "#78350F",
          800: "#92400E",
          700: "#B45309",
          600: "#D97706",
          500: "#F59E0B",
          400: "#FBBF24",
          200: "#FDE68A",
          100: "#FEF3C7",
          50: "#FFFBEB",
        },
        alertRed: {
          700: "#B91C1C",
          600: "#DC2626",
          500: "#EF4444",
          100: "#FEE2E2",
          50: "#FEF2F2",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(18, 48, 34, 0.05), 0 1px 2px rgba(18, 48, 34, 0.03)",
        soft: "0 4px 20px -2px rgba(19, 48, 34, 0.07), 0 2px 6px -1px rgba(19, 48, 34, 0.04)",
        elevated: "0 12px 32px -4px rgba(19, 48, 34, 0.1), 0 4px 12px -2px rgba(19, 48, 34, 0.05)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "topo-pattern": "radial-gradient(circle at 1px 1px, rgba(45, 106, 79, 0.07) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
