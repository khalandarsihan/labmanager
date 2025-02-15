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
			padding: "2rem",
			screens: {
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
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			animation: {
				"float-up": "floatUp 4s ease-in-out infinite",
				"float-up-slow": "floatUp 6s ease-in-out infinite",
				"float-diagonal": "floatDiagonal 7s ease-in-out infinite",
				"float-diagonal-reverse": "floatDiagonalReverse 5s ease-in-out infinite",
				"float-side": "floatSide 8s ease-in-out infinite",
				"float-circle": "floatCircle 12s linear infinite",
			},
			keyframes: {
				floatUp: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-40px)" },
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
			},
		},
	},
	plugins: [],
};
