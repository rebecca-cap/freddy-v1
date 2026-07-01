import { Button, Tooltip } from 'antd'
import { BBDTag } from './BBDTag'

type Props = {
  tagItems: string[]
  maxCount: number
}

export const ManyTag: React.FC<Props> = ({ tagItems, maxCount }) => {
  if (!tagItems) return null
  const slicedItems = tagItems.slice(0, maxCount)
  const remainingItems = tagItems.slice(maxCount)

  if (tagItems.length <= maxCount) {
    return (
      <div style={{ flexWrap: 'wrap' }} className='flex items-center'>
        {tagItems.map((item, index) => (
          <BBDTag className='text-ellipsis' key={index}>
            {item}
          </BBDTag>
        ))}
      </div>
    )
  }
  return (
    <div style={{ flexWrap: 'wrap' }} className='flex items-center'>
      {slicedItems.map((item, index) => (
        <BBDTag className='text-ellipsis' key={index}>
          {item}
        </BBDTag>
      ))}
      <Tooltip title={remainingItems.join(', ')}>
        <Button
          size='small'
          style={{ marginRight: '5px', fontSize: '0.9em', fontWeight: 500 }}
        >
          + {remainingItems.length} more
        </Button>
      </Tooltip>
    </div>
  )
}
