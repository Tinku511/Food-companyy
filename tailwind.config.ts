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
        background: '#FAF8F4',
        surface: '#FFFFFF',
        dark: '#1F1F1F',
        content: '#1F1F1F',
        muted: '#666666',
        brass: '#C6922D',
        'brass-hover': '#B8860B',
        forest: '#23422F',
        wine: '#5B3142',
        border: '#E8E5DF',
        'light-section': '#F4F1EA',
        success: '#2E7D32',
        warning: '#F59E0B',
        danger: '#D32F2F',
        // Legacy mappings to prevent breaking UI before page redesigns
        foreground: '#1F1F1F',
        charcoal: '#1F1F1F',
        plum: '#5B3142',
      },
      boxShadow: {
        'brand-sm': '0 2px 8px rgba(198, 146, 45, 0.1)',
        'brand-md': '0 4px 20px rgba(198, 146, 45, 0.15)',
        'brand-lg': '0 8px 40px rgba(198, 146, 45, 0.2)',
        card: '0 4px 24px rgba(0,0,0,0.03)',
        'card-hover': '0 16px 40px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #23422F 0%, #1c3525 40%, #15271c 100%)',
        'brand-gradient': 'linear-gradient(135deg, #C6922D 0%, #B8860B 100%)',
        'green-gradient': 'linear-gradient(135deg, #5B3142 0%, #462633 100%)',
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
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        maskUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease both',
        'slide-up': 'slideUp 0.6s ease both',
        'scale-in': 'scaleIn 0.4s ease both',
        float: 'float 3s ease-in-out infinite',
        marquee: 'marquee 25s linear infinite',
        'mask-up': 'maskUp 1s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
