import { NoResultsIcon } from '../SVGasComponents/IconsSVG'

type Props = {
  title: string
  message: string
  className?: string
}

export const NothingMessage: React.FC<Props> = ({
  title,
  message,
  className,
}) => {
  return (
    <div className={`nothing-container ${className}`}>
      <NoResultsIcon />
      <div className='nothing-title'>{title}</div>
      <div className='nothing-message'>{message}</div>
    </div>
  )
}
