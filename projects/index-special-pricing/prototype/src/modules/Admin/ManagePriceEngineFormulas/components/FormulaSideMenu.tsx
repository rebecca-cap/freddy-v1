import './formula-side-menu.css'

import { DeleteOutlined, EditOutlined, EllipsisOutlined, FolderOutlined, FunctionOutlined } from '@ant-design/icons'
import { usePriceEngineFormulas } from '@api/usePriceEngineFormulas'
import { IFormulaMetadataResponse, IFormulaOverviewResponse } from '@api/usePriceEngineFormulas/types'
import { NewMarkerPopover } from '@components/shared/Hierarchies/components/NewMarkerPopover'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Divider, Dropdown, Input, Menu, Modal, Tooltip } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

interface IComponentProps {
  selectedFormulaId?: IFormulaOverviewResponse['Data'][number]['FormulaId']
  selectedFormula?: IFormulaOverviewResponse['Data'][number]
  formulas?: IFormulaOverviewResponse
  setIsQuickSearchFocused: (isFocused: boolean) => void
  metadata?: IFormulaMetadataResponse
  onNewFormula: () => void
  onFormulaClick: (id: IFormulaOverviewResponse['Data'][number]['FormulaId']) => void
  canWrite: boolean
}

export const FormulaSideMenu: React.FC<IComponentProps> = ({
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
  const [expandedGroupKeys, setExpandedGroupKeys] = useState<string[]>([])
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<string[]>([selectedFormulaId?.toString()])
  const [newMarkerFormVisible, setNewMarkerFormVisible] = useState(false)
  const [formulaQuickSearchText, setFormulaQuickSearchText] = useState('')
  const { useFormulaMarkerDeleteMutation } = usePriceEngineFormulas()
  const deleteMarker = useFormulaMarkerDeleteMutation()

  useEffect(() => {
    if (formulaQuickSearchText) {
      setExpandedGroupKeys(Object.keys(groupedFormulas))
    }
  }, [formulaQuickSearchText])

  const activeEditedMarker = useMemo(
    () => metadata?.Markers?.find((m) => m.Text === activeEditMarkerKey),
    [activeEditMarkerKey, metadata?.Markers]
  )
  const groupedFormulas = useMemo(() => {
    const initialGroups = {}

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

    // remove entires with no formulas
    Object.entries(initialGroups).forEach(([group, formulas]) => {
      if (!formulas.length) {
        delete initialGroups[group]
      }
    })

    const sortedGroups = Object.entries(initialGroups)
      .sort(([a], [b]) => {
        if (a === 'Other') return 1 // 'Other' should come last
        if (b === 'Other') return -1 // 'Other' should come last
        return a.localeCompare(b) // Sort alphabetically for other groups
      })
      .reduce((acc, [group, formulas]) => {
        acc[group] = formulas
        return acc
      }, {})

    return sortedGroups
  }, [formulas, formulaQuickSearchText])

  const emptyMarkers = useMemo(
    () => metadata?.Markers?.filter((m) => !groupedFormulas?.[m.Text]),
    [metadata?.Markers, groupedFormulas]
  )

  // When the selected formula changes, update the selected menu keys
  useEffect(() => {
    setSelectedMenuKeys([selectedFormulaId?.toString()])
  }, [selectedFormulaId])

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
    <Vertical flex={0.15} className='bg-1'>
      <Horizontal justifyContent='space-between' className='px-3 py-3' height='auto' verticalCenter>
        <Texto category='h4'>Formulas</Texto>
        {canWrite && (
          <Horizontal style={{ gap: '0.5rem' }}>
            <NewMarkerPopover
              setActiveEditMarkerKey={setActiveEditMarkerKey}
              onVisibleChange={(visible) => setNewMarkerFormVisible(visible)}
              visible={newMarkerFormVisible || !!activeEditedMarker}
              activeMarker={activeEditedMarker}
              setNewMarkerFormVisible={setNewMarkerFormVisible}
              productOptions={metadata?.ProductHierarchies}
              locationOptions={metadata?.LocationHierarchies}
              counterPartyHierarchyOptions={metadata?.CounterPartyHierarchies}
            />
            <Tooltip title='Create New Formula' placement='bottomRight'>
              <Button icon={<FunctionOutlined />} onClick={onNewFormula} />
            </Tooltip>
          </Horizontal>
        )}
      </Horizontal>
      <Vertical>
        <Input.Search
          onFocus={() => setIsQuickSearchFocused(true)}
          onBlur={() => setIsQuickSearchFocused(false)}
          placeholder='Search Formulas'
          size='large'
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
            height: '100%',
            overflowY: 'scroll',
            overflowX: 'hidden',
            backgroundColor: 'var(--bg-2)',
          }}
          onOpenChange={(openKeys) => setExpandedGroupKeys(openKeys)}
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
                icon={<FolderOutlined />}
                key={group}
                style={{
                  fontWeight: group === 'Other' ? 400 : 600,
                  fontStyle: group === 'Other' ? 'italic' : '',
                }}
                title={
                  group === 'Other' ? (
                    'Unmarked Formulas'
                  ) : (
                    <Horizontal justifyContent='space-between' alignItems='center'>
                      <Texto>
                        <Tooltip title={group}>{group}</Tooltip>
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
                  )
                }
              >
                {children?.map((c) => (
                  <Menu.Item
                    icon={<FunctionOutlined />}
                    key={c.FormulaId}
                    onClick={() => onFormulaClick(c.FormulaId)}
                    style={{ backgroundColor: 'white', margin: 0, padding: '18px', fontWeight: 'normal' }}
                  >
                    {c.Name}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            )
          })}
          {!formulaQuickSearchText && emptyMarkers?.length > 0 && (
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
                  <Menu.SubMenu
                    disabled
                    key={m.Value}
                    title={
                      <Horizontal justifyContent='space-between' alignItems='center'>
                        <Texto>{m.Text || '(Unamed Marker)'}</Texto>
                        <div className='mb-2'>
                          <Dropdown
                            overlayStyle={{ minWidth: 160 }}
                            placement='bottomRight'
                            overlay={
                              <Menu
                                items={[
                                  {
                                    key: 'Delete',
                                    label: 'Delete Marker',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: 'Are you sure you want to delete this marker?',
                                        content: 'This action cannot be undone.',
                                        onOk: () => {
                                          deleteMarker.mutate(m.Value)
                                        },
                                      })
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
                      </Horizontal>
                    }
                  >
                    <Menu.Item key={m.Name} onClick={() => onFormulaClick(m.Name)}>
                      {m.Name}
                    </Menu.Item>
                  </Menu.SubMenu>
                )
              })}
            </Menu.ItemGroup>
          )}
        </Menu>
      </Vertical>
    </Vertical>
  )
}
