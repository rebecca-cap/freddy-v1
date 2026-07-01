import './index.css'

import { CheckCircleFilled } from '@ant-design/icons'
import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { getPriceEngineFormulaVariableColumnDefs } from '@modules/Admin/ManagePriceEngineFormulas/components/Grid/columnDefs'
import MonacoEditor from '@monaco-editor/react'
import { Modal } from 'antd'
import React from 'react'

import WizardNewDocumentIcon from '../../../../assets/SiteImages/Logos/WizardNewDocumentIcon.png'

interface IManageModalProps {
  visible: boolean
  onCancel: () => void
  onOk: () => void
}

export const ManageModal: React.FC<IManageModalProps> = ({ visible, onCancel, onOk }) => {
  return (
    <Modal visible={visible} title='Formula Wizard' onCancel={onCancel} onOk={onOk} footer={null} width='90%'>
      <Horizontal>
        <Vertical flex={0.3}>
          <Horizontal className='p-5' style={{ gap: '1rem' }} alignItems='center'>
            <img src={WizardNewDocumentIcon} width={50} height={50} />
            <Vertical>
              <Texto category='h3' appearance='primary'>
                MANAGE FORMULA
              </Texto>
              <Texto>Fill out the required information to create your order information</Texto>
            </Vertical>
          </Horizontal>
          <Horizontal className='px-5 py-4' style={{ backgroundColor: 'var(--theme-info)' }}>
            <Texto category='h5' style={{ color: 'var(--gray-900)' }}>
              Formula Configuration
            </Texto>
          </Horizontal>
          <Horizontal className='p-5' style={{ backgroundColor: 'var(--theme-optimal-dim)' }}>
            <Vertical>
              <Texto appearance='secondary' category='heading-small'>
                Manage Variables / Formula
              </Texto>
              <Texto>Configure variables and build formula</Texto>
            </Vertical>
          </Horizontal>
          <Horizontal className='p-5'>
            <Vertical>
              <Texto appearance='secondary' category='heading-small'>
                Linked Calculators
              </Texto>
              <Texto>Manage where the formula is utilized</Texto>
            </Vertical>
            <Texto appearance='secondary' style={{ gap: '0.4rem', display: 'flex', alignItems: 'center' }}>
              <CheckCircleFilled /> 3 References
            </Texto>
          </Horizontal>
        </Vertical>
        <Vertical style={{ minHeight: 400 }} flex={0.7}>
          <Horizontal style={{ backgroundColor: 'var(--theme-color-3)' }} className='bg-2 p-5'>
            <Vertical>
              <Texto category='heading-small' appearance='white'>
                Formula Name
              </Texto>
              <Texto appearance='white'>#1 ULSD - Accounting Supplier Rack - NONPA</Texto>
            </Vertical>
          </Horizontal>
          <MonacoEditor height='5vh' theme='vs-dark' defaultLanguage='typescript' />
          <GraviGrid
            controlBarProps={{ title: 'Variables' }}
            agPropOverrides={{ columnDefs: getPriceEngineFormulaVariableColumnDefs() }}
          />
        </Vertical>
      </Horizontal>
    </Modal>
  )
}
