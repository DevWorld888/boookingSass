// import { Config } from 'tailwindcss' // Not needed in JS

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // your custom configurations here
    },
  },
  plugins: [
    
  ],
}

export default config