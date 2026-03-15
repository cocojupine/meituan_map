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
        'brand-primary': '#FFC300',
        'surface': '#FFFFFF',
        'background': '#F4F5F7',
        'text-primary': '#111111',
        'text-secondary': '#666666',
        'price-highlight': '#FF4A26',
      },
      boxShadow: {
        'card-main': '0 20px 40px -15px rgba(0,0,0,0.1)',
        'bottom-bar': '0 -10px 30px rgba(0,0,0,0.05)',
      },
      backgroundImage: {
        'meituan-gradient': 'linear-gradient(to top right, #FFD000, #FFC300)',
      },
      letterSpacing: {
        tight: '-0.025em',
      },
    },
  },
  plugins: [],
};
export default config;
