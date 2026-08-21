import { parseArticleBody, articleFromLines, withMidImage } from '../lib/articleBody'
import './ArticleBlocks.css'

export function ArticleBlocks({
  text,
  lines,
  midSrc,
}: {
  text?: string
  lines?: string[]
  midSrc?: string
}) {
  const blocks = withMidImage(
    lines ? articleFromLines(lines) : parseArticleBody(text || ''),
    midSrc,
  )
  return (
    <>
      {blocks.map((block, i) =>
        block.type === 'img' ? (
          <figure key={`img-${i}`} className="article-inline-img">
            <img src={block.src} alt="" />
          </figure>
        ) : (
          <p key={`p-${i}-${block.text.slice(0, 24)}`}>{block.text}</p>
        ),
      )}
    </>
  )
}
