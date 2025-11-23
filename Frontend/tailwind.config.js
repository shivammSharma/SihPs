/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', /* warm-gray-200 */
        input: 'var(--color-input)', /* white */
        ring: 'var(--color-ring)', /* calming-sage */
        background: 'var(--color-background)', /* pure-canvas */
        foreground: 'var(--color-foreground)', /* gray-900 */
        primary: {
          DEFAULT: 'var(--color-primary)', /* deep-forest-green */
          foreground: 'var(--color-primary-foreground)', /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* warm-gold */
          foreground: 'var(--color-secondary-foreground)', /* gray-900 */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* muted-red */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* warm-cream */
          foreground: 'var(--color-muted-foreground)', /* gray-600 */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* calming-sage */
          foreground: 'var(--color-accent-foreground)', /* gray-900 */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* white */
          foreground: 'var(--color-popover-foreground)', /* gray-900 */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* subtle-green-surface */
          foreground: 'var(--color-card-foreground)', /* gray-900 */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* earthy-green */
          foreground: 'var(--color-success-foreground)', /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* warm-amber */
          foreground: 'var(--color-warning-foreground)', /* white */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* muted-red */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        /* Brand Specific Colors */
        'brand-gold': 'var(--color-brand-gold)', /* rich-gold */
        'brand-forest': 'var(--color-brand-forest)', /* deep-forest */
        'brand-sage': 'var(--color-brand-sage)', /* calming-sage */
        'brand-cream': 'var(--color-brand-cream)', /* warm-cream */
        'brand-ivory': 'var(--color-brand-ivory)', /* soft-ivory */
        'text-primary': 'var(--color-text-primary)', /* gray-900 */
        'text-secondary': 'var(--color-text-secondary)', /* gray-600 */
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'accent': ['Crimson Text', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'organic': 'var(--shadow-organic)',
        'elevated': 'var(--shadow-elevated)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'gentle-bounce': 'gentleBounce 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        gentleBounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
      },
      transitionTimingFunction: {
        'organic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}