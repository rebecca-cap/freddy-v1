import { DownOutlined, EnvironmentOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons'
import { Horizontal, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Checkbox, Input } from 'antd'
import React, { useEffect, useState } from 'react'

export function CustomerAvailability({ metadata, locations, selectedRows, createUpdateLocationManagementMutation }) {
  const selectedLocation = selectedRows[0]
  const relatedLocations = selectedLocation?.MarketPlatformAssociatedProducts.map((id) => id.toString())

  useEffect(() => {
    const locationSelectionList = metadata?.Data?.LocationGroups.map((group) => {
      const groupLocations = locations?.Data?.filter(
        (location) => location.LocationGroupId && location.LocationGroupId.toString() === group.Value
      ).map((location) => {
        return { ...location, selected: relatedLocations?.includes(location.LocationId.toString()) }
      })

      const allItemsSelected = groupLocations?.length
        ? groupLocations.filter((p) => p.selected === true).length === groupLocations.length
        : false

      return { ...group, selected: allItemsSelected, collapsed: false, groupLocations }
    })
    setLocationGroups(locationSelectionList)
    setSearchResults(searchLocations(searchString, locationSelectionList))
  }, [selectedLocation])

  const [locationGroups, setLocationGroups] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchString, setSearchString] = useState(null)

  const collapseHeader = (event, group) => {
    const isClickingHeader = event.target.innerHTML !== event.target.textContent || event.target.textContent
    if (!isClickingHeader) return

    const updateLocationGroups = locationGroups.map((item) => {
      if (item.Value === group.Value) {
        return { ...item, collapsed: !item.collapsed }
      }
      return item
    })
    setLocationGroups(updateLocationGroups)
    setSearchResults(searchLocations(searchString, updateLocationGroups))
  }

  const handleGroupChange = (group) => {
    const updateLocationGroups = locationGroups.map((item) => {
      const searchResultGroupLocations = searchResults
        .find((searchGroup) => item.Value === searchGroup.Value)
        ?.groupLocations?.map((searchLocation) => searchLocation.LocationId)

      if (item.Value === group.Value) {
        const updatedSelectedLocations = item.groupLocations.map((location) => {
          return {
            ...location,
            selected: searchResultGroupLocations.includes(location.LocationId) ? !item.selected : item.selected,
          }
        })

        const allItemsSelected =
          updatedSelectedLocations.filter((p) => p.selected).length === searchResultGroupLocations.length

        return { ...item, selected: allItemsSelected, groupLocations: updatedSelectedLocations }
      }
      return item
    })
    setLocationGroups(updateLocationGroups)
    setSearchResults(searchLocations(searchString, updateLocationGroups))
    return saveRelatedLocations(updateLocationGroups)
  }

  const handleLocationChange = (group, location) => {
    const updateLocationGroups = locationGroups.map((item) => {
      if (item.Value === group.Value) {
        const updatedSelectedLocations = item.groupLocations.map((locationItem) => {
          if (locationItem.LocationId === location.LocationId) {
            if (!locationItem.selected) {
            }
            return { ...location, selected: !locationItem.selected }
          }
          return locationItem
        })

        const allItemsSelected =
          updatedSelectedLocations.filter((p) => p.selected).length === item.groupLocations.length

        return { ...item, selected: allItemsSelected, groupLocations: updatedSelectedLocations }
      }
      return item
    })
    setLocationGroups(updateLocationGroups)
    setSearchResults(searchLocations(searchString, updateLocationGroups))
    return saveRelatedLocations(updateLocationGroups)
  }

  const saveRelatedLocations = (updateLocationGroups) => {
    const selectedLocationIds: string[] = []

    updateLocationGroups.forEach((g) => {
      g.groupLocations.forEach((p) => {
        if (p.selected) {
          selectedLocationIds.push(p.LocationId)
        }
      })
    })

    const updatedLocation = {
      ...selectedLocation,
      MarketPlatformAssociatedProducts: [...selectedLocationIds],
    }
    return createUpdateLocationManagementMutation.mutateAsync([updatedLocation])
  }

  const searchLocations = (input, searchList?) => {
    const list = searchList || locationGroups
    const searchText = input?.toLowerCase()

    setSearchString(searchText)

    if (!searchText) {
      setSearchResults(list)
      return list
    }

    const matchingGroups = []

    list.forEach((group) => {
      const matchingLocations = []
      group.groupLocations.forEach((location) => {
        if (location.Name.toLowerCase().includes(searchText)) {
          matchingLocations.push(location)
        }
      })

      if (matchingLocations.length > 0) {
        matchingGroups.push({
          ...group,
          groupLocations: matchingLocations,
        })
      }
    })

    setSearchResults(matchingGroups)

    return matchingGroups
  }
  return (
    <Vertical style={{ minHeight: 'auto' }}>
      <Horizontal className='px-4 pt-3 py-2 bg-2'>
        <Texto category='h3'>Customer Availability</Texto>
      </Horizontal>
      <Horizontal>
        <Input
          prefix={<SearchOutlined />}
          placeholder='Quick Search'
          value={searchString}
          onChange={(event) => searchLocations(event.target.value)}
          allowClear
          disabled={!selectedLocation}
        />
      </Horizontal>
      {!!searchResults?.length && selectedLocation && (
        <Vertical
          style={{
            maxHeight: '78%',
            overflowY: 'auto',
          }}
        >
          {searchResults.map((group) => {
            return (
              <div>
                <Horizontal
                  className='px-4 py-2 bordered justify-sb'
                  verticalCenter
                  onClick={(event) => collapseHeader(event, group)}
                  style={{
                    backgroundColor: group?.selected ? 'var(--theme-color-2-dim)' : '',
                  }}
                >
                  <Horizontal verticalCenter style={{ gap: 10 }}>
                    <Checkbox
                      disabled={searchString || !group?.groupLocations?.length}
                      checked={group?.selected}
                      onChange={() => handleGroupChange(group)}
                    />
                    <EnvironmentOutlined />
                    <Texto category='p2' weight={600} style={{ color: group?.selected ? 'var(--theme-color-2)' : '' }}>
                      {group.Text}
                    </Texto>
                  </Horizontal>
                  <Horizontal verticalCenter style={{ gap: 10 }}>
                    <Texto
                      className='px-2 py-1'
                      appearance='white'
                      style={{
                        backgroundColor: 'var(--theme-color-2)',
                        borderRadius: 3,
                        minWidth: 30,
                        textAlign: 'center',
                      }}
                    >
                      {group.selected ? 'ALL' : group.groupLocations.filter((item) => item.selected).length}
                    </Texto>
                    {group?.collapsed ? <RightOutlined /> : <DownOutlined style={{ color: 'var(--theme-color-2)' }} />}
                  </Horizontal>
                </Horizontal>
                {!group.collapsed && (
                  <Horizontal className='bordered  bg-1'>
                    <Vertical className='mx-4 my-2'>
                      {!!group?.groupLocations?.length &&
                        group?.groupLocations.map((location) => {
                          return (
                            <Horizontal
                              className='my-1 p-2 bordered'
                              verticalCenter
                              style={{
                                gap: 10,
                                borderRadius: 5,
                                borderColor: location?.selected ? 'var(--theme-color-2)' : '',
                                backgroundColor: location?.selected ? 'var(--theme-color-2-dim)' : '',
                              }}
                              onClick={() => handleLocationChange(group, location)}
                            >
                              <Checkbox checked={location?.selected} />
                              <Texto category='p1' weight={600}>
                                {location?.Name}
                              </Texto>
                            </Horizontal>
                          )
                        })}
                      {!group?.groupLocations?.length && (
                        <Horizontal
                          className='my-1 p-2'
                          verticalCenter
                          horizontalCenter
                          style={{ gap: 10, borderRadius: 5 }}
                        >
                          <Texto appearance='hint'>There are no locations for this location group</Texto>
                        </Horizontal>
                      )}
                    </Vertical>
                  </Horizontal>
                )}
              </div>
            )
          })}
        </Vertical>
      )}
      {!selectedLocation && (
        <Vertical verticalCenter>
          <Horizontal verticalCenter horizontalCenter>
            <NothingMessage
              title='Location Not Selected'
              message='Select a location to manage the related locations for it.'
            />
          </Horizontal>
        </Vertical>
      )}
    </Vertical>
  )
}
