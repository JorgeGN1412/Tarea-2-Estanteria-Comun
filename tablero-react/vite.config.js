import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Activa el complemento que transforma JSX para que React funcione en el navegador.
export default defineConfig({
  plugins: [react()],
})
