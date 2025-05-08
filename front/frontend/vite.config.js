import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gradient-dark-start': '#0f2027',
        'gradient-dark-end': '#2c5364',
        'gradient-light-start': '#e0eafc',
        'gradient-light-end': '#cfdef3',
      },
    },
  },
})
