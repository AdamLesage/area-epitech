/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    fontFamily: {
      sans: ['geist', 'sans-serif'],
    },
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
        secondary: {
          DEFAULT: '#80C4E9',
        },
        tertiary: {
          DEFAULT: '#FF7F3E',
        },
        neutral: {
          DEFAULT: '#79777B',
          100: '#D9D9D9',
        }
      },
      'home': {
        DEFAULT: '#1C1C53',
        text: {
          DEFAULT: '#4C4CDC',
          light: '#B4B4F2',
        },
        div: '#13134C',
        light: '#373779',
        hover: '#131340',
      }
    },
    extend: {
      screens: {
          mobile: { max: '768px' },
          web: { min: '769px' },
          half: { max: '1024px' },
      },
    },
  },
  plugins: [],
}
