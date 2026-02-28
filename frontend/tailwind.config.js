/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F7FFF',
          50: '#EBF0FF',
          100: '#D6E0FF',
          500: '#4F7FFF',
          600: '#3A6BFF',
          700: '#2557FF',
        },
        secondary: {
          DEFAULT: '#A6E3A1',
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#A6E3A1',
          600: '#86EFAC',
        },
        feedback: {
          DEFAULT: '#FFD166',
          50: '#FFFBEB',
          500: '#FFD166',
        },
        neutral: {
          DEFAULT: '#F5F7FA',
          50: '#F5F7FA',
          100: '#E8ECF0',
          900: '#1A1A2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
      animation: {
        'pulse-scale': 'pulseScale 0.4s ease-in-out',
        'bounce-in': 'bounceIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        pulseScale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
