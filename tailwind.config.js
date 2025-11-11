/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pinterest: {
          primary: '#2383E2',
          'primary-hover': '#1A6EC1',
          red: '#E60023',
          'red-hover': '#AD081B',
          black: '#111111',
          gray: '#767676',
          'light-gray': '#EFEFEF',
        },
      },
    },
  },
  plugins: [],
}
