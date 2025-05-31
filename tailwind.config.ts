
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
				// Premium ANONG Brand Colors updated with burgundy
				"anong": {
					"dark-green": "#7a1f2e",
					"forest": "#912838", 
					"cream": "#f7f3e9",
					"warm-cream": "#f2ede3",
					"charcoal": "#2c2c2c",
					"deep-black": "#1a1a1a",
					"curry-red": "#8b2635",
					"spice-red": "#a53c48",
					"gold": "#d4a574",
					"warm-gold": "#e2b887",
					"sage": "#9db5a1",
					"earth": "#8d7b68"
				},
				// Updated thai brand colors to match ANONG aesthetic with burgundy
				"thai-purple": {
					light: "#912838",
					DEFAULT: "#7a1f2e",
					dark: "#5f1722"
				},
				"thai-gold": "#d4a574",
				"thai-ivory": "#f7f3e9"
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				// Premium serif fonts for headings
				'display': ['Crimson Text', 'Libre Baskerville', 'serif'],
				'elegant': ['Cormorant Garamond', 'serif'],
				'serif': ['Lora', 'serif'],
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
				'premium-gradient': 'linear-gradient(135deg, #f7f3e9 0%, #f2ede3 100%)',
				'dark-gradient': 'linear-gradient(135deg, #1a3d2e 0%, #2d5a3d 100%)',
				'gold-gradient': 'linear-gradient(135deg, #d4a574 0%, #e2b887 100%)',
				'botanical-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23d4a574\" fill-opacity=\"0.08\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
			},
			patterns: {
				'wavy': {
					'bg-size': '20px 20px',
					'bg-image': `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10c2.5 0 5-2.5 5-5s2.5-5 5-5 5 2.5 5 5 2.5 5 5 5 5-2.5 5-5 2.5-5 5-5 5 2.5 5 5-2.5 5-5 5-5-2.5-5-5-2.5-5-5-5-5 2.5-5 5-2.5 5-5 5-5-2.5-5-5 2.5-5 5-5z' fill='%23d4a574' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
				},
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require('tailwindcss-bg-patterns'),
	],
} satisfies Config;
