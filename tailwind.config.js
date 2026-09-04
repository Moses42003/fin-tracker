/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,tsx,jsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#15183D",
        navy: {
          DEFAULT: "#202354",
          deep: "#15183D",
          soft: "#2D316B",
        },
        violet: {
          DEFAULT: "#7567E8",
          light: "#EEEAFE",
          dark: "#574BC7",
        },
        mint: {
          DEFAULT: "#2DBD97",
          light: "#E1F7F0",
          dark: "#168D70",
        },
        coral: {
          DEFAULT: "#F27672",
          light: "#FDE9E7",
          dark: "#D8575B",
        },
        amber: {
          DEFAULT: "#F5A623",
          light: "#FFF2D8",
          dark: "#C77B00",
        },
        sky: {
          DEFAULT: "#4D8DEB",
          light: "#E7F0FF",
          dark: "#2868C2",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F6FA",
          tint: "#FAFBFD",
        },
        slate: {
          DEFAULT: "#7D8299",
          light: "#B8BDCC",
          dark: "#454A65",
        },
        line: "#E4E6EF",
      },
    },
  },
  plugins: [],
};
