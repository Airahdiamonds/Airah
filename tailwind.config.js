/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "Poppins", "sans-serif"],
      serif: ['"Playfair Display"', "Georgia", "serif"],
      display: ['"Playfair Display"', "Georgia", "serif"],
    },
    extend: {
      colors: {
        ivory: "#FAFAF9",
        onyx: "#1C1917",
        "onyx-soft": "#44403C",
        "onyx-mute": "#78716C",
        champagne: "#A16207",
        "champagne-light": "#CA8A04",
        "champagne-soft": "#D4A95E",
        hairline: "#E7E5E4",
      },
      letterSpacing: {
        luxe: "0.18em",
        wider2: "0.24em",
      },
      animation: {
        gradient: "gradientBG 5s linear infinite",
      },
      keyframes: {
        gradientBG: {
          "0%": { backgroundPosition: "0% 50%" },
          "25%": { backgroundPosition: "50% 100%" },
          "50%": { backgroundPosition: "100% 50%" },
          "75%": { backgroundPosition: "50% 0%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};

  