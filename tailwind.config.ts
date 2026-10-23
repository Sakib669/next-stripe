import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: "#0000F2",
          hover: "#0000CC",
          light: "#EEF2FF",
        },
      },
    },
  },
  plugins: [],
};
export default config;
