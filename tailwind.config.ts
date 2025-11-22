import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: [
  				'Inter',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			// Apple Design System - Exact typography scale
  			'heading-1': ['72px', { lineHeight: '1.05', fontWeight: '700' }],
  			'heading-2': ['40px', { lineHeight: '1.15', fontWeight: '700' }],
  			'heading-3': ['28px', { lineHeight: '1.2', fontWeight: '600' }],
  			'body-text': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
  			'small-text': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
  			'micro-text': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
  			
  			// Legacy sizes for compatibility
  			hero: ['6rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
  			h1: ['5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
  			h2: ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
  			h3: ['1.75rem', { lineHeight: '1.2', fontWeight: '600' }],
  			body: ['1.25rem', { lineHeight: '1.6', fontWeight: '400' }],
  			label: ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }]
  		},
  		spacing: {
  			// Apple spacing system
  			'section': '128px',    // Section padding
  			'group': '96px',       // Between large groups
  			'card': '64px',        // Between cards
  			'content': '32px',     // Between content blocks
  			'inner': '16px',       // Inner padding
  			'tight': '8px',        // Tight elements
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				hover: 'hsl(var(--primary-hover))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  				hover: 'hsl(var(--secondary-hover))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
  				teal: 'hsl(var(--accent-teal))',
  				'yellow-green': 'hsl(var(--accent-yellow-green))',
  				mint: 'hsl(var(--accent-mint))',
  				forest: 'hsl(var(--accent-forest))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
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
  		backgroundImage: {
  			'gradient-primary': 'var(--gradient-primary)',
  			'gradient-secondary': 'var(--gradient-secondary)',
  			'gradient-hero': 'var(--gradient-hero)',
  			'gradient-nature-1': 'var(--gradient-nature-1)',
  			'gradient-nature-2': 'var(--gradient-nature-2)',
  			'gradient-nature-3': 'var(--gradient-nature-3)',
  			'gradient-nature-4': 'var(--gradient-nature-4)'
  		},
  		boxShadow: {
  			'sm': 'var(--shadow-sm)',
  			'DEFAULT': 'var(--shadow)',
  			'lg': 'var(--shadow-lg)',
  			'xl': 'var(--shadow-xl)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
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
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		transitionDuration: {
  			'apple': '200ms',
  			'apple-slow': '240ms',
  		},
  		transitionTimingFunction: {
  			'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
