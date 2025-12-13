import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          hover: '#E55A28',
        },
        secondary: {
          DEFAULT: '#004E89',
          hover: '#003D6E',
        },
        accent: {
          DEFAULT: '#FFD23F',
          secondary: '#06FFA5',
        },
        background: '#FFFEF7',
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F8F9FA',
        },
        text: {
          DEFAULT: '#0A0A0A',
          muted: '#5A5A5A',
        },
        border: '#0A0A0A',
        success: '#06FFA5',
        error: '#FF3B30',
        warning: '#FFD23F',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '3px 3px 0px rgba(10, 10, 10, 1)',
        'brutal-md': '6px 6px 0px rgba(10, 10, 10, 1)',
        'brutal-lg': '10px 10px 0px rgba(10, 10, 10, 1)',
        'brutal-xl': '12px 12px 0px rgba(10, 10, 10, 1)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'modal-slide-up': 'modalSlideUp 0.3s ease-out',
        'spin': 'spin 0.8s linear infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'chart-bar-grow': 'chartBarGrow 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        modalSlideUp: {
          'from': { opacity: '0', transform: 'translateY(50px) scale(0.95)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        chartBarGrow: {
          'from': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          'to': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}

export default config
