import { type ReactNode } from 'react'

const URL_SPLIT_PATTERN = /(https?:\/\/\S+)/gi
// Intentionally no 'g' flag — .test() with 'g' causes stateful lastIndex bugs
const URL_TEST_PATTERN = /^(https?:\/\/\S+)$/i
const TRAILING_PUNCTUATION = /[.,;:!?)}\]]+$/

function cleanUrl(url: string): { href: string; display: string; trailing: string } {
  const trailing = url.match(TRAILING_PUNCTUATION)?.[0] ?? ''
  const cleaned = trailing ? url.slice(0, -trailing.length) : url

  try {
    new URL(cleaned)
    return { href: cleaned, display: cleaned, trailing }
  } catch {
    return { href: '', display: url, trailing: '' }
  }
}

export function linkifyText(text: string | null | undefined, fallback: ReactNode = 'N/A'): ReactNode {
  if (!text) return fallback

  const parts = text.split(URL_SPLIT_PATTERN)

  if (parts.length === 1) return text

  return (
    <>
      {parts.map((part, i) => {
        if (URL_TEST_PATTERN.test(part)) {
          const { href, display, trailing } = cleanUrl(part)

          if (!href) return <span key={`invalid-${i}`}>{part}</span>

          return (
            <span key={`link-${i}`}>
              <a href={href} target='_blank' rel='noopener noreferrer' aria-label={`${display} (opens in new tab)`}>
                {display}
              </a>
              {trailing}
            </span>
          )
        }
        return <span key={`text-${i}`}>{part}</span>
      })}
    </>
  )
}
