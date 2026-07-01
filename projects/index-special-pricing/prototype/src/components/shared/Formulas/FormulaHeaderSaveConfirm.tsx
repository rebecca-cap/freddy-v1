import { CopyOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Button, Dropdown, Menu, Modal } from 'antd'
import React from 'react'

export function FormulaHeaderSaveConfirm({ formulaApi }) {
  if (formulaApi?.formulaStatus !== 'ready' && formulaApi?.formulaStatus !== 'unchanged') {
    return (
      <Horizontal
        flex={1}
        className={`${formulaApi?.formulaStatus === 'error' ? 'bg-error-dim' : 'bg-success-dim'} p-3`}
        justifyContent='space-between'
        alignItems='center'
        style={{ gap: '1rem', width: '100%' }}
      >
        <Horizontal justifyContent='center' alignItems='center' style={{ gap: '0.5rem' }}>
          {formulaApi?.formulaStatus === 'error' ? (
            <>
              <Texto weight='bold'>Invalid Formula.</Texto>
              {formulaApi?.formulaErrReason && <Texto>{formulaApi?.formulaErrReason}</Texto>}
              <Texto>Save to confirm changes. </Texto>
            </>
          ) : (
            <>
              <Texto>Formula has been edited.</Texto>
              <Texto weight='bold'>Save to confirm changes. </Texto>
            </>
          )}
        </Horizontal>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button onClick={formulaApi.handleDiscardChanges}>Discard</Button>
          <Button
            disabled={formulaApi?.formulaStatus === 'error' || formulaApi?.upsertFormula?.isLoading}
            onClick={formulaApi.handleFormulaSave}
          >
            Save
          </Button>
        </div>
      </Horizontal>
    )
  }
  if (formulaApi?.canWrite && formulaApi?.formulaStatus !== 'draft') {
    return (
      <div style={{ marginLeft: 'auto' }}>
        <Dropdown
          placement='bottomRight'
          overlay={
            <Menu
              items={[
                {
                  key: 'Delete Formula',
                  label: 'Delete Formula',
                  icon: <DeleteOutlined />,
                  onClick: () => {
                    Modal.confirm({
                      title: 'Are you sure you want to delete this formula?',
                      content: 'This action cannot be undone.',
                      onOk: formulaApi.handleFormulaDelete,
                    })
                  },
                },
                {
                  disabled:
                    (formulaApi?.formulaStatus !== 'unchanged' && formulaApi?.formulaStatus !== 'ready') ||
                    formulaApi?.selectedFormulaId === null,
                  key: 'Duplicate Formula',
                  label: 'Duplicate Formula',
                  icon: <CopyOutlined />,
                  onClick: () => {
                    formulaApi.handleFormulaDuplicate(formulaApi.selectedFormulaId)
                  },
                },
              ]}
            />
          }
        >
          <div>
            <Texto weight='bolder' category='h3' style={{ cursor: 'pointer' }} className='mr-2'>
              <EllipsisOutlined />
            </Texto>
          </div>
        </Dropdown>
      </div>
    )
  }

  return <div />
}
