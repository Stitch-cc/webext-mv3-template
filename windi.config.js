import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

export default defineConfig({
  // darkMode: 'class', // or 'media'
  extract: {
    include: ['**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git'],
  },
  attributify: true,
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        gray: colors.coolGray,
        red: colors.rose,
        pink: colors.fuchsia,
        current: '#4BB449'
      },
      fontSize: {
        'xs': '13px',
        'sm': '14px',
        'base': '16px',
      },
      borderRadius: {
        md: '0.25rem',
      }
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        body: { fontFamily: "Roboto" },
      })
    })
  ],
})