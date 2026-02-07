import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/~abdulalj/hybrid-react-build/',
  plugins: [react()],
})
