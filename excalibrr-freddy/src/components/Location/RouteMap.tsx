/* global google */
// @ts-nocheck
// This is one of the only components left in our entire codebase that uses class components instead of functional components
// Letting typescript skip this one for my sanity

import { memo, Component } from 'react'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  DirectionsRenderer,
} from 'react-google-maps'

export type Stop = {
  lat: number
  lng: number
}

type RouteMapProps = {
  stops: Stops[]
  options?: any
}

export const RouteMap = memo(function RouteMap({
  stops,
  options,
}: RouteMapProps) {
  const MapLoader = withScriptjs(MapWithRoute)
  return (
    <MapLoader
      // @ts-ignore - withScriptjs doesn't really tell us anything about the dynamic component, so we have to ignore this
      options={options}
      googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyA63E33ZAzfRnM3_pWAlRU32QFXNFk9kts'
      loadingElement={<div style={{ height: `100%` }} />}
      stops={stops}
    />
  )
})

class MapWithRoute extends Component {
  state = {
    directions: { routes: [] },
  }

  componentDidMount() {
    const directionsService = new google.maps.DirectionsService()

    const { stops } = { ...this.props }
    const stopCopy = [...stops]
    const origin = stopCopy.shift()
    const destination = stopCopy.pop()
    const waypoints = stopCopy.map((stop) => {
      return { location: new google.maps.LatLng(stop.lat, stop.lng) }
    })

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypoints,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          })
        } else {
          console.error(`error fetching directions ${result}`)
        }
      }
    )
  }

  render() {
    const GoogleMapExample = withGoogleMap((props) => (
      <GoogleMap
        options={{
          fullscreenControl: false,
          disableDefaultUI: true,
          ...props.options,
        }}
      >
        <DirectionsRenderer directions={this.state.directions} />
      </GoogleMap>
    ))

    return (
      <GoogleMapExample
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        options={this.props.options}
      />
    )
  }
}
