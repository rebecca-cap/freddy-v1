import { CloseOutlined, CloudServerOutlined, FileTextOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { PublicationModes, Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { Alert, message } from 'antd'
import React from 'react'

export interface QuoteBookPublishFooterProps {
  publicationMode: PublicationModes
  canWrite: boolean
  handleGridReset: () => void
  setPublishMode: React.Dispatch<React.SetStateAction<boolean>>
  publishMode: boolean
  dirtyQuotes: Quote[]
  refs: object
  setIsBulkChangeVisible: React.Dispatch<React.SetStateAction<boolean>>
  setIsConfirmDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setShowAnalytics: React.Dispatch<React.SetStateAction<boolean>>
  selectedRowsToPublish: Quote[]
  handleAdjustmentUpdate: () => void
}
export function QuoteBookPublishFooter({
  publicationMode,
  canWrite,
  handleGridReset,
  setPublishMode,
  publishMode,
  dirtyQuotes,
  refs,
  setIsBulkChangeVisible,
  setIsConfirmDrawerOpen,
  setShowAnalytics,
  selectedRowsToPublish,
  handleAdjustmentUpdate,
}: QuoteBookPublishFooterProps) {
  const handleGridSave = () => {
    if (refs[`gridRef${publicationMode}`]?.current) {
      refs[`gridRef${publicationMode}`]?.current.stopEditing()
    }
    if (selectedRowsToPublish.length > 0 && publishMode) {
      return setIsConfirmDrawerOpen(true)
    }
    if (!publishMode) {
      setShowAnalytics(false)
      setIsBulkChangeVisible(false)
      return setPublishMode(true)
    }
    if (selectedRowsToPublish.length === 0 && publishMode) {
      message.error('Please select at least one row to publish.')
    }
  }

  return (
    <>
      <Horizontal flex={1} gap='2rem' alignItems='center'>
        {publicationMode !== 'EndOfDayCurrentPeriod' ? (
          <Texto appearance='secondary' className='flex items-center' style={{ gap: '0.5rem' }} category='h4'>
            <FileTextOutlined /> Quote Publisher
          </Texto>
        ) : (
          <Horizontal flex={1}>
            <Alert
              message={
                <>
                  <Texto category='h4'>Publishing For Current Period</Texto>
                  <Texto category='p2'>
                    This mode will publish at the beginning of the current pricing period, causing prices to be
                    effective before now.
                  </Texto>
                </>
              }
              type='warning'
            />
          </Horizontal>
        )}
      </Horizontal>
      {canWrite && (
        <Horizontal>
          <GraviButton
            className='mr-3'
            buttonText='Reset'
            icon={<SyncOutlined />}
            size='large'
            onClick={handleGridReset}
          />
          <GraviButton
            className='mr-3'
            buttonText='Save Adjustments'
            icon={<SaveOutlined />}
            size='large'
            disabled={!dirtyQuotes.length}
            onClick={handleAdjustmentUpdate}
          />
          {publishMode && (
            <GraviButton
              className='mr-3'
              size='large'
              icon={<CloseOutlined />}
              buttonText='Cancel Publish'
              onClick={() => setPublishMode(false)}
            />
          )}
          <GraviButton
            theme2
            className='mr-3'
            buttonText='Publish Prices'
            onClick={handleGridSave}
            icon={<CloudServerOutlined />}
            size='large'
          />
        </Horizontal>
      )}
    </>
  )
}
