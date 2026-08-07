import type { Connect, Plugin } from 'vite'
import { fetchYoutubeChannelPosts } from './scripts/youtube-posts-fetch.ts'

function mountYoutubePostsApi(middlewares: Connect.Server) {
  middlewares.use(async (req, res, next) => {
    if (!req.url?.startsWith('/api/youtube-posts')) {
      next()
      return
    }
    try {
      const data = await fetchYoutubeChannelPosts()
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'public, max-age=120')
      res.end(JSON.stringify(data))
    } catch (e) {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'failed', posts: [] }))
    }
  })
}

/** Dev/preview API: GET /api/youtube-posts */
export function youtubePostsApiPlugin(): Plugin {
  return {
    name: 'newsac-youtube-posts-api',
    configureServer(server) {
      mountYoutubePostsApi(server.middlewares)
    },
    configurePreviewServer(server) {
      mountYoutubePostsApi(server.middlewares)
    },
  }
}
