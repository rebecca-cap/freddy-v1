import { SearchOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { EngagementStage, getStageIcon } from '@modules/Dashboard/SpecialOffers/utils/Utils/CustomerEngagementHelpers'
import { Collapse, Input, Modal } from 'antd'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'

type ViewCustomersProps = {
  viewCustomersModalOpen: boolean
  setViewCustomersModalOpen: Dispatch<SetStateAction<boolean>>
  stage: EngagementStage | null // ← NEW
}

const { Panel } = Collapse

export function ViewCustomers({ viewCustomersModalOpen, setViewCustomersModalOpen, stage }: ViewCustomersProps) {
  const [searchInput, setSearchInput] = useState<string>('')

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(event.currentTarget.value)
  }

  const filteredCustomers = useMemo(() => {
    const filtered = stage?.customers?.filter((customer) =>
      [customer].some((v) => v.toLowerCase().includes(searchInput?.toLowerCase()))
    )
    return searchInput ? filtered : stage?.customers
  }, [searchInput, stage?.customers])

  return (
    <Modal
      centered
      visible={viewCustomersModalOpen}
      onCancel={() => setViewCustomersModalOpen(false)}
      footer={null}
      wrapClassName={'customer-engagement-view-customers-modal'}
    >
      <Vertical>
        <div>
          <Horizontal verticalCenter className={'gap-10'} style={{ marginBottom: '10px' }} justifyContent='flex-start'>
            <span style={{ fontSize: 20, color: 'var(--theme-color-1)' }}>
              {stage ? getStageIcon(stage.key) : null}
            </span>
            <Texto category={'h3'}>{stage?.title}</Texto>
          </Horizontal>
          <Texto category={'p1'} appearance={'medium'}>
            {stage?.count} customers
          </Texto>
        </div>
        <Horizontal className={'mt-4'}>
          <Input
            className='view-customer-search-input'
            placeholder='Search customers...'
            size='large'
            value={searchInput}
            allowClear
            prefix={<SearchOutlined className={'mr-1'} />}
            onChange={(e) => handleSearchChange(e)}
          />
        </Horizontal>
        <Vertical className={'mt-4'} style={{ height: '500px' }} scroll>
          {filteredCustomers?.map((customer) => (
            <Texto className={'my-2'} category={'p1'} key={customer}>
              {customer?.toUpperCase()}
            </Texto>
          ))}
          {/*<Collapse*/}
          {/*  accordion*/}
          {/*  ghost*/}
          {/*  expandIconPosition='left'*/}
          {/*  collapsible='header'*/}
          {/*  className={'view-customers-collapse '}*/}
          {/*  expandIcon={({ isActive }) => (*/}
          {/*    <RightOutlined rotate={isActive ? 90 : 0} style={{ fontSize: '10px', color: 'var(--gray-500)' }} />*/}
          {/*  )}*/}
          {/*>*/}
          {/*  {filteredCustomers?.map((customer) => (*/}
          {/*    <Panel*/}
          {/*      className={'view-customers-panel-body'}*/}
          {/*      header={*/}
          {/*        <Vertical>*/}
          {/*          <Texto category={'h6'}>{customer?.toUpperCase()}</Texto>*/}
          {/*          <Horizontal className={'mb-2'} verticalCenter>*/}
          {/*            <ShopOutlined className={'mr-1'} style={{ color: 'var(--gray-500)' }} />*/}
          {/*            <Texto appearance={'hint'} category={'h6'}>*/}
          {/*              Company A*/}
          {/*            </Texto>*/}
          {/*          </Horizontal>*/}
          {/*          <Divider className={'m-0'} />*/}
          {/*        </Vertical>*/}
          {/*      }*/}
          {/*      key={customer}*/}
          {/*    >*/}
          {/*      <Horizontal className={'view-customers-collapse-panel-container'}>*/}
          {/*        <Vertical>*/}
          {/*          <Texto category={'p1'} appearance={'hint'} weight={'bold'}>*/}
          {/*            Response Time*/}
          {/*          </Texto>*/}
          {/*          <Texto category={'p2'}>2.5h</Texto>*/}
          {/*        </Vertical>*/}
          {/*        <Vertical>*/}
          {/*          <Texto category={'p1'} appearance={'hint'} weight={'bold'}>*/}
          {/*            Total Deals*/}
          {/*          </Texto>*/}
          {/*          <Texto category={'p2'}>45</Texto>*/}
          {/*        </Vertical>*/}
          {/*        <Vertical>*/}
          {/*          <Texto category={'p1'} appearance={'hint'} weight={'bold'}>*/}
          {/*            Total Volume*/}
          {/*          </Texto>*/}
          {/*          <Texto category={'p2'}>2.50M gal</Texto>*/}
          {/*        </Vertical>*/}
          {/*        <Vertical>*/}
          {/*          <Texto category={'p1'} appearance={'hint'} weight={'bold'}>*/}
          {/*            Deal Count*/}
          {/*          </Texto>*/}
          {/*          <Texto category={'p2'}>45 deals</Texto>*/}
          {/*        </Vertical>*/}
          {/*      </Horizontal>*/}
          {/*    </Panel>*/}
          {/*  ))}*/}
          {/*</Collapse>*/}
        </Vertical>
        <Horizontal className={'mt-4'}>
          <Texto>
            Showing {filteredCustomers?.length} of {stage?.customers?.length} customers
          </Texto>
        </Horizontal>
      </Vertical>
    </Modal>
  )
}
