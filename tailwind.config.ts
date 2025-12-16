import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    // OBSIDIAN MONOLITH PROTOCOL: Remap all blue shades to zinc (greyscale)
    // This prevents any accidental blue usage across the entire codebase
    colors: {
      ...colors,
      // Remap saturated colors to greyscale - forces monochrome aesthetic
      blue: colors.zinc,
      indigo: colors.zinc,
      sky: colors.zinc,
      cyan: colors.zinc,
      // Keep these for system use
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      zinc: colors.zinc,
      gray: colors.gray,
      slate: colors.slate,
      neutral: colors.neutral,
      stone: colors.stone,
      red: colors.red,
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      lime: colors.lime,
      green: colors.green,
      emerald: colors.emerald,
      teal: colors.zinc, // Also remap teal
      violet: colors.zinc,
      purple: colors.zinc,
      fuchsia: colors.zinc,
      pink: colors.zinc,
      rose: colors.zinc,
    },
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
		fontFamily: {
			display: [
				'Space Grotesk',
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'sans-serif',
			],
			sans: [
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
				'Noto Color Emoji'
			],
			serif: [
				'Playfair Display',
				'ui-serif',
				'Georgia',
				'Cambria',
				'Times New Roman',
				'Times',
				'serif'
			],
			mono: [
				'JetBrains Mono',
				'ui-monospace',
				'SFMono-Regular',
				'Menlo',
				'Monaco',
				'Consolas',
				'Liberation Mono',
				'Courier New',
				'monospace'
			]
		},
		fontSize: {
			/* Apple Dynamic Type Scale */
			'large-title': ['34px', { lineHeight: '41px', fontWeight: '400' }],
			'title-1': ['28px', { lineHeight: '34px', fontWeight: '400' }],
			'title-2': ['22px', { lineHeight: '28px', fontWeight: '400' }],
			'title-3': ['20px', { lineHeight: '25px', fontWeight: '400' }],
			'headline': ['17px', { lineHeight: '22px', fontWeight: '600' }],
			'body-apple': ['17px', { lineHeight: '22px', fontWeight: '400' }],
			'callout': ['16px', { lineHeight: '21px', fontWeight: '400' }],
			'subheadline': ['15px', { lineHeight: '20px', fontWeight: '400' }],
			'footnote': ['13px', { lineHeight: '18px', fontWeight: '400' }],
			'caption-1': ['12px', { lineHeight: '16px', fontWeight: '400' }],
			'caption-2': ['11px', { lineHeight: '14px', fontWeight: '400' }],

			/* Legacy Typography (backward compatibility) */
			'heading-1': [
				'72px',
				{
					lineHeight: '1.05',
					fontWeight: '700'
				}
			],
			'heading-2': [
				'40px',
				{
					lineHeight: '1.15',
					fontWeight: '700'
				}
			],
			'heading-3': [
				'28px',
				{
					lineHeight: '1.2',
					fontWeight: '600'
				}
			],
			'body-text': [
				'18px',
				{
					lineHeight: '1.6',
					fontWeight: '400'
				}
			],
			'small-text': [
				'14px',
				{
					lineHeight: '1.4',
					fontWeight: '500'
				}
			],
			'micro-text': [
				'12px',
				{
					lineHeight: '1.4',
					fontWeight: '400'
				}
			],
			hero: [
				'6rem',
				{
					lineHeight: '1.05',
					letterSpacing: '-0.02em',
					fontWeight: '800'
				}
			],
			h1: [
				'5rem',
				{
					lineHeight: '1.05',
					letterSpacing: '-0.02em',
					fontWeight: '700'
				}
			],
			h2: [
				'3rem',
				{
					lineHeight: '1.15',
					letterSpacing: '-0.01em',
					fontWeight: '700'
				}
			],
			h3: [
				'1.75rem',
				{
					lineHeight: '1.2',
					fontWeight: '600'
				}
			],
			body: [
				'1.25rem',
				{
					lineHeight: '1.6',
					fontWeight: '400'
				}
			],
			label: [
				'0.875rem',
				{
					lineHeight: '1.5',
					fontWeight: '500'
				}
			]
		},
  		spacing: {
  			section: '128px',
  			group: '96px',
  			card: '64px',
  			content: '32px',
  			inner: '16px',
  			tight: '8px'
  		},
		colors: {
			/* Apple Semantic Colors */
			label: 'hsl(var(--label))',
			'secondary-label': 'hsl(var(--secondary-label))',
			'tertiary-label': 'hsl(var(--tertiary-label))',
			'quaternary-label': 'hsl(var(--quaternary-label))',
			
			'fill-primary': 'hsl(var(--fill-primary))',
			'fill-secondary': 'hsl(var(--fill-secondary))',
			'fill-tertiary': 'hsl(var(--fill-tertiary))',
			
			'system-gray': 'hsl(var(--system-gray))',
			'system-gray-2': 'hsl(var(--system-gray-2))',
			'system-gray-3': 'hsl(var(--system-gray-3))',
			'system-gray-4': 'hsl(var(--system-gray-4))',
			'system-gray-5': 'hsl(var(--system-gray-5))',
			'system-gray-6': 'hsl(var(--system-gray-6))',
			
			'system-blue': 'hsl(var(--system-blue))',
			'system-green': 'hsl(var(--system-green))',
			'system-red': 'hsl(var(--system-red))',
			'system-orange': 'hsl(var(--system-orange))',
			'system-yellow': 'hsl(var(--system-yellow))',
			'system-teal': 'hsl(var(--system-teal))',
			'system-indigo': 'hsl(var(--system-indigo))',
			
			'system-background': 'hsl(var(--system-background))',
			'secondary-system-background': 'hsl(var(--secondary-system-background))',
			'tertiary-system-background': 'hsl(var(--tertiary-system-background))',
			
			'grouped-background': 'hsl(var(--grouped-background))',
			'secondary-grouped-background': 'hsl(var(--secondary-grouped-background))',
			'tertiary-grouped-background': 'hsl(var(--tertiary-grouped-background))',
			
			separator: 'hsl(var(--separator))',
			'opaque-separator': 'hsl(var(--opaque-separator))',
			
			/* UTM Parameter Colors */
			'utm-source': 'hsl(var(--utm-source))',
			'utm-medium': 'hsl(var(--utm-medium))',
			'utm-campaign': 'hsl(var(--utm-campaign))',
			'utm-term': 'hsl(var(--utm-term))',
			'utm-content': 'hsl(var(--utm-content))',

			/* Legacy Colors (backward compatibility) */
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
			},
		chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
			},
			/* Obsidian System Color Tokens */
			obsidian: {
				bg: 'hsl(var(--obsidian-bg))',
				surface: 'hsl(var(--obsidian-surface))',
				elevated: 'hsl(var(--obsidian-elevated))',
				border: 'hsl(var(--obsidian-border))',
				'border-light': 'hsl(var(--obsidian-border-light))',
				'text-primary': 'hsl(var(--obsidian-text-primary))',
				'text-secondary': 'hsl(var(--obsidian-text-secondary))',
				'text-muted': 'hsl(var(--obsidian-text-muted))',
			},
			mirage: {
				DEFAULT: 'hsl(var(--mirage))',
				foreground: 'hsl(var(--mirage) / 0.9)'
			},
			blazeOrange: {
				DEFAULT: 'hsl(var(--blaze-orange))',
				light: 'hsl(var(--blaze-orange) / 0.1)',
				medium: 'hsl(var(--blaze-orange) / 0.2)'
			},
			deepSea: {
				DEFAULT: 'hsl(var(--deep-sea))',
				light: 'hsl(var(--deep-sea) / 0.1)',
				medium: 'hsl(var(--deep-sea) / 0.2)'
			},
			wildSand: {
				DEFAULT: 'hsl(var(--wild-sand))',
				dark: 'hsl(var(--wild-sand) / 0.5)'
			}
		},
  		backgroundImage: {
  			'gradient-primary': 'var(--gradient-primary)',
  			'gradient-secondary': 'var(--gradient-secondary)',
  			'gradient-hero': 'var(--gradient-hero)',
  			'gradient-nature-1': 'var(--gradient-nature-1)',
  			'gradient-nature-2': 'var(--gradient-nature-2)',
  			'gradient-nature-3': 'var(--gradient-nature-3)',
  			'gradient-nature-4': 'var(--gradient-nature-4)',
			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
  		},
  		boxShadow: {
  			sm: 'var(--shadow-sm)',
  			DEFAULT: 'var(--shadow)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)'
  		},
  		borderRadius: {
  			'3xl': '1.5rem',    /* 24px - Large cards, dialogs */
  			'2xl': '1rem',      /* 16px - Standard cards */
  			'xl': '0.75rem',    /* 12px - Buttons, inputs */
  			'lg': '0.5rem',     /* 8px - Small elements */
  			'md': '0.375rem',   /* 6px - Chips, badges */
  			'sm': '0.25rem'     /* 4px - Tiny elements */
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'fade-in-up': {
  				'0%': { opacity: '0', transform: 'translateY(20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'glow-pulse': {
  				'0%, 100%': { boxShadow: '0 0 20px rgba(255,255,255,0.2)' },
  				'50%': { boxShadow: '0 0 40px rgba(255,255,255,0.4)' }
  			},
  			'radar-pulse': {
  				'0%': { r: '10', opacity: '0.6' },
  				'100%': { r: '60', opacity: '0' }
  			},
  			// Dropdown-specific animations (CSS-only, GPU accelerated)
  			'fade-in-dropdown': {
  				'0%': { opacity: '0', transform: 'translateY(10px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'node-pulse': {
  				'0%, 100%': { opacity: '0.4' },
  				'50%': { opacity: '0.8' }
  			},
  			'node-pulse-scale': {
  				'0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
  				'50%': { opacity: '1', transform: 'scale(1.1)' }
  			},
  			'path-pulse': {
  				'0%, 100%': { strokeOpacity: '0.2' },
  				'50%': { strokeOpacity: '0.5' }
  			},
  			'data-wiggle': {
  				'0%, 100%': { transform: 'translateX(0)' },
  				'50%': { transform: 'translateX(2px)' }
  			},
  			'flow-dot': {
  				'0%, 100%': { opacity: '0.2', transform: 'translateX(0)' },
  				'50%': { opacity: '1', transform: 'translateX(4px)' }
  			},
  			'halo-wave': {
  				'0%, 100%': { opacity: '0.5', transform: 'translate(-50%, 0) scale(1)' },
  				'50%': { opacity: '0', transform: 'translate(-50%, 0) scale(1.2)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
  			// Dropdown animations
  			'fade-in-dropdown': 'fade-in-dropdown 0.3s ease-out forwards',
  			'node-pulse': 'node-pulse 2s ease-in-out infinite',
  			'node-pulse-scale': 'node-pulse-scale 2s ease-in-out infinite',
  			'path-pulse': 'path-pulse 1.5s ease-in-out infinite',
  			'data-wiggle': 'data-wiggle 0.8s ease-in-out infinite',
  			'flow-dot': 'flow-dot 1.2s ease-in-out infinite',
  			'halo-wave': 'halo-wave 2s ease-in-out infinite'
  		},
  		transitionDuration: {
  			apple: '200ms',
  			'apple-slow': '240ms'
  		},
  		transitionTimingFunction: {
  			apple: 'cubic-bezier(0.4, 0, 0.2, 1)'
  		},
  		scale: {
  			'101': '1.01',
  			'102': '1.02',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
