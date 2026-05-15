/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0D1117',
        surface: '#161B22',
        'surface-elv': '#21262D',
        border: '#30363D',
        primary: '#2F81F7',
        'primary-dim': '#1A4A8A',
        'primary-subtle': '#112240',
        'text-primary': '#E6EDF3',
        'text-secondary': '#8B949E',
        'text-muted': '#484F58',
        correct: '#3FB950',
        'correct-subtle': '#0D2D14',
        incorrect: '#F85149',
        'incorrect-subtle': '#2D0D0D',
        warning: '#D29922',
        'warning-subtle': '#2D1F00',
        info: '#58A6FF',
        'mode-quiz': '#2F81F7',
        'mode-exam': '#A371F7',
        'mode-anatomy': '#3FB950',
        'mode-flashcard': '#FFB443',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        badge: '8px',
      },
    },
  },
  plugins: [],
};
