
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
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
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// New ANONG Brand Colors
				"anong": {
					"black": "#000000",
					"gold": "#d4af37",
					"ivory": "#f8f4ed",
					"deep-green": "#2b3d2f",
					"warm-yellow": "#e1b066",
					// Legacy colors for compatibility
					"dark-green": "#2b3d2f",
					"forest": "#2d5a3d", 
					"cream": "#f8f4ed",
					"warm-cream": "#f8f4ed",
					"charcoal": "#2c2c2c",
					"deep-black": "#000000",
					"curry-red": "#8b2635",
					"spice-red": "#a53c48",
					"warm-gold": "#e1b066",
					"sage": "#9db5a1",
					"earth": "#8d7b68"
				},
				// Thai brand colors updated to match ANONG
				"thai-purple": {
					light: "#2b3d2f",
					DEFAULT: "#000000",
					dark: "#000000"
				},
				"thai-gold": "#d4af37",
				"thai-ivory": "#f8f4ed"
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				// New ANONG typography
				'serif': ['Playfair Display', 'serif'],
				'display': ['Playfair Display', 'serif'],
				'elegant': ['Playfair Display', 'serif'],
				// Clean sans-serif for body text
				'body': ['Inter', 'sans-serif'],
				'sans': ['Inter', 'sans-serif'],
				// Legacy fonts maintained for compatibility
				'thai': ['Sriracha', 'sans-serif'],
				'sarabun': ['Sarabun', 'sans-serif']
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
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-in-out',
				'slide-in': 'slide-in 0.4s ease-out',
				'float': 'float 6s ease-in-out infinite'
			},
			backgroundImage: {
				'premium-gradient': 'linear-gradient(135deg, #f8f4ed 0%, #f0ead6 100%)',
				'dark-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
				'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #e1b066 100%)',
				'lotus-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23d4af37\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M30 15c0 0-8 8-8 15s8 15 8 15 8-8 8-15-8-15-8-15z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require('tailwindcss-bg-patterns'),
	],
} satisfies Config;
