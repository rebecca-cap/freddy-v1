import { EditOutlined, SaveOutlined } from '@ant-design/icons'
import { Button } from 'antd'

type Props = {
  editing?: boolean
  onEdit?: () => void
  extraClasses?: string
}

export const EditSaveButton: React.FC<Props> = ({
  editing = false,
  onEdit,
  extraClasses = '',
}) => {
  const classes = 'ant-btn ant-btn-sm edit-save-button' + extraClasses
  if (editing)
    return (
      <Button className={classes} htmlType='submit'>
        <SaveOutlined />
      </Button>
    )
  return (
    <Button
      className={classes}
      onClick={(e) => {
        if (e) e.preventDefault()
        if (onEdit && typeof onEdit === 'function') onEdit()
      }}
    >
      <EditOutlined />
    </Button>
  )
}
