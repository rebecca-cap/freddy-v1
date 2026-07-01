import { Popover } from 'antd'
import GoogleMapReact from 'google-map-react'

type Props = {
  mapCenter: {
    lat: number
    lng: number
  }
  location: {
    lat: number
    lon: number
  }
  popOverContent?: React.ReactNode
  popOverTitle?: string
  extraOptions?: any
}

export const LocationMap: React.FC<Props> = ({
  mapCenter,
  location,
  popOverContent,
  popOverTitle = 'Details',
  extraOptions,
}) => {
  return (
    <GoogleMapReact
      // @ts-ignore - this is probably a dead class name since the GoogleMapReact component doesn't list it as a prop
      className='google-react-map'
      bootstrapURLKeys={{
        key: 'AIzaSyA63E33ZAzfRnM3_pWAlRU32QFXNFk9kts',
      }}
      hover={0}
      center={mapCenter}
      zoom={8}
      options={{
        ...extraOptions,
        fullscreenControl: false,
        disableDefaultUI: true,
      }}
    >
      {popOverContent ? (
        <Popover content={popOverContent} title={popOverTitle}>
          <div
            className='map-mark-icon'
            // @ts-ignore - These are probably being accessed, but they should be named differently (data-lat, data-lng, etc)
            lat={location.lat}
            lng={location.lon}
          />
        </Popover>
      ) : (
        // @ts-ignore - These are probably being accessed, but they should be named differently (data-lat, data-lng, etc)
        <div className='map-mark-icon' lat={location.lat} lng={location.lon} />
      )}
    </GoogleMapReact>
  )
}
