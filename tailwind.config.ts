/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
      extend: {
          keyframes: {
              spin: {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
              },
              progressBar: {
                  '0%': { width: '0%' },
                  '70%': { width: '70%' }
              }
          },
          animation: {
              spin: 'spin 300ms ease-in-out',
              progressBar: 'progressBar 0.1s ease-in-out'
          },
          colors: {
              //Site theme
              'primary-light': '#F0ECE5',
              'primary-medium-light': '#B6BBC4',
              'primary-dark': '#161A30',
              'primary-medium-dark': '#31304D',
              'dark-gray': 'hsla(0, 0%, 12%, 0.5)',
              'light-gray': 'hsla(0, 0%, 95%, 0.9)',
              'primary-dark-trasparent': 'hsla(0, 0%, 10%, 0.5)',
              'primary-light-transparent': 'hsla(0, 0%, 88%, 0.8)',
              'secondary-color': 'hsla(175, 74%, 70%, 0.5)',
              'illustration-color': 'hsl(177, 75%, 70%)',

              //table theme
              'light-gray-2': '#fafafa',
              'th-light': '#FAFAFA',
              'b-light': '#eaeaea',
              'b-dark': '#333333',
              'th-dark': '#000000',

              'warning-light': 'hsl(10, 70%, 40%)',
              'warning-medium': 'hsl(10, 70%, 30%)',
              'warning-dark': 'hsl(10, 70%, 20%)',
              'warning-dark-trasparent': 'hsla(10, 80%, 40%, 0.3)',

              'error-light': 'hsl(3, 80%, 40%)',
              'error-medium': 'hsl(3, 80%, 30%)',
              'error-dark': 'hsl(3, 80%, 20%)',
              'error-dark-trasparent': 'hsla(3, 80%, 50%, 0.3)'
          },

          boxShadow: {
              dropdown: '-5px 10px 20px hsla(175, 74%, 70%, 0.5)'
          }
      }
  },
}
