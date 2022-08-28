/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  important: true,
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'off-white': '#f2f2f2',
      'light-gray': '#dfdfdf',
      'gray': '#bdbdbd',
      'dark-gray': '#7e7e7e',
      'white': '#fff',
      'black': '#4f4f4f',
      'pure-black': '#000',
      'blue': '#2D9CDB',
      'red': '#FF0000',
    },
    extend: {
      boxShadow: {
        'inner-lg': 'inset 0px 0px 8px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [
    function({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },
  ],
  prefix: 'tw-',
}
