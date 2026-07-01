import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { useOpisCurves } from '@modules/Admin/ManageOpisCurves/api/useOpisCurves'
import { ManageOpisCurvesGrid } from '@modules/Admin/ManageOpisCurves/components/Grid/ManageOpisCurvesGrid'
import React from 'react'

export function ManageOpisCurves() {
  const { getOpisCurves, getOpisMetadata, ActivateOpisCurves, updateInstrumentSymbol } =
    useOpisCurves()
  const { data: OpisCurves, isLoading: isOpisCurvesLoading } = getOpisCurves()
  const { data: opisMetadata, isLoading: isOpisMetadataLoading } = getOpisMetadata()
  const activateOpisCurvesMutation = ActivateOpisCurves()
  const updateInstrumentSymbolMutation = updateInstrumentSymbol()

  return (
    <Horizontal className='full-height-width'>
      <Vertical height='94vh'>
        <ManageOpisCurvesGrid
          OpisCurves={OpisCurves}
          isOpisCurvesLoading={isOpisCurvesLoading}
          opisMetadata={opisMetadata}
          isOpisMetadataLoading={isOpisMetadataLoading}
          activateOpisCurvesMutation={activateOpisCurvesMutation}
          updateInstrumentSymbolMutation={updateInstrumentSymbolMutation}
        />
      </Vertical>
    </Horizontal>
  )
}
