/* eslint-disable camelcase */
// @ts-nocheck

import { ResponsiveLine } from '@nivo/line'
import { Col, Row } from 'antd'
import moment from 'moment'
import { ReadableDifference, addCommasToNumber } from '../../../Utils/general'

/**
 * @deprecated
 * Do not use this component. This component was flag as 'unused' and will be removed in the future.
 */
export const MyResponsiveLine = ({
  data,
  markers,
  y_max,
  ticks_to_show,
  legend = 'Gallons',
  xaxisFormat = 'M/D hA',
  curve = 'monotoneX',
  enableArea = true,
  enableGridY = false,
  enableGridX = false,
  colors = { scheme: 'paired' },
  hideAxisBottom = false,
  hideAxisLeft = false,
  legends = [
    {
      anchor: 'bottom-right',
      direction: 'column',
      justify: false,
      translateX: 100,
      translateY: 0,
      itemsSpacing: 0,
      itemDirection: 'left-to-right',
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.75,
      symbolSize: 12,
      symbolShape: 'circle',
      symbolBorderColor: 'rgba(0, 0, 0, .5)',
      effects: [
        {
          on: 'hover',
          style: {
            itemBackground: 'rgba(0, 0, 0, .03)',
            itemOpacity: 1,
          },
        },
      ],
    },
  ],
  marginTop = 50,
  marginBottom = 50,
  marginRight = 100,
  marginLeft = 70,
  tooltipX = 'Date:',
  tooltipY = 'Time:',
  tooltipZ = 'Volume:',
  enablePoints = false,
}) => {
  const dateIsInThePast = (estimated_run_out) => {
    const runOutDate = moment(estimated_run_out)
    const now = moment().utc()
    return runOutDate <= now ? 'run-out-warning' : ''
  }
  function GetMarkers(markers) {
    return markers.map((marker) => ({
      axis: 'y',
      value: marker.value,
      legend: marker.name,
      lineStyle: {
        stroke: marker.color || '#64d28d',
        strokeWidth: marker.width || 3,
      },
      textStyle: {
        fill: marker.textColor || marker.color || '#64d28d',
        fontSize: marker.fontSize || 11,
      },
    }))
  }

  let axisBottonSettings = null
  if (hideAxisBottom === false) {
    axisBottonSettings = {
      orient: 'bottom',
      tickSize: 0,
      tickPadding: 5,
      legend: '',
      legendOffset: 30,
      legendPosition: 'middle',
      format: (v) =>
        ticks_to_show.find((vts) => vts === v)
          ? moment(v).format(xaxisFormat)
          : '',
    }
  }

  let axisLeftSettings = null
  if (hideAxisLeft === false) {
    axisLeftSettings = {
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: legend,
      legendOffset: -40,
      legendPosition: 'middle',
      format: '.2s',
    }
  }

  return (
    <ResponsiveLine
      data={data}
      margin={{
        top: marginTop,
        right: marginRight,
        bottom: marginBottom,
        left: marginLeft,
      }}
      yScale={{
        type: 'linear',
        min: 0,
        max: y_max,
        stacked: false,
        reverse: false,
      }}
      curve={curve}
      enablePoints={enablePoints}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      theme={{
        fontFamily: 'proxima-nova',
        textColor: 'var(--gray-700)',
        fontWeight: 'bold',
      }}
      pointBorderColor={{ from: 'serieColor' }}
      pointBorderWidth={2}
      pointLabel='y'
      pointLabelYOffset={-12}
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottonSettings}
      axisLeft={axisLeftSettings}
      tooltip={(data) => {
        const date = data.point.data.x
        const formattedDate = moment(date).format('ddd h:mm A')
        const runoutClass = dateIsInThePast(date)
        const readableDifference = ReadableDifference(date)
        const formattedToolTip = (
          <span className={runoutClass}>{readableDifference}</span>
        )
        return (
          <div style={{ height: 80 }} className='tank-forecast-chart-tooltip'>
            <Row>
              <Col>
                <b>{tooltipX} </b>
                {formattedDate}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>{tooltipY} </b>
                {formattedToolTip}
              </Col>
            </Row>
            <Row>
              <Col>
                <b>{tooltipZ} </b>
                {addCommasToNumber(data.point.data.y.toFixed(0))}
              </Col>
            </Row>
          </div>
        )
      }}
      enableGridY={enableGridY}
      enableGridX={enableGridX}
      colors={colors}
      enableArea={enableArea}
      useMesh
      markers={GetMarkers(markers)}
      legends={legends}
    />
  )
}
