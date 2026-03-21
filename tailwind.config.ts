import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        panel: '#121a2b',
        panel2: '#182235',
        border: '#283247',
        text: '#e7edf7',
        muted: '#94a3b8',
        accent: '#7c3aed',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.25)'
      },
      borderRadius: {
        xl2: '20px'
      }
    }
  },
  plugins: []
};

export default config;
