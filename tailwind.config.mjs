import { createFluidValue } from './src/styles/createFluidValue';

/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			screens: {
				xs: '767px',
				sm: '820px',
				md: '1080px',
				lg: '1280px',
				xl: '1440px',
				'2xl': '1620px',
			},
			colors: {
				black: '#030507',
				blue: '#72c1ca',
				gray: '#6c6b68',
			},
			spacing: {
				0: '0',
				1: createFluidValue(8, 10),
				2: createFluidValue(16, 20),
				3: createFluidValue(24, 30),
				4: createFluidValue(32, 40),
				5: createFluidValue(40, 50),
				7: createFluidValue(56, 75),
				8: createFluidValue(50, 100),
				9: createFluidValue(75, 150),
				10: createFluidValue(125, 175),
				11: createFluidValue(125, 200),
			},
			fontSize: {
				base: ['1rem', '1.3'],
				md: createFluidValue(16, 24),
				lg: createFluidValue(21, 32),
				xl: createFluidValue(32, 40),
				'2xl': createFluidValue(16, 48),
			},
			aspectRatio: {
				'4/3': '4 / 3',
				'project': '1200 / 621'
			},
		},
	},
	plugins: [],
}
