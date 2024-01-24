/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        lusitana: ["Lusitana", "serif"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        rafa: colors.indigo[500],
        jess: colors.rose[500],
        beige: colors.slate[500],
        dark: colors.slate[900],
        light: colors.slate[100],
      },
    },
  },
  plugins: [],
};
export default config;
