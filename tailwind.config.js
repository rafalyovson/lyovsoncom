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
        rafa: "#006D77",
        jess: "#FF6B6B",
        beige: "#A99985",
        dark: "#303030",
        light: "#FDFDFD",
      },
    },
  },
  plugins: [],
};
export default config;
