import type { Config } from 'tailwindcss';
const config: Config = { darkMode:'class', content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'], theme:{extend:{colors:{nexus:'#6D5DFB'},fontFamily:{sans:['Inter','system-ui','sans-serif']},boxShadow:{soft:'0 18px 60px rgba(20,20,40,.08)',glow:'0 0 0 1px rgba(109,93,251,.12),0 20px 70px rgba(109,93,251,.12)'}}},plugins:[require('@tailwindcss/forms')]};
export default config;
