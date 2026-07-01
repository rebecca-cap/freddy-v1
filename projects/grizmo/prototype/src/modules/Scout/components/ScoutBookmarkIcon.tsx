// ScoutBookmarkIcon — inline SVG bookmark icon, filled or outlined.
//
// Phase 5.5. antd has no first-class "bookmark" icon (it has BookOutlined and
// StarOutlined but neither is the ribbon-shape we want), and the plan
// explicitly mandates "bookmark icon, not a star". Inline SVG keeps the icon
// dependency-free, theme-aware via `currentColor`, and crisp at small sizes.

export interface ScoutBookmarkIconProps {
  filled: boolean
  size?: number
  className?: string
}

export const ScoutBookmarkIcon = ({
  filled,
  size = 14,
  className,
}: ScoutBookmarkIconProps) => {
  // 24x24 viewBox, ribbon-shape from M5 3 to M19 3, notched bottom.
  // Stroke-only when outlined, fill when filled.
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      className={className}
      aria-hidden='true'
    >
      <path
        d='M6 3.5 A 1 1 0 0 1 7 2.5 H 17 A 1 1 0 0 1 18 3.5 V 21 L 12 17 L 6 21 Z'
        fill={filled ? 'currentColor' : 'none'}
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinejoin='round'
      />
    </svg>
  )
}
