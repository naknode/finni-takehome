/** @type {import('tailwindcss').Config} */
export default {
  content: ['node_modules/preline/dist/*.js', './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [require('preline/plugin')]
}
