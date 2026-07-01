import { Texto } from '../../DataDisplay/Texto/Texto'
import { Horizontal } from '../../Layout/Horizontal'

type Props = {
  label: React.ReactNode
  icon: React.ReactNode
  active?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  className?: string
}

export const BigButton: React.FC<Props> = ({
  label,
  icon,
  active,
  ...others
}) => {
  return (
    <div className={`big-button ${active ? 'active' : ''}`} {...others}>
      <Horizontal className='pt-2' horizontalCenter>
        {icon}
      </Horizontal>
      <Texto align='center' category='h3' weight='bold' className='mt-3'>
        {label}
      </Texto>
    </div>
  )
}
