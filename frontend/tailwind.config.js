/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors'); // Importa los colores de Tailwind

module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		width: {
  			'240px': '240px'
  		},
  		transitionProperty: {
  			'width': 'width'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      colors: {
        primary: colors.blue[500], // Cambia 'emerald' y el tono al color de Tailwind deseado
      },
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
