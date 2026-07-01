import { ICellEditorParams } from 'ag-grid-community'
import { DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export const DatePickerEditor = forwardRef<any, ICellEditorParams>(
  (props, ref) => {
    const refDatePicker = useRef(null)
    const [date, setDate] = useState(moment(props.value))
    const [editing, setEditing] = useState(true)

    useEffect(() => {
      if (!editing) {
        props.api.stopEditing()
      }
    }, [editing])

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return moment(date).toISOString()
        },
      }
    })

    const onChange = (selectedDate: Moment | null) => {
      setDate(selectedDate!)
      setEditing(false)
    }

    return (
      <div>
        <DatePicker
          ref={refDatePicker}
          value={date}
          onChange={onChange}
          allowClear={false}
        />
      </div>
    )
  }
)
