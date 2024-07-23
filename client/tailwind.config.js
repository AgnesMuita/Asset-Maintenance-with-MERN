const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */

module.exports = {
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
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				inter: ["Inter", ...defaultTheme.fontFamily.sans],
				manrope: ["Manrope", ...defaultTheme.fontFamily.sans],
				ubuntu: ["Ubuntu", ...defaultTheme.fontFamily.sans],
				ubuntumono: ["'Ubuntu Mono'", ...defaultTheme.fontFamily.sans],
				roboto: ["Roboto", ...defaultTheme.fontFamily.sans],
				robotomono: ["'Roboto Mono'", ...defaultTheme.fontFamily.sans],
				opensans: ["'Open Sans'", ...defaultTheme.fontFamily.sans],
				titillium: ["'Titillium Web'", ...defaultTheme.fontFamily.sans],
				quicksand: ["Quicksand", ...defaultTheme.fontFamily.sans],
				inconsolata: ["Inconsolata", ...defaultTheme.fontFamily.sans],
				merriweather: ["Merriweather", ...defaultTheme.fontFamily.sans],
				ptsans: ["'PT Sans'", ...defaultTheme.fontFamily.sans],
				rubik: ["Rubik", ...defaultTheme.fontFamily.sans],
				poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
				montserrat: ["Montserrat", ...defaultTheme.fontFamily.sans],
			},
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
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
