import type { Config } from "tailwindcss";


export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        animation: {
            'gradient-x': 'gradient-x 6s ease infinite',
        },
        colors: {
            background: 'var(--background)',
            foreground: 'var(--foreground)',
            'pastel-blue': '#4f9dc9', // A soft blue color
            'pastel-yellow': '#fce38a', // Optional for accents
            'blue-light': '#dceefb',   // Light blue for backgrounds
            'blue-dark': '#1d4e89',    // Darker blue for text or borders
            'pastel-pink': '#ffafcc',
            'gold': '#ffd700',
            sidebar: {
                DEFAULT: 'hsl(var(--sidebar-background))',
                foreground: 'hsl(var(--sidebar-foreground))',
                primary: 'hsl(var(--sidebar-primary))',
                'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                accent: 'hsl(var(--sidebar-accent))',
                'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                border: 'hsl(var(--sidebar-border))',
                ring: 'hsl(var(--sidebar-ring))'
            }
        },
        borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)'
        },
        keyframes: {
            'gradient-x': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
            },
            'accordion-down': {
                from: {
                    height: '0'
                },
                to: {
                    height: 'var(--radix-accordion-content-height)'
                }
            },
            'accordion-up': {
                from: {
                    height: 'var(--radix-accordion-content-height)'
                },
                to: {
                    height: '0'
                }
            }
        },
		
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
