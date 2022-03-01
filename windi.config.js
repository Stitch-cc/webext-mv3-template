import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

export default defineConfig({
  // darkMode: 'class', // or 'media'
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
      borderRadius: {
        md: '0.25rem',
      }
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      const buttons = {
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '600',
          cursor: 'pointer',
        },
        '.btn-primary': {
          'backgroundColor': '#3490dc',
          'color': '#fff',
          '&:hover': {
            backgroundColor: '#2779bd',
          },
        },
        '.btn-red': {
          'backgroundColor': '#e3342f',
          'color': '#fff',
          '&:hover': {
            backgroundColor: '#cc1f1a',
          },
        },
      }
      addComponents(buttons)
    }),
    plugin(({ addBase, theme }) => {
      addBase({
        body: { fontFamily: "Roboto" },
      })
    })
  ],
})