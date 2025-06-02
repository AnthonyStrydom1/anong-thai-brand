
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
				// ANONG Brand Colors - Premium Thai Aesthetic
				"anong": {
					// Core Brand Colors (based on CMYK values provided)
					"black": "#1a1a1a",        // Deep Charcoal Black (CMYK: 60,50,50,100)
					"gold": "#d4af37",         // Gold Accent (CMYK: 30,35,70,10)
					"ivory": "#f8f4ed",        // Thai Ivory (CMYK: 4,6,12,0)
					"deep-green": "#2b3d2f",   // Herbal Green (CMYK: 64,39,85,33)
					
					// Supporting palette for depth and variation
					"warm-yellow": "#e1b066",   // Lighter gold variation
					"sage": "#9db5a1",          // Muted green for accents
					"charcoal": "#2c2c2c",      // Rich charcoal for text
					"cream": "#faf8f5",         // Softer ivory for backgrounds
				},
				
				// Legacy colors maintained for compatibility
				"thai-purple": {
					light: "#2b3d2f",
					DEFAULT: "#1a1a1a",
					dark: "#1a1a1a"
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
				// ANONG Brand Typography
				'heading': ['Playfair Display', 'serif'],    // Elegant headings
				'body': ['Lato', 'sans-serif'],              // Clean body text
				'display': ['Playfair Display', 'serif'],    // Display text
				
				// Legacy fonts maintained for compatibility
				'serif': ['Playfair Display', 'serif'],
				'sans': ['Lato', 'sans-serif'],
				'elegant': ['Playfair Display', 'serif'],
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
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-in-out',
				'slide-in': 'slide-in 0.4s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite'
			},
			backgroundImage: {
				'anong-gradient': 'linear-gradient(135deg, #f8f4ed 0%, #faf8f5 100%)',
				'anong-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
				'anong-gold': 'linear-gradient(135deg, #d4af37 0%, #e1b066 100%)',
				'thai-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23d4af37\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M30 15c0 0-8 8-8 15s8 15 8 15 8-8 8-15-8-15-8-15z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require('tailwindcss-bg-patterns'),
	],
} satisfies Config;
