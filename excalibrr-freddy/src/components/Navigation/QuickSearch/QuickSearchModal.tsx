import { SearchOutlined } from '@ant-design/icons'
import { Modal, Select } from 'antd'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Texto } from '../../DataDisplay/Texto/Texto'
import { Horizontal } from '../../Layout/Horizontal'
import { CommandObject } from '../NavigationContext'
const { Option } = Select

type Props = {
  boxVisible: boolean
  setBoxVisibile: (visible: boolean) => void
  handleQuickSearchSelect: (url: string) => void
  commandObjects: CommandObject[]
}

export const QuickSearchModal: React.FC<Props> = ({
  boxVisible,
  setBoxVisibile,
  handleQuickSearchSelect,
  commandObjects,
}) => {
  return (
    <Modal
      visible={boxVisible}
      onCancel={() => {
        setBoxVisibile(false)
      }}
      className='quick-search-modal'
      destroyOnClose
      width={600}
      closable={false}
      maskClosable
      footer={null}
    >
      <QuickSearch
        handleQuickSearchSelect={handleQuickSearchSelect}
        commandObjects={commandObjects}
        boxVisible={boxVisible}
      />
    </Modal>
  )
}

type QuickSearchProps = {
  boxVisible: boolean
  handleQuickSearchSelect: (url: string) => void
  commandObjects: CommandObject[]
}

const QuickSearch: React.FC<QuickSearchProps> = ({
  commandObjects,
  boxVisible,
  handleQuickSearchSelect,
}) => {
  const inputRef = useRef<any>(null) // Can't get antds select ref type for some reason
  const [selected, setSelected] = useState<string | undefined>('')
  useEffect(() => {
    if (boxVisible) {
      inputRef?.current?.focus()
    }
  }, [boxVisible])
  return (
    <Fragment>
      <Texto
        category='heading'
        className='flex items-center py-4 px-3 border-bottom'
      >
        <SearchOutlined className='pr-3' />
        Quick Search
      </Texto>

      <Select
        showAction={['focus']}
        ref={inputRef}
        size='large'
        style={{ width: '100%' }}
        filterOption={(input, option) => {
          return (option?.value as string)
            ?.toLowerCase()
            .includes(input.toLowerCase())
        }}
        showSearch
        value={selected}
        onSelect={(a: any, option: any) => {
          inputRef.current.blur()
          if (commandObjects[Number(option.key)]) {
            handleQuickSearchSelect(commandObjects[Number(option.key)].exactURL)
          }
          setSelected(undefined)
          return // 🤔 why tf do I need this
        }}
      >
        {commandObjects.map((command, i) => (
          <Option value={command.name} key={i}>
            <Horizontal verticalCenter>
              <Texto
                category='h6'
                weight={500}
                className='flex items-center my-3'
              >
                <div className='pr-3'> {command.icon}</div>
                {command.name}
              </Texto>
              <Texto
                category='label'
                align='right'
                appearance='medium'
                className='pl-2 flex-1'
              >
                {command.description}
              </Texto>
            </Horizontal>
          </Option>
        ))}
      </Select>
    </Fragment>
  )
}
