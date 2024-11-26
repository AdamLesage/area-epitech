import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'; // Import autoprefixer package
import tailwindcss from 'tailwindcss'; // Import tailwindcss package

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    },
    preprocessorOptions: {
      css: {
        additionalData: `@import './src/assets/css/tailwind.css';`
      },
    },
  },
})
