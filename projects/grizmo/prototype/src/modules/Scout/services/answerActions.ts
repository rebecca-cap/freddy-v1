// answerActions — copy / export an answer body to the clipboard or a .txt file.
//
// Pulled out of ScoutActionChips so the answer footer's overflow (meatballs)
// menu and any chip can share one implementation. Both operate on the rendered
// answer via toPlainText. Guarded for the prototype: when the browser path is
// unavailable they return false so the caller can toast a fallback.

import { toPlainText } from './answerToPlainText'
import type { AnswerBody } from '../types'

export async function copyAnswer(body: AnswerBody): Promise<boolean> {
  const text = toPlainText(body)
  if (!navigator.clipboard?.writeText) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function exportAnswer(
  body: AnswerBody,
  filename = 'scout-answer.txt',
): boolean {
  const text = toPlainText(body)
  try {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return true
  } catch {
    return false
  }
}
