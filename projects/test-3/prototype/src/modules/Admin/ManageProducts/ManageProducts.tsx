import { useUser } from '@contexts/UserContext'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Grid } from '@modules/Admin/ManageProducts/components/Grid/ManageProductsGrid'
import React, { useState } from 'react'

import ManagementPane from './components/ManagementPane'
import SourceModal from './components/sourceModal'

export function ManageProducts() {
  const [selectedRows, setSelectedRows] = useState([])
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false)
  const [isBulkChanging, setIsBulkChanging] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.Product?.Write

  return (
    <Horizontal fullHeight>
      <Vertical>
        <Grid
          setSelectedRows={setSelectedRows}
          setEditingRow={setEditingRow}
          openSourceModal={() => setIsSourceModalOpen(true)}
          isBulkChanging={isBulkChanging}
          setIsBulkChanging={setIsBulkChanging}
          canWrite={canWrite}
        />
      </Vertical>
      {!isBulkChanging && (
        <Vertical style={{ maxWidth: 400 }}>
          <ManagementPane selectedRows={selectedRows} canWrite={canWrite} />
        </Vertical>
      )}
      <SourceModal isOpen={isSourceModalOpen} onClose={() => setIsSourceModalOpen(false)} editingRow={editingRow} />
    </Horizontal>
  )
}
