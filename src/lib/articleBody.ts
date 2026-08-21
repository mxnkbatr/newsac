export type ArticleBlock = { type: 'p'; text: string } | { type: 'img'; src: string }

const IMG_TOKEN = /\[\[img:([\s\S]+?)\]\]/i

function isBareImageUrl(value: string) {
  if (value.startsWith('data:image/')) return true
  if (!/^https?:\/\/\S+$/i.test(value)) return false
  return (
    /\.(png|jpe?g|webp|gif|avif)(\?|#|$)/i.test(value) ||
    value.includes('/storage/v1/object/public/')
  )
}

function pushParagraphs(chunk: string, blocks: ArticleBlock[]) {
  for (const para of chunk
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean)) {
    if (isBareImageUrl(para) || /^\[\[img:.+\]\]$/i.test(para)) {
      const token = para.match(/^\[\[img:(.+)\]\]$/i)
      blocks.push({ type: 'img', src: (token?.[1] || para).trim() })
    } else {
      blocks.push({ type: 'p', text: para })
    }
  }
}

export function parseArticleBody(raw: string): ArticleBlock[] {
  const text = raw.trim()
  if (!text) return []

  const blocks: ArticleBlock[] = []
  let rest = text
  while (rest.length) {
    const match = rest.match(IMG_TOKEN)
    if (!match || match.index === undefined) {
      pushParagraphs(rest, blocks)
      break
    }
    pushParagraphs(rest.slice(0, match.index), blocks)
    const src = match[1].trim()
    if (src) blocks.push({ type: 'img', src })
    rest = rest.slice(match.index + match[0].length)
  }
  return blocks
}

export function imageToken(url: string) {
  return `[[img:${url}]]`
}

export function articleFromLines(lines: string[]) {
  return parseArticleBody(lines.join('\n\n'))
}

export function withMidImage(blocks: ArticleBlock[], midSrc?: string): ArticleBlock[] {
  const src = midSrc?.trim()
  if (!src) return blocks
  if (blocks.some((b) => b.type === 'img' && b.src === src)) return blocks
  const next = [...blocks]
  const firstPara = next.findIndex((b) => b.type === 'p')
  const at = firstPara >= 0 ? firstPara + 1 : Math.max(0, Math.floor(next.length / 2))
  next.splice(at, 0, { type: 'img', src })
  return next
}
