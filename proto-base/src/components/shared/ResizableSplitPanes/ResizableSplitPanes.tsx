import './styles.css'

import { useLocalStorage } from '@gravitate-js/excalibrr'
import { type CSSProperties, type PointerEvent, type ReactNode, useRef, useState } from 'react'

interface ResizableSplitPanesProps {
  storageKey: string
  leftPane: ReactNode
  rightPane: ReactNode
  defaultLeftPercent?: number
  minPercent?: number
  maxPercent?: number
  minPixels?: number
  /** Divider background color when idle. Defaults to a neutral border color. */
  dividerColor?: string
  /** Divider background color on hover/drag. Defaults to the Gravitate primary color. */
  dividerActiveColor?: string
  className?: string
}

interface DragState {
  startClientX: number
  startLeftPx: number
  containerPx: number
  dividerPx: number
}

export function ResizableSplitPanes({
  storageKey,
  leftPane,
  rightPane,
  defaultLeftPercent = 50,
  minPercent = 5,
  maxPercent = 95,
  minPixels = 600,
  dividerColor,
  dividerActiveColor,
  className,
}: ResizableSplitPanesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftPaneRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const defaultWidth = `${defaultLeftPercent}%`
  const { value: storedWidth, setValue: setStoredWidth } = useLocalStorage(storageKey, defaultWidth)
  const [widthAsPercent, setWidthAsPercent] = useState<string>(storedWidth || defaultWidth)
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current
    const leftEl = leftPaneRef.current
    if (!container || !leftEl) return
    dragStateRef.current = {
      startClientX: e.clientX,
      startLeftPx: leftEl.getBoundingClientRect().width,
      containerPx: container.getBoundingClientRect().width,
      dividerPx: e.currentTarget.getBoundingClientRect().width,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const ds = dragStateRef.current
    if (!ds) return
    const delta = e.clientX - ds.startClientX
    const minPx = Math.max(minPixels, (minPercent / 100) * ds.containerPx)
    const maxPx = Math.min(ds.containerPx - ds.dividerPx - minPixels, (maxPercent / 100) * ds.containerPx)
    const targetPx = Math.min(Math.max(ds.startLeftPx + delta, minPx), maxPx)
    const percent = ((targetPx / ds.containerPx) * 100).toFixed(2)
    const value = `${percent}%`
    setWidthAsPercent(value)
    setStoredWidth(value)
  }

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragStateRef.current = null
    setIsDragging(false)
  }

  const containerClassName = ['resizable-split-panes', isDragging ? 'is-dragging' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  const dividerClassName = `resizable-split-panes-divider${isDragging ? ' is-dragging' : ''}`

  const containerStyle: CSSProperties = {}
  if (dividerColor) {
    ;(containerStyle as Record<string, string>)['--resizable-divider-color'] = dividerColor
  }
  if (dividerActiveColor) {
    ;(containerStyle as Record<string, string>)['--resizable-divider-active-color'] = dividerActiveColor
  }

  return (
    <div ref={containerRef} className={containerClassName} style={containerStyle}>
      <div ref={leftPaneRef} className='resizable-split-panes-left' style={{ width: widthAsPercent }}>
        {leftPane}
      </div>
      <div
        className={dividerClassName}
        role='separator'
        aria-orientation='vertical'
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      <div className='resizable-split-panes-right'>{rightPane}</div>
    </div>
  )
}
