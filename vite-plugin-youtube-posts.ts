import { fetchYoutubeChannelPosts } from './scripts/youtube-posts-fetch.mjs'

/** Dev/preview API: GET /api/youtube-posts */
export function youtubePostsApiPlugin() {
  return {
    name: 'newsac-youtube-posts-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/youtube-posts')) return next()
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
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/youtube-posts')) return next()
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
    },
  }
}
