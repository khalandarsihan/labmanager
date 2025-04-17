/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"../labmanager/templates/**/*.html",
		"../labmanager/www/**/*.html",
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				sm: "2rem",
			},
			screens: {
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// Custom gradient colors
				gradient: {
					from: "#222222",
					via: "#333333",
					to: "#444444",
				},
			},
			fontFamily: {
				arabic: ["Amiri", "Scheherazade New", "serif"],
				serif: ["Playfair Display", "serif"],
				sans: ["Inter", "system-ui", "sans-serif"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			animation: {
				"float-up": "floatUp 4s ease-in-out infinite",
				"float-up-slow": "floatUpSlow 6s ease-in-out infinite",
				"float-diagonal": "floatDiagonal 7s ease-in-out infinite",
				"float-diagonal-reverse": "floatDiagonalReverse 5s ease-in-out infinite",
				"float-side": "floatSide 8s ease-in-out infinite",
				"float-circle": "floatCircle 12s linear infinite",
				rotate: "rotate 10s linear infinite",
				"pulse-slow": "pulse 6s ease-in-out infinite",
				// New animations for decorative elements
				"float-slow": "float-slow 5s ease-in-out infinite",
				"float-very-slow": "float-very-slow 10s ease-in-out infinite",
				pulse: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			keyframes: {
				floatUp: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-40px)" },
				},
				floatUpSlow: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-20px)" },
				},
				floatDiagonal: {
					"0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
					"50%": { transform: "translate(30px, -30px) rotate(5deg)" },
				},
				floatDiagonalReverse: {
					"0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
					"50%": { transform: "translate(-30px, -30px) rotate(-5deg)" },
				},
				floatSide: {
					"0%, 100%": { transform: "translateX(0)" },
					"50%": { transform: "translateX(30px)" },
				},
				floatCircle: {
					"0%": { transform: "rotate(0deg) translateX(20px) rotate(0deg)" },
					"100%": { transform: "rotate(360deg) translateX(20px) rotate(-360deg)" },
				},
				rotate: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				// New keyframes for decorative elements
				"float-slow": {
					"0%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
					"100%": { transform: "translateY(0)" },
				},
				"float-very-slow": {
					"0%": { transform: "translateY(0) rotate(0deg)" },
					"25%": { transform: "translateY(-5px) rotate(1deg)" },
					"50%": { transform: "translateY(-10px) rotate(2deg)" },
					"75%": { transform: "translateY(-5px) rotate(1deg)" },
					"100%": { transform: "translateY(0) rotate(0deg)" },
				},
				pulse: {
					"0%, 100%": { opacity: 1 },
					"50%": { opacity: 0.5 },
				},
			},
			backgroundImage: {
				"geometric-pattern": "url('/assets/labmanager/images/geometric-pattern.png')",
				"light-pattern": "url('/assets/labmanager/images/light-pattern.png')",
				"dark-pattern": "url('/assets/labmanager/images/dark-pattern.png')",
			},
			transitionProperty: {
				width: "width",
				height: "height",
				spacing: "margin, padding",
			},
			boxShadow: {
				"inner-light": "inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)",
				"glow-amber": "0 0 15px rgba(251, 191, 36, 0.4)",
				"glow-purple": "0 0 15px rgba(124, 58, 237, 0.4)",
			},
			// Mobile-specific utilities
			screens: {
				xs: "480px",
				// Keep defaults for sm, md, lg, xl, 2xl
			},
			spacing: {
				"safe-top": "env(safe-area-inset-top)",
				"safe-bottom": "env(safe-area-inset-bottom)",
				"safe-left": "env(safe-area-inset-left)",
				"safe-right": "env(safe-area-inset-right)",
				// New spacing values for decorative elements
				"1/5": "20%",
				"2/5": "40%",
				"3/5": "60%",
				"4/5": "80%",
				"1/6": "16.666667%",
				"5/6": "83.333333%",
			},
		},
	},
	plugins: [
		// Add any plugins if needed
		function ({ addUtilities }) {
			const newUtilities = {
				".no-scrollbar::-webkit-scrollbar": {
					display: "none",
				},
				".no-scrollbar": {
					"-ms-overflow-style": "none",
					"scrollbar-width": "none",
				},
				".safe-paddings": {
					"padding-top": "env(safe-area-inset-top)",
					"padding-bottom": "env(safe-area-inset-bottom)",
					"padding-left": "env(safe-area-inset-left)",
					"padding-right": "env(safe-area-inset-right)",
				},
			};
			addUtilities(newUtilities);
		},
	],
};
