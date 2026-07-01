export const SuperUserIcon = (props) => (
  <span
    className='anticon'
    style={{
      display: 'inline-block',
      color: 'inherit',
      fontStyle: 'normal',
      lineHeight: 0,
      textAlign: 'center',
      textTransform: 'none',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    }}
    {...props}
  >
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='4 10 42 32' width='1em' height='1em' fill='none'>
      {/* Cape flowing behind */}
      <path
        d='M 24 22 Q 10 24 6 28 Q 4 32 6 38 Q 8 42 14 42 L 18 36 L 22 28 Z'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinejoin='round'
        fill='none'
      />

      {/* Head (circle) */}
      <circle cx='32' cy='18' r='8' stroke='currentColor' strokeWidth='3' fill='none' />

      {/* Body/Torso */}
      <path
        d='M 24 26 C 24 26 24 36 24 38 C 24 42 28 42 28 42 L 36 42 C 36 42 40 42 40 38 C 40 36 40 26 40 26'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />

      {/* Right arm raised up */}
      <path d='M 40 28 Q 44 24 46 18' stroke='currentColor' strokeWidth='3' strokeLinecap='round' fill='none' />
    </svg>
  </span>
)
