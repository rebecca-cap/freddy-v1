import React from 'react'

interface RectangularProgressBarProps {
  percent: number // required
  color?: string // optional bar color
  backgroundColor?: string // optional background
  height?: number // bar thickness
  borderRadius?: number // rounding
  showLabel?: boolean // show percent text
  className?: string // optional wrapper classes
}

export const RectangularProgressBar: React.FC<RectangularProgressBarProps> = ({
  percent,
  color = 'var(--theme-color-2)',
  backgroundColor = 'var(--gray-200)',
  height = 6,
  borderRadius = 6,
  showLabel = true,
  className = '',
}) => {
  const safePercent = Math.max(0, Math.min(percent, 100)) // clamp

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* Background track */}
      <div
        style={{
          flex: 1,
          height,
          background: backgroundColor,
          borderRadius,
          overflow: 'hidden',
          marginRight: showLabel ? 10 : 0,
        }}
      >
        {/* Filled portion */}
        <div
          style={{
            width: `${safePercent}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {showLabel && <span style={{ fontSize: 12, fontWeight: 500 }}>{fmt.decimal(safePercent, 2)}%</span>}
    </div>
  )
}
