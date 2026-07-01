export const BoxTagFilled = (props) => (
  <span
    className='anticon border-radius-10'
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
      padding: '6px',
      borderRadius: '10px',
    }}
    {...props}
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='-5.04 -5.04 34.08 34.08'
      width='1em'
      height='1em'
      fill='none'
      stroke='#fff'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='-5.04' y='-5.04' width='34.08' height='34.08' rx='5' ry='5' fill='currentColor' strokeWidth='0' />
      <g>
        <path d='M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z'></path>
        <circle cx='7.5' cy='7.5' r='.5' fill='currentColor'></circle>
      </g>
    </svg>
  </span>
)
