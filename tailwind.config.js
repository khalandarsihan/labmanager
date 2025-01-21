// /** @type {import('tailwindcss').Config} */
// module.exports = {
// 	content: ["./labmanager/www/**/*.html"],
// 	theme: {
// 		extend: {},
// 	},
// 	plugins: [],
// };

// /** @type {import('tailwindcss').Config} */
// module.exports = {
// 	content: ["./labmanager/www/**/*.html"],
// 	theme: {
// 		extend: {
// 			animation: {
// 				"float-fast": "float 3s ease-in-out infinite",
// 				"float-medium": "float 2s ease-in-out infinite",
// 				"float-slow": "float 4s ease-in-out infinite",
// 			},
// 			keyframes: {
// 				float: {
// 					"0%, 100%": { transform: "translateY(0)" },
// 					"50%": { transform: "translateY(-20px)" },
// 				},
// 			},
// 		},
// 	},
// 	plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./labmanager/www/**/*.html"],
	theme: {
		extend: {
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
