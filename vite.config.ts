import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { youtubePostsApiPlugin } from './vite-plugin-youtube-posts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), youtubePostsApiPlugin()],
})
