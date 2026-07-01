import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Checkbox, Select } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type FilterOption = 'All' | 'Conflicts' | 'NoConflicts'

export const ConflictStatusFilter = forwardRef((props, ref) => {
  const [filterStatus, setFilterStatus] = useState<FilterOption>('All')

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params) {
        if (filterStatus === 'Conflicts') {
          return params.data.HasConflict
        }
        if (filterStatus === 'NoConflicts') {
          return !params.data.HasConflict
        }
        return true
      },

      isFilterActive() {
        return filterStatus !== 'All'
      },

      // this example isn't using getModel() and setModel(),
      // so safe to just leave these empty. don't do this in your code!!!
      getModel() {
        if (filterStatus === 'All') {
          return null
        }
        return { filterStatus }
      },

      setModel(model) {
        if (model) {
          setFilterStatus(model.filterStatus)
        } else {
          setFilterStatus('All')
        }
      },
    }
  })

  useEffect(() => {
    props.filterChangedCallback()
  }, [filterStatus])

  return (
    <Vertical className='p-3' style={{ gap: '0.5rem' }}>
      <Checkbox
        value='All'
        onChange={(e) => setFilterStatus(e.target.value)}
        checked={filterStatus === 'All'}
        style={{ marginLeft: 0, paddingLeft: 0 }}
      >
        All
      </Checkbox>
      <Checkbox
        value='Conflicts'
        onChange={(e) => setFilterStatus(e.target.value)}
        checked={filterStatus === 'Conflicts'}
        style={{ marginLeft: 0, paddingLeft: 0 }}
      >
        Conflicts
      </Checkbox>
      <Checkbox
        value='NoConflicts'
        onChange={(e) => setFilterStatus(e.target.value)}
        checked={filterStatus === 'NoConflicts'}
        style={{ marginLeft: 0, paddingLeft: 0 }}
      >
        No Conflicts
      </Checkbox>
    </Vertical>
  )
})
