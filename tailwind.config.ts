import { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

import { colors, cssVars, fontFamily, typography } from './src/theme/config'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
  plugins: [
    plugin(({ addBase }) =>
      addBase({
        ':root': {
          ...cssVars.light,
        },
        '.dark:root': {
          ...cssVars.dark,
        },
        ["[data-theme='dark']:root"]: {
          ...cssVars.dark,
        },
      }),
    ),

    plugin(({ addComponents }) => {
      addComponents(typography)
    }),
  ],
}

export default config
