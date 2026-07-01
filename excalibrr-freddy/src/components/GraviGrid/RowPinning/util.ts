// @ts-nocheck
// there's a ton of ` 'style' does not exist on type 'Element'` errors that can safely be ignored
import _ from 'lodash'

export function autosizePinnedRows() {
  return setInterval(function interval() {
    // main pinned row container
    const pinnedRowContainer = document?.querySelector('.ag-floating-top')
    if (!pinnedRowContainer) return

    // const floatingPinnedColumns
    const rowViewport = pinnedRowContainer?.querySelector(
      '.ag-floating-top-viewport'
    )
    const rowContainer = rowViewport?.querySelector(
      '.ag-floating-top-container'
    )

    const fullGridContainer = document.querySelector(
      '.ag-root.ag-unselectable.ag-layout-normal'
    )

    const gridHeight = fullGridContainer?.clientHeight

    const rows = Array.from(rowContainer?.querySelectorAll('.ag-row') || [])

    // Check if the user has pinned columns to the right (eg: actions column)
    const lPinnedColViewport = pinnedRowContainer?.querySelector(
      '.ag-pinned-left-floating-top'
    )
    const lPinnedColRows = Array.from(
      lPinnedColViewport?.querySelectorAll('.ag-row') || []
    )

    // Check if the user has pinned columns to the left
    const rPinnedColViewport = pinnedRowContainer?.querySelector(
      '.ag-pinned-right-floating-top'
    )
    const rPinnedColRows = Array.from(
      rPinnedColViewport?.querySelectorAll('.ag-row') || []
    )

    // Running total of the virtual height of the rows (used for resizing containers at the end)
    let totalVirtualHeight = rows?.[0]?.clientHeight

    for (let i = 0; i < rows.length; i += 1) {
      if (!i) continue
      rows[i].style.transform = `translateY(${totalVirtualHeight}px)`
      if (lPinnedColRows?.length)
        lPinnedColRows[
          i
        ].style.transform = `translateY(${totalVirtualHeight}px)`
      if (rPinnedColRows?.length)
        rPinnedColRows[
          i
        ].style.transform = `translateY(${totalVirtualHeight}px)`
      totalVirtualHeight += rows[i].clientHeight
    }

    const maxGridHeight = Math.floor(gridHeight / 2)

    const clampedHeight = _.clamp(totalVirtualHeight, 0, maxGridHeight)

    // Reize the parent container to grow with the row height, but clamp after 300px
    pinnedRowContainer.style.minHeight = `${clampedHeight}px`
    pinnedRowContainer.style.maxHeight = `${clampedHeight}px`
    pinnedRowContainer.style.overflowY = 'scroll'

    // The sub containers can grow infinitely with a scroll bar appearing > 300px
    rowViewport.style.height = `${totalVirtualHeight}px`
    if (lPinnedColRows?.length)
      lPinnedColViewport.style.height = `${totalVirtualHeight}px`
    if (rPinnedColRows?.length)
      rPinnedColViewport.style.height = `${totalVirtualHeight}px`
  }, 5)
}
