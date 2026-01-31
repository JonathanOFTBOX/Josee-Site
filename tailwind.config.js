/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdf8f6',
                    100: '#f2e8e5',
                    200: '#eaddd7',
                    300: '#e0cec7',
                    400: '#d2bab0',
                    500: '#a18072',
                    600: '#8b6f64',
                    700: '#735b52',
                    800: '#5e4a43',
                    900: '#483935',
                },
                rose: {
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    200: '#fecdd3',
                },
                // Modern 2027 accent colors
                accent: {
                    coral: '#ff6b6b',
                    peach: '#ffa07a',
                    gold: '#ffd700',
                    mint: '#98d8c8',
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 2s infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'gradient-shift': 'gradient-shift 8s ease infinite',
                'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'fade-in-up': 'fade-in-up 0.6s ease-out',
                'scale-in': 'scale-in 0.4s ease-out',
                'slide-in-right': 'slide-in-right 0.5s ease-out',
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(161, 128, 114, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(161, 128, 114, 0.6)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'bounce-gentle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'slide-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'blob': {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(161, 128, 114, 0.4)',
                'glow-lg': '0 0 40px rgba(161, 128, 114, 0.5)',
                'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
                '3d': '0 10px 30px -10px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'mesh-gradient': 'linear-gradient(135deg, #fdf8f6 0%, #ffe4e6 25%, #f2e8e5 50%, #fecdd3 75%, #fff1f2 100%)',
                'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            },
        },
    },
    plugins: [],
}
