import './market-platform-formula-side-menu.css'

import { EditOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import {
  FormulaData,
  Marker,
  MarketPlatformFormulaMetadata,
  MarketPlatformFormulasResponse,
} from '@api/useMarketPlatformFormulas/types'
import LivePriceActiveIcon from '@assets/icons/LivePriceActive'
import LivePriceInactiveIcon from '@assets/icons/LivePriceInactive'
import { NewMarkerPopover } from '@components/shared/Hierarchies/components/NewMarkerPopover'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Divider, Dropdown, Input, Menu, Tooltip } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

interface IComponentProps {
  selectedFormulaId?: MarketPlatformFormulasResponse['Data'][number]['FormulaId']
  selectedFormula?: MarketPlatformFormulasResponse['Data'][number]
  formulas: MarketPlatformFormulasResponse | undefined
  setIsQuickSearchFocused: (isFocused: boolean) => void
  onNewFormula: () => void
  onFormulaClick: (id: MarketPlatformFormulasResponse['Data'][number]['FormulaId']) => void
  canWrite: boolean
  metadata: MarketPlatformFormulaMetadata | undefined
}

interface InitialGroups {
  [key: string]: FormulaData[]
}
export const MarketPlatformFormulaSideMenu: React.FC<IComponentProps> = ({
  selectedFormulaId,
  selectedFormula,
  formulas,
  setIsQuickSearchFocused,
  metadata,
  onNewFormula,
  onFormulaClick,
  canWrite,
}) => {
  const [activeEditMarkerKey, setActiveEditMarkerKey] = useState<string | null>(null)
  const [newMarkerFormVisible, setNewMarkerFormVisible] = useState(false)

  const [expandedGroupKeys, setExpandedGroupKeys] = useState<string[]>([])
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([selectedFormulaId?.toString()])
  const [formulaQuickSearchText, setFormulaQuickSearchText] = useState('')

  const activeEditedMarker = useMemo(() => {
    return metadata?.Markers?.find((m) => m.Text === activeEditMarkerKey)
  }, [activeEditMarkerKey, metadata?.Markers])

  useEffect(() => {
    if (formulaQuickSearchText) {
      const groupKeys = Object.keys(groupedFormulas) as string[]
      setExpandedGroupKeys(groupKeys)
    }
  }, [formulaQuickSearchText])

  const groupedFormulas = useMemo(() => {
    const initialGroups: InitialGroups = {}

    if (metadata) {
      formulas?.Data?.forEach((formula) => {
        const group = formula?.MarkerName || 'Other'

        if (!initialGroups[group]) {
          initialGroups[group] = []
        }

        // Apply the quick search filter here
        if (!formulaQuickSearchText || formula.Name.toLowerCase().includes(formulaQuickSearchText.toLowerCase())) {
          initialGroups[group].push({ ...formula })
        }
      })

      // remove entries with no formulas
      Object.entries(initialGroups).forEach(([group, groupData]: [string, FormulaData[]]) => {
        if (!groupData.length) {
          delete initialGroups[group]
        }
      })

      const sortedGroups = Object.entries(initialGroups)
        .sort(([a], [b]) => {
          if (a === 'Other') return 1 // 'Other' should come last
          if (b === 'Other') return -1 // 'Other' should come last
          return a.localeCompare(b) // Sort alphabetically for other groups
        })
        .reduce((acc, [group, groupData]) => {
          acc[group] = groupData
          return acc
        }, {})

      return sortedGroups
      // return initialGroups
    }
    return initialGroups
  }, [formulas, formulaQuickSearchText, metadata])

  // When the selected formula changes, update the selected menu keys
  useEffect(() => {
    setSelectedMenuKeys([selectedFormulaId?.toString()])
  }, [selectedFormulaId])

  const emptyMarkers: Marker[] | undefined = useMemo(
    () => metadata?.Markers?.filter((m) => !groupedFormulas?.[m.Text]),
    [metadata?.Markers, groupedFormulas]
  )

  // When the selected formula changes, expand the appropriate group
  // We watch groupedFormulas since newly inserted formulas that don't
  // have a marker name will be grouped under 'Other'
  useEffect(() => {
    Object.entries(groupedFormulas ?? {}).forEach(([groupKey, formulas]) => {
      if (formulas?.find((f) => f.FormulaId === selectedFormulaId)) {
        setExpandedGroupKeys([groupKey])
      }
    })
  }, [groupedFormulas, selectedFormula])

  return (
    <Vertical flex={0.15} className='bg-1 mr-3'>
      <Horizontal justifyContent='space-between' className='px-2 py-3' height='auto' verticalCenter>
        <Texto className='formula-title'>Formulas</Texto>
        {canWrite && (
          <Horizontal verticalCenter style={{ gap: 10 }}>
            <Tooltip title='Create New Formula' placement='bottomRight'>
              <GraviButton
                icon={<PlusOutlined />}
                size='small'
                buttonText='New Formula'
                theme2
                onClick={onNewFormula}
              />
            </Tooltip>
            <NewMarkerPopover
              setActiveEditMarkerKey={setActiveEditMarkerKey}
              onVisibleChange={(visible) => setNewMarkerFormVisible(visible)}
              visible={newMarkerFormVisible || !!activeEditedMarker}
              activeMarker={activeEditedMarker}
              setNewMarkerFormVisible={setNewMarkerFormVisible}
              productOptions={metadata?.ProductHierarchies}
              locationOptions={metadata?.LocationHierarchies}
              counterPartyHierarchyOptions={metadata?.CounterPartyHierarchies}
              canInsertNewMarker={false}
            />
          </Horizontal>
        )}
      </Horizontal>
      <Vertical>
        <Input.Search
          onFocus={() => setIsQuickSearchFocused(true)}
          onBlur={() => setIsQuickSearchFocused(false)}
          placeholder='Quick Search'
          size='middle'
          value={formulaQuickSearchText}
          onChange={(e) => setFormulaQuickSearchText(e.target.value)}
          {...(formulaQuickSearchText && {
            enterButton: <Button onClick={() => setFormulaQuickSearchText('')}>Clear</Button>,
          })}
        />

        <Menu
          style={{
            width: '100%',
            maxHeight: '95vh',
            // height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: 'var(--bg-2)',
          }}
          onOpenChange={(openKeys) => {
            setExpandedGroupKeys(openKeys)
          }}
          openKeys={expandedGroupKeys}
          selectedKeys={selectedMenuKeys}
          mode='inline'
        >
          {!Object.keys(groupedFormulas ?? {}).length && (
            <Texto category='h5' className='p-4' appearance='medium'>
              No results found
            </Texto>
          )}
          {Object.entries(groupedFormulas ?? {})?.map(([group, children]) => {
            return (
              <Menu.SubMenu
                key={group}
                style={{
                  fontWeight: 600,
                }}
                title={
                  <Horizontal justifyContent='space-between' alignItems='center'>
                    <Texto category='p2'>
                      <Tooltip title={group}>
                        {group} ({children?.length})
                      </Tooltip>
                    </Texto>
                    {canWrite && (
                      <div className='mb-2'>
                        <Dropdown
                          overlayStyle={{ minWidth: 160 }}
                          placement='bottomRight'
                          overlay={
                            <Menu
                              items={[
                                {
                                  key: 'Update',
                                  label: 'Update Marker',
                                  icon: <EditOutlined />,
                                  onClick: (e) => {
                                    e.domEvent.stopPropagation()
                                    setActiveEditMarkerKey(group)
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
                    )}
                  </Horizontal>
                }
              >
                {!children.length && (
                  <Texto className='p-4' appearance='medium'>
                    No formulas found
                  </Texto>
                )}
                {children?.map((c) => (
                  <Menu.Item
                    className={'menu-item-padding custom-menu-item-padding'}
                    key={c.FormulaId}
                    onClick={() => onFormulaClick(c.FormulaId)}
                    style={{
                      backgroundColor: 'white',
                      margin: 0,
                      fontWeight: 'normal',
                      fontSize: '13px',
                      width: '100%',
                    }}
                  >
                    <Horizontal verticalCenter justifyContent='space-between' style={{ width: '100%' }}>
                      <Tooltip title={c.Name} placement='right' overlayStyle={{ marginLeft: '100px' }}>
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                            marginRight: 5,
                          }}
                        >
                          {c.Name}
                        </span>
                      </Tooltip>
                      {c.LivePrice && <LivePriceActiveIcon />}
                      {!c.LivePrice && <LivePriceInactiveIcon />}
                    </Horizontal>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            )
          })}
          {!formulaQuickSearchText && emptyMarkers && emptyMarkers?.length > 0 && (
            <Menu.ItemGroup
              title={
                <Vertical>
                  <Divider style={{ margin: 0, paddingBottom: '1.5rem' }} />
                  <Texto category='heading-small' appearance='medium' className='ml-3'>
                    Empty Markers
                  </Texto>
                </Vertical>
              }
              style={{ fontWeight: 600 }}
            >
              {emptyMarkers?.map((m) => {
                return (
                  <Menu.ItemGroup
                    key={m.Value}
                    icon={undefined}
                    title={
                      <Horizontal justifyContent='space-between' alignItems='center'>
                        <Texto>{m.Text || '(Unamed Marker)'}</Texto>
                      </Horizontal>
                    }
                  />
                )
              })}
            </Menu.ItemGroup>
          )}
        </Menu>
      </Vertical>
    </Vertical>
  )
}
