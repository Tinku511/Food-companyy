import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Fraunces', 'serif'],
      },
      colors: {
        background: '#F8F8F6',
        surface: '#FFFFFF',
        dark: '#181818',
        content: '#222222',
        muted: '#666666',
        brass: '#C6922D',
        'brass-hover': '#B8860B',
        plum: '#5A2D3B',
        success: '#2E7D32',
        warning: '#F59E0B',
        danger: '#D32F2F',
        border: '#E7E5E4',
        // Legacy mappings to prevent breaking UI before page redesigns
        foreground: '#222222',
        charcoal: '#181818',
      },
      boxShadow: {
        'brand-sm': '0 2px 8px rgba(184, 134, 11, 0.2)',
        'brand-md': '0 4px 20px rgba(184, 134, 11, 0.3)',
        'brand-lg': '0 8px 40px rgba(184, 134, 11, 0.4)',
        card: '0 4px 24px rgba(0,0,0,0.04)',
        'card-hover': '0 12px 32px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1F2B22 0%, #2a3b2e 40%, #172019 100%)',
        'brand-gradient': 'linear-gradient(135deg, #B8860B 0%, #d4a017 100%)',
        'green-gradient': 'linear-gradient(135deg, #5C2A3A 0%, #7a384d 100%)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease both',
        'slide-up': 'slideUp 0.6s ease both',
        'scale-in': 'scaleIn 0.4s ease both',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
