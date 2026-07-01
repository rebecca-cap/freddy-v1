import { ExportOutlined, LinkOutlined } from '@ant-design/icons'
import { FormulaBreakdownAndValuationContent } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer/components/FormulaBreakdownAndValuationContent'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { copyToClipboard } from '@utils/clipboard'
import { Drawer, Tooltip, message } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import styles from './components/styles.module.css'

interface FormulaBreakdownAndValuationDrawerProps {
  setIsFormulaBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  isFormulaBreakdownAndValuationDrawerOpen: boolean
  selectedValuationId: number | null
  setSelectedValuationId?: React.Dispatch<React.SetStateAction<number | null>>
  allowRevaluation?: boolean
  onRevalueSuccess?: (newCurvePointPriceId: number) => void
  /** When true, render a Copy link button in the drawer header that copies the current URL.
   *  Only enable from pages whose URL deep-links to the open valuation. */
  showCopyLink?: boolean
  /** When both ids are provided, render a "View Contract Detail" button in the drawer
   *  header that opens the Contract Management detail page for this valuation in a new tab. */
  tradeEntryId?: number | null
  tradeEntryDetailId?: number | null
}

const MIN_WIDTH_PX = 640
const DEFAULT_WIDTH_RATIO = 0.5
const MAX_WIDTH_RATIO = 0.95

async function handleCopyLink() {
  const ok = await copyToClipboard(window.location.href)
  if (ok) message.success('Link copied')
  else message.error('Failed to copy link')
}

function openContractDetail(tradeEntryId: number, tradeEntryDetailId: number) {
  const url = `/ContractManagement/${tradeEntryId}?detailId=${tradeEntryDetailId}&expandFormula=1`
  window.open(url, '_blank')
}

function clampWidth(px: number) {
  const min = MIN_WIDTH_PX
  const max = Math.max(min, window.innerWidth * MAX_WIDTH_RATIO)
  return Math.min(Math.max(px, min), max)
}

export function FormulaBreakdownAndValuationDrawer({
  setIsFormulaBreakdownAndValuationDrawerOpen,
  isFormulaBreakdownAndValuationDrawerOpen,
  selectedValuationId,
  setSelectedValuationId,
  allowRevaluation,
  onRevalueSuccess,
  showCopyLink = false,
  tradeEntryId,
  tradeEntryDetailId,
}: FormulaBreakdownAndValuationDrawerProps) {
  const [width, setWidth] = useState<number>(() => clampWidth(window.innerWidth * DEFAULT_WIDTH_RATIO))
  const [isDragging, setIsDragging] = useState(false)
  const dragStartXRef = useRef<number>(0)
  const dragStartWidthRef = useRef<number>(width)

  const closeAndClearSelection = () => {
    setIsFormulaBreakdownAndValuationDrawerOpen(false)
    setSelectedValuationId && setSelectedValuationId(null)
  }

  const handlePointerMove = useCallback((e: PointerEvent) => {
    // Drawer is anchored on the right edge; dragging the handle LEFT increases width.
    const delta = dragStartXRef.current - e.clientX
    setWidth(clampWidth(dragStartWidthRef.current + delta))
  }, [])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    document.body.classList.remove('fbav-resizing')
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerUp)
  }, [handlePointerMove])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragStartXRef.current = e.clientX
    dragStartWidthRef.current = width
    setIsDragging(true)
    document.body.classList.add('fbav-resizing')
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  // Cleanup listeners + body class on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      document.body.classList.remove('fbav-resizing')
    }
  }, [handlePointerMove, handlePointerUp])

  // Re-clamp width when the viewport resizes so the drawer never exceeds the max ratio.
  useEffect(() => {
    const handleResize = () => setWidth((current) => clampWidth(current))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const showContractDetailButton = tradeEntryId != null && tradeEntryDetailId != null
  const headerExtra =
    showContractDetailButton || showCopyLink ? (
      <Horizontal gap={8}>
        {showContractDetailButton && (
          <Tooltip title='View Contract Detail (new tab)' mouseEnterDelay={0.3}>
            <GraviButton
              appearance='outline'
              icon={<ExportOutlined />}
              buttonText='View Contract Detail'
              onClick={() => openContractDetail(tradeEntryId!, tradeEntryDetailId!)}
            />
          </Tooltip>
        )}
        {showCopyLink && (
          <Tooltip title='Copy link to this valuation' mouseEnterDelay={0.3}>
            <GraviButton appearance='outline' icon={<LinkOutlined />} onClick={handleCopyLink} />
          </Tooltip>
        )}
      </Horizontal>
    ) : undefined

  return (
    <Drawer
      className='quoteBook-drawer'
      title='Valuation Drawer'
      placement='right'
      onClose={closeAndClearSelection}
      width={width}
      open={isFormulaBreakdownAndValuationDrawerOpen}
      extra={headerExtra}
      styles={{ body: { padding: 0, position: 'relative', height: '100%' } }}
    >
      <div
        className={`${styles.fbavResizeHandle}${isDragging ? ` ${styles.isDragging}` : ''}`}
        role='separator'
        aria-orientation='vertical'
        onPointerDown={handlePointerDown}
      />
      <div className={styles.fbavDrawerBodyInner}>
        <FormulaBreakdownAndValuationContent
          curvePointPriceId={selectedValuationId}
          allowRevaluation={allowRevaluation}
          onRevalueSuccess={onRevalueSuccess}
        />
      </div>
    </Drawer>
  )
}
