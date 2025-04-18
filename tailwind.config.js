/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5D3FD3', // Purple as primary color
          dark: '#4B32A8',
          light: '#7051E0',
        },
        secondary: {
          DEFAULT: '#FF6B6B', // Coral red as secondary color
          dark: '#E05858',
          light: '#FF8585',
        },
        accent: {
          DEFAULT: '#00BFA6', // Teal as accent color
          dark: '#00A18F',
          light: '#00D8BC',
        },
        background: {
          DEFAULT: '#F5F7FA',
          dark: '#E1E5EB',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to right, #5D3FD3, #00BFA6)',
      },
    },
  },
  plugins: [],
} 