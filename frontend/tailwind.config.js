/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      slate: colors.slate,
      red: colors.red,
      pink: colors.pink,
      purple: colors.purple,
      orange: colors.orange,
      cyan: colors.cyan,
      teal: colors.teal,
      lime: colors.lime,
      amber: colors.amber,
      rose: colors.rose,
      fuchsia: colors.fuchsia,
      violet: colors.violet,
      sky: colors.sky,
      lightGreen: colors.lightGreen,
      'auth': {
        primary: '#4335A7',
        secondary: '#80C4E9',
        neutral: {
          DEFAULT: '#79777B',
          100: '#D9D9D9',
        }
      }
    },
  },
  plugins: [],
}
