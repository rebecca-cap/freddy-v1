import { useMarketPlatformFormulas } from '@api/useMarketPlatformFormulas'
import {
  FormulaData,
  LivePriceType,
  MarketPlatformFormulaMetadata,
  MarketPlatformFormulasResponse,
  VariablesItem,
} from '@api/useMarketPlatformFormulas/types'
import { initializeNewVariable } from '@components/shared/Formulas/helpers'
import { useUser } from '@contexts/UserContext'
import { getMarketPlatformFormulasVariableColumnDefs } from '@modules/Admin/ManageMarketPlatformFormulas/components/Grid/columnDefs' // Type aliases to reduce verbosity
import { InputRef, message, Modal } from 'antd'
import React, { ChangeEvent, useEffect, useMemo, useReducer, useRef, useState } from 'react'

import { MarketPlatformSetup } from '../../components/FormulaInspector/components/AffectedSetupsTab'
import { getLivePriceColumnDefs } from '../../components/LivePrice/columnDefs'
import { initializeNewLivePriceVariable } from '../helpers'

// Type aliases to reduce verbosity
export type Formula = MarketPlatformFormulasResponse['Data'][number]
type FormulaMapping = Formula['AppliesTo'][number]

type State = {
  firstFormulaLoaded: boolean
  hasAppliesToChanged: boolean
  isFormulaBeingValidated: boolean
  isProductLocationModalVisible: boolean
  isVariableConfigurationModalVisible: boolean
  isQuickSearchFocused: boolean
  isFormulaEditorFocused: boolean
  formulaStatus: 'good' | 'draft' | 'error' | 'unchanged' | 'ready'
  formulaErrReason?: string
  isEditingName: boolean
  selectedFormulaId: Formula['FormulaId']
  selectedFormula: Formula
  selectedVariable: VariablesItem
  selectedQuoteRow: MarketPlatformSetup
  isNewVariableModalOpen: boolean
}

const getRandomTempId = () => Math.floor(Math.random() * -1000000)

type FormulaStatus = 'good' | 'draft' | 'error' | 'unchanged' | 'ready'

type Action =
  | { type: 'FIRST_FORMULA_LOADED' }
  | { type: 'FORMULA_SAVE_SUCCESS' }
  | { type: 'SET_IS_PRODUCT_LOCATION_MODAL_VISIBLE'; payload: boolean }
  | { type: 'SET_IS_VARIABLE_CONFIGURATION_MODAL_VISIBLE'; payload: boolean }
  | { type: 'SET_IS_QUICK_SEARCH_FOCUSED'; payload: boolean }
  | { type: 'SET_IS_FORMULA_EDITOR_FOCUSED'; payload: boolean }
  | { type: 'SET_IS_EDITING_NAME'; payload: boolean }
  | { type: 'SET_SELECTED_FORMULA_ID'; payload: Formula['FormulaId'] }
  | { type: 'SET_SELECTED_FORMULA'; payload: Formula }
  | { type: 'SET_FORMULA_STATUS'; payload: { status: FormulaStatus; reason?: string } }
  | { type: 'SET_SELECTED_VARIABLE'; payload: VariablesItem }
  | { type: 'SET_SELECTED_QUOTE_ROW'; payload: MarketPlatformSetup }
  | { type: 'SET_FORMULA_VALUE'; payload: string }
  | { type: 'SET_FORMULA_NAME_INPUT_REF'; payload: InputRef }
  | { type: 'INITIALIZE_FORMULA'; payload: Partial<Formula> }
  | {
      type: 'DISCARD_FORMULA_CHANGES'
      formulas: MarketPlatformFormulasResponse['Data']
      setLivePriceToggle: React.Dispatch<React.SetStateAction<boolean>>
    }
  | { type: 'SWITCH_FORMULA'; payload: Formula; setLivePriceToggle: React.Dispatch<React.SetStateAction<boolean>> }
  | {
      type: 'UPDATE_FORMULA_VARIABLE'
      payload: VariablesItem
      publisherPriceTypes: MarketPlatformFormulaMetadata['PublisherPriceTypes']
    }
  | {
      type: 'UPDATE_LIVE_VARIABLE'
      payload: LivePriceType
      LiveInstruments: MarketPlatformFormulaMetadata['LiveInstruments']
    }
  | { type: 'UPDATE_FORMULA_NAME'; payload: string }
  | { type: 'UPDATE_FORMULA_MARKER'; payload: Formula['MarkerId'] }
  | {
      type: 'UPDATE_VARIABLE_CONFIGURATION'
      payload: any
    } // values from form TODO: needs typing
  | { type: 'UPDATE_PRODUCT_LOCATION_CONFIGURATION'; payload: any } // values from form TODO: needs typing
  | { type: 'ADD_FORMULA_VARIABLE'; payload: any; metadata: MarketPlatformFormulaMetadata } // values from form TODO: needs typing
  | { type: 'ADD_LIVE_VARIABLE'; payload: any; metadata: MarketPlatformFormulaMetadata }
  | { type: 'REMOVE_LIVE_VARIABLE'; payload: any; metadata: MarketPlatformFormulaMetadata }
  | { type: 'ADD_FORMULA_MAPPING'; payload: any } // values from form TODO: needs typing
  | { type: 'DELETE_FORMULA_VARIABLE'; payload: VariablesItem }
  | { type: 'REQUEST_VARIABLE_CONFIGURATION'; payload: VariablesItem }
  | { type: 'REQUEST_PRODUCT_LOCATION_CONFIGURATION'; payload: VariablesItem }
  | {
      type: 'DELETE_FORMULA_MAPPING'
      payload: FormulaMapping['FormulaReferenceDataMappingId']
    } // values from form TODO: needs typing
  | {
      type: 'DELETE_FORMULA'
      payload: Formula['FormulaId']
      formulas: MarketPlatformFormulasResponse['Data']
    }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FIRST_FORMULA_LOADED':
      return { ...state, firstFormulaLoaded: true }
    case 'SET_IS_PRODUCT_LOCATION_MODAL_VISIBLE':
      return { ...state, isProductLocationModalVisible: action.payload }
    case 'SET_IS_VARIABLE_CONFIGURATION_MODAL_VISIBLE':
      return { ...state, isVariableConfigurationModalVisible: action.payload }
    case 'SET_IS_QUICK_SEARCH_FOCUSED':
      return { ...state, isQuickSearchFocused: action.payload }
    case 'SET_IS_FORMULA_EDITOR_FOCUSED':
      return { ...state, isFormulaEditorFocused: action.payload }
    case 'SET_FORMULA_STATUS':
      return { ...state, formulaStatus: action.payload.status, formulaErrReason: action.payload.reason }
    case 'SET_IS_EDITING_NAME':
      return { ...state, isEditingName: action.payload }
    case 'SET_SELECTED_FORMULA_ID':
      return { ...state, selectedFormulaId: action.payload }
    case 'SET_SELECTED_FORMULA':
      return { ...state, selectedFormula: action.payload }
    case 'SET_SELECTED_VARIABLE':
      return { ...state, selectedVariable: action.payload }
    case 'SET_SELECTED_QUOTE_ROW':
      return { ...state, selectedQuoteRow: action.payload }
    case 'REQUEST_VARIABLE_CONFIGURATION':
      return { ...state, isVariableConfigurationModalVisible: true, selectedVariable: action.payload }

    case 'REQUEST_PRODUCT_LOCATION_CONFIGURATION':
      return { ...state, isProductLocationModalVisible: true, selectedVariable: action.payload }
    case 'SET_FORMULA_VALUE':
      return {
        ...state,
        selectedFormula: {
          ...state.selectedFormula,
          Formula: action.payload,
        },
      }

    case 'INITIALIZE_FORMULA':
      return {
        ...state,
        selectedFormula: action.payload as Formula,
        selectedFormulaId: null, // new formulas won't have an id until they are saved
        formulaStatus: 'draft',
        isEditingName: true,
        selectedQuoteRow: null,
      }

    case 'UPDATE_FORMULA_VARIABLE':
      const existingVariable = state.selectedFormula.Variables.find(
        (v) => v.FormulaVariableId === action.payload.FormulaVariableId
      )

      if (!existingVariable) return state

      const pricePublisherId = +action.payload.PricePublisherId || 0
      const priceTypes = action.publisherPriceTypes[pricePublisherId]
      if (priceTypes && priceTypes.length > 0) {
        const priceTypeCvId = Number(action.payload.PriceTypeCvId)
        const matchingType = priceTypes.find((pt) => Number(pt.Value) === priceTypeCvId)

        if (!matchingType) {
          action.payload.PriceTypeCvId = Number(priceTypes[0].Value)
          action.payload.PriceType = priceTypes[0].Text
        }
      } else {
        action.payload.PriceTypeCvId = null
        action.payload.PriceType = null
      }

      return {
        ...state,
        formulaStatus: 'draft',
        selectedFormula: {
          ...state.selectedFormula,
          Variables: state.selectedFormula.Variables.map((v) =>
            v.FormulaVariableId === action.payload.FormulaVariableId ? action.payload : v
          ),
        },
      }
    case 'UPDATE_LIVE_VARIABLE':
      return {
        ...state,
        formulaStatus: 'draft',
        selectedFormula: {
          ...state.selectedFormula,
          LivePrice: {
            ...state.selectedFormula.LivePrice,
            ...action.payload,
            PriceInstrumentId: action.payload.PriceInstrumentId,
            VariableName: action.payload.VariableName,
          },
          // If a variable is renamed, we'll update the formula string to rename existing references
          Formula: state.selectedFormula?.Formula?.replace(
            new RegExp(`\\b${state.selectedFormula?.LivePrice?.VariableName}\\b`, 'g'),
            action.payload.VariableName
          ),
        },
      }
    case 'UPDATE_FORMULA_NAME':
      return {
        ...state,
        formulaStatus: 'draft',
        selectedFormula: {
          ...state.selectedFormula,
          Name: action.payload,
        },
      }
    case 'UPDATE_FORMULA_MARKER':
      return {
        ...state,
        formulaStatus: 'draft',
        selectedFormula: {
          ...state.selectedFormula,
          MarkerId: action.payload,
        },
      }
    case 'UPDATE_PRODUCT_LOCATION_CONFIGURATION':
    case 'UPDATE_VARIABLE_CONFIGURATION':
      return {
        ...state,
        formulaStatus: 'draft',
        selectedFormula: {
          ...state.selectedFormula,
          Variables: state.selectedFormula.Variables.map((v) =>
            v.FormulaVariableId === state.selectedVariable.FormulaVariableId ? { ...v, ...action.payload } : v
          ),
        },
        // Changes to addition configuration / product location mostly share the same logic, so we're shared a switch case here
        ...(action.type === 'UPDATE_PRODUCT_LOCATION_CONFIGURATION' && { isProductLocationModalVisible: false }),
        ...(action.type === 'UPDATE_VARIABLE_CONFIGURATION' && { isVariableConfigurationModalVisible: false }),
      }

    case 'DELETE_FORMULA_VARIABLE':
      return {
        ...state,
        formulaStatus: 'draft',
        selectedFormula: {
          ...state.selectedFormula,
          Variables: state.selectedFormula.Variables.filter(
            (v) => v.FormulaVariableId !== action.payload.FormulaVariableId
          ),
          // If a variable is renamed, we'll update the formula string to rename existing references
          Formula: state.selectedFormula.Formula.replace(
            new RegExp(`\\b${action.payload.VariableName}\\b`, 'g'),
            'DELETED_VARIABLE'
          ),
        },
      }
    case 'ADD_FORMULA_VARIABLE':
      return {
        ...state,
        formulaStatus: 'draft',
        isNewVariableModalOpen: false,
        selectedFormula: {
          ...state.selectedFormula,
          Variables: [
            ...state.selectedFormula.Variables,
            initializeNewVariable({ values: action.payload, metadata: action.metadata }),
          ],
        },
      }

    case 'ADD_LIVE_VARIABLE':
      return {
        ...state,
        formulaStatus: 'draft',
        isNewVariableModalOpen: false,
        selectedFormula: {
          ...state.selectedFormula,
          LivePrice: { ...initializeNewLivePriceVariable({ values: action.payload, metadata: action.metadata }) },
        },
      }
    case 'REMOVE_LIVE_VARIABLE':
      return {
        ...state,
        formulaStatus: 'draft',
        isNewVariableModalOpen: false,
        selectedFormula: {
          ...state.selectedFormula,
          LivePrice: null,
          Formula: state.selectedFormula.Formula.replace(
            new RegExp(`\\b${state.selectedFormula?.LivePrice?.VariableName}\\b`, 'g'),
            'DELETED_VARIABLE'
          ),
        },
      }

    case 'DISCARD_FORMULA_CHANGES':
      // In the case of a duplicated formula, the data in state will not yet have a formula id
      // blueprint id is stapled on to formulas after they are successfully duplicate so that we have a way to
      // switch back to the original formula if the user discards the duplication
      const lastId = state.selectedFormula?.$blueprintId || state.selectedFormula?.FormulaId
      const lastFormula = action.formulas.find((f) => f.FormulaId === lastId)

      // toggle the live price off if it was on
      action.setLivePriceToggle(!!lastFormula?.LivePrice)
      const lastFormulaStatus = lastFormula?.Formula !== '' && lastFormula?.MarkerId ? 'ready' : 'unchanged'

      return {
        ...state,
        hasAppliesToChanged: false,
        formulaStatus: lastFormulaStatus,
        isEditingName: false,
        selectedFormulaId: lastId,
        selectedFormula: lastFormula, // this is the discard part.
      }
    case 'DELETE_FORMULA':
      return {
        ...state,
        selectedFormula: action.formulas[0],
        selectedFormulaId: action.formulas[0]?.FormulaId,
        formulaStatus: 'unchanged',
        isEditingName: false,
      }

    case 'ADD_FORMULA_MAPPING':
      return {
        ...state,
        hasAppliesToChanged: true,
        formulaStatus: 'draft',
        selectedFormula: {
          ...state.selectedFormula,
          AppliesTo: [
            ...(state.selectedFormula?.AppliesTo || []),
            { ...action.payload, FormulaReferenceDataMappingId: getRandomTempId() },
          ],
        },
      }
    case 'FORMULA_SAVE_SUCCESS':
      return {
        ...state,
        formulaStatus: 'ready',
        hasAppliesToChanged: false,
      }
    case 'DELETE_FORMULA_MAPPING':
      return {
        ...state,
        hasAppliesToChanged: true,
        formulaStatus: 'draft',
        selectedFormula: {
          ...state.selectedFormula,
          AppliesTo: state.selectedFormula.AppliesTo.filter(
            (mapping) => mapping.FormulaReferenceDataMappingId !== action.payload
          ),
        },
      }

    case 'SWITCH_FORMULA':
      action.setLivePriceToggle(!!action.payload?.LivePrice)
      const lastFormulaSwitchStatus = action.payload?.Formula !== '' && action?.payload.MarkerId ? 'ready' : 'unchanged'

      return {
        ...state,
        selectedFormula: action.payload,
        selectedFormulaId: action.payload?.FormulaId,
        formulaStatus: lastFormulaSwitchStatus,
        isEditingName: false,
        selectedQuoteRow: null,
      }

    default:
      return state
  }
}

const initialState: State = {
  firstFormulaLoaded: false,
  hasAppliesToChanged: false,
  isFormulaBeingValidated: false,
  isProductLocationModalVisible: false,
  isVariableConfigurationModalVisible: false,
  isQuickSearchFocused: false,
  isFormulaEditorFocused: false,
  formulaStatus: 'unchanged',
  isEditingName: false,
  selectedFormulaId: null,
  selectedFormula: null,
  selectedVariable: null,
  selectedQuoteRow: null,
  isNewVariableModalOpen: false,
}
function groupByGroupingValue(instruments) {
  return instruments.reduce((acc, instrument) => {
    const key = parseInt(instrument.GroupingValue)
    if (!acc[key]) acc[key] = []
    acc[key].push(instrument)
    return acc
  }, {})
}

function mergeVariableValues(formulaValues, vars) {
  const variables = formulaValues?.Data.Variables || []

  return (vars ?? []).map((v) => {
    const matchedVar = variables.find((fv) => fv.VariableName === v.VariableName)
    return {
      ...v,
      Value: matchedVar?.IsMissingPrices ? 'Missing' : matchedVar?.Value ?? null,
    }
  })
}
function markNotRequiredMissingValues(items) {
  items.forEach((item) => {
    if ((item.Value === 'Missing' || item.Value === null) && !item.IsRequired) {
      item.Value = 'Not Required'
    }
  })
}

export const useMarketPlatformFormula = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const formulaNameInputRef = useRef<InputRef>(null)
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.FormulaManagement?.Write
  const [livePriceToggle, setLivePriceToggle] = useState<boolean>(false)
  const validForValuationStatuses = ['good', 'unchanged', 'ready']

  const {
    useMarketPlatformFormulasMetadataQuery,
    useMarketPlatformFormulasQuery,
    useMarketPlatformFormulaUpsertMutation,
    useMarketPlatformFormulaValidateMutation,
    useMarketPlatformFormulaDeleteMutation,
    useMarketPlatformFormulaDuplicateMutation,
    useValueOspFormulaQuery,
    initializeNewMarketPlatformFormula,
    useMarketPlatformFormulaAffectedSetupsQuery,
  } = useMarketPlatformFormulas()

  const { data: formulas, isLoading: isFormulasLoading } = useMarketPlatformFormulasQuery()
  const { data: metadata, isLoading: isMetadataLoading } = useMarketPlatformFormulasMetadataQuery()

  const {
    data: affectedSetups,
    isLoading: isAffectedSetupRowsLoading,
    refetch: refetchAffectedSetups,
  } = useMarketPlatformFormulaAffectedSetupsQuery(state?.selectedFormulaId)

  if (metadata != null && metadata.PublisherPriceInstruments === undefined) {
    metadata.PublisherPriceInstruments = groupByGroupingValue(metadata.Instruments)
  }

  const duplicateFormula = useMarketPlatformFormulaDuplicateMutation()
  const upsertFormula = useMarketPlatformFormulaUpsertMutation()

  const { data: formulaValues, isFetching: isSetupValueLoading } = useValueOspFormulaQuery({
    FormulaId: state.selectedFormulaId,
    TradeEntrySetupId: state.selectedQuoteRow?.TradeEntrySetupId,
  })

  const selectedFormulaVariablesWithValues = mergeVariableValues(formulaValues, state.selectedFormula?.Variables)

  markNotRequiredMissingValues(selectedFormulaVariablesWithValues)

  const selectedFormulaValue = formulaValues
    ? {
        IsMissingPrices: formulaValues.Data.IsMissingPrices,
        Value: formulaValues.Data.Value,
        PriceStatus: formulaValues.Data.PriceStatus,
        Variables: formulaValues.Data.Variables,
      }
    : null

  const deleteFormulaMutation = useMarketPlatformFormulaDeleteMutation({
    onSuccess: () => dispatch({ type: 'DELETE_FORMULA', payload: state.selectedFormulaId, formulas: formulas.Data }),
  })

  const validateFormula = useMarketPlatformFormulaValidateMutation()

  // Default the formula selection to the first in the list (once the list is loaded)
  useEffect(() => {
    // TODO: Make last selection sticky?
    const firstFormula = formulas?.Data?.length && formulas.Data[0]
    if (firstFormula && !state.firstFormulaLoaded) {
      dispatch({ type: 'SWITCH_FORMULA', payload: firstFormula, setLivePriceToggle })
      dispatch({ type: 'FIRST_FORMULA_LOADED' })
      setLivePriceToggle(!!firstFormula.LivePrice)
    }

    if (!formulas?.Data?.length && !isFormulasLoading) {
      const formulaId = getRandomTempId()
      const f: Partial<FormulaData> = {
        $isNew: true,
        FormulaId: formulaId,
        Name: 'New Formula',
        Variables: [],
        Formula: '',
      }

      dispatch({ type: 'INITIALIZE_FORMULA', payload: f })
      initializeNewMarketPlatformFormula(f)
      dispatch({ type: 'SET_SELECTED_FORMULA_ID', payload: formulaId })
    }
  }, [formulas])

  const handleFormulaClick = (newFormulaId: Formula['FormulaId']) => {
    const selectedFormula = formulas.Data.find((f) => f.FormulaId.toString() === newFormulaId.toString())
    const switchFormula = () => dispatch({ type: 'SWITCH_FORMULA', payload: selectedFormula, setLivePriceToggle })

    if (selectedFormula) {
      if (!['draft', 'error'].includes(state.formulaStatus)) {
        switchFormula()
        return
      }

      Modal.confirm({
        title: 'Are you sure you want to switch formulas?',
        content: 'You have unsaved changes that will be lost if you switch.',
        onOk: switchFormula,
      })
    }
  }

  const handleVariableChange = (change: VariablesItem) => {
    dispatch({ type: 'UPDATE_FORMULA_VARIABLE', payload: change, publisherPriceTypes: metadata.PublisherPriceTypes })
  }

  const handleLiveVariableChange = (change: LivePriceType) => {
    dispatch({ type: 'UPDATE_LIVE_VARIABLE', payload: change, LiveInstriments: metadata?.LiveInstruments })
  }

  const handleDeleteVariable = (id: VariablesItem['FormulaVariableId']) => {
    const variableToDelete = state.selectedFormula.Variables.find((v) => v.FormulaVariableId === id)
    dispatch({ type: 'DELETE_FORMULA_VARIABLE', payload: variableToDelete })
  }

  const handleNewFormula = () => {
    const init = () => {
      const f: Partial<FormulaData> = {
        $isNew: true,
        FormulaId: getRandomTempId(),
        Name: 'New Formula',
        Variables: [],
        Formula: '',
      }
      setLivePriceToggle(false)
      dispatch({ type: 'INITIALIZE_FORMULA', payload: f })
      initializeNewMarketPlatformFormula(f)
    }

    if (!['draft', 'error'].includes(state.formulaStatus)) {
      init()
      return
    }

    Modal.confirm({
      title: 'Are you sure you want to switch formulas?',
      content: 'You have unsaved changes that will be lost if you switch.',
      onOk: () => {
        init()
      },
    })
  }

  const handleFormulaSave = async () => {
    if (!state.selectedFormula.MarkerId) {
      message.error('Please select a marker')
      return
    }

    if (state.selectedFormula.$isNew) {
      try {
        // throw away metadata and fake id for new formulas
        const { $isNew, FormulaId, ...formula } = state.selectedFormula
        const resp = (await upsertFormula.mutateAsync({ ...formula, AppliesTo: [] })) as Formula
        if (resp.FormulaId) {
          // really don't like manually inserting this, but since we're hijacking the onSuccess callback of the mutation
          // the overview never gets invalidated. This lets us 'select' the new formula's that have been saved for the
          // first time after a clone.
          if (formulas) formulas.Data.unshift(resp)
          dispatch({ type: 'SET_SELECTED_FORMULA_ID', payload: resp.FormulaId })

          dispatch({ type: 'FORMULA_SAVE_SUCCESS' })

          message.success('Formula Saved')
        }
      } catch (error) {
        if (!state.selectedFormula.Formula) {
          message.error('Invalid Formula')
        }
      }
    } else {
      await upsertFormula.mutateAsync(state.selectedFormula)
      dispatch({ type: 'FORMULA_SAVE_SUCCESS' })
      message.success('Formula Saved')

      await refetchAffectedSetups()
    }
  }

  const handleFormulaDelete = () => deleteFormulaMutation.mutate(state.selectedFormulaId)

  const handleFormulaValueChange = (value: string) => {
    if (state.selectedFormula.Formula === value) return
    dispatch({ type: 'SET_FORMULA_VALUE', payload: value })
  }

  const handleFormulaMarkerChange = (value: string) => {
    const parsed = parseInt(value)
    if (state.selectedFormula?.MarkerId == parsed) return
    dispatch({ type: 'UPDATE_FORMULA_MARKER', payload: parsed })
  }

  const handleFormulaNameChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (state.selectedFormula.Name === value) return
    dispatch({ type: 'UPDATE_FORMULA_NAME', payload: value })
  }

  const handleVariableConfigurationChange = (values) => {
    dispatch({ type: 'UPDATE_VARIABLE_CONFIGURATION', payload: values })
  }

  const handleVariableProductLocationChange = ({ SelectionType, ...values }) => {
    dispatch({ type: 'UPDATE_PRODUCT_LOCATION_CONFIGURATION', payload: values })
  }

  const handleNewVariable = (values) => dispatch({ type: 'ADD_FORMULA_VARIABLE', payload: values, metadata })

  const closeVariableConfigurationModal = () =>
    dispatch({ type: 'SET_IS_VARIABLE_CONFIGURATION_MODAL_VISIBLE', payload: false })

  const closeVariableProductLocationModal = () =>
    dispatch({ type: 'SET_IS_PRODUCT_LOCATION_MODAL_VISIBLE', payload: false })

  const setQuickSearchFocus = (isFocused: boolean) =>
    dispatch({ type: 'SET_IS_QUICK_SEARCH_FOCUSED', payload: isFocused })

  const handleDiscardChanges = () =>
    dispatch({ type: 'DISCARD_FORMULA_CHANGES', formulas: formulas.Data, setLivePriceToggle })

  const handleNewFormulaMapping = (values) => dispatch({ type: 'ADD_FORMULA_MAPPING', payload: values })

  const handleFormulaMappingDelete = (id: FormulaMapping['FormulaReferenceDataMappingId']) =>
    dispatch({ type: 'DELETE_FORMULA_MAPPING', payload: id })

  const handleSelectMarketPlatformSetupRow = (newQuoteRow: MarketPlatformSetup) =>
    dispatch({ type: 'SET_SELECTED_QUOTE_ROW', payload: newQuoteRow })

  const handleFormulaDuplicate = async (id: Formula['FormulaId']) => {
    const formula = await duplicateFormula.mutateAsync(id)
    if (!formula) {
      message.error('Failed to duplicate formula')
    } else {
      dispatch({
        type: 'INITIALIZE_FORMULA',
        payload: {
          ...formula.Data,
          FormulaId: getRandomTempId(),
          $isNew: true,
          $blueprintId: id,
          Variables: formula.Data?.Variables?.map((v) => ({
            ...v,
            $isNew: true,
            FormulaVariableId: getRandomTempId(),
          })),
        },
      })
    }
  }

  useEffect(() => {
    const hasIncompleteVariables = state?.selectedFormula?.Variables?.some(
      (v) => !v.VariableName || v.VariableName === '' || (!v.ValueEffectiveDateRuleCvId && !v.IsPlaceholder)
    )

    const hasIncompleteLiveVariable = !state?.selectedFormula?.LivePrice?.PriceInstrumentId && livePriceToggle
    if (hasIncompleteVariables || hasIncompleteLiveVariable) {
      return dispatch({
        type: 'SET_FORMULA_STATUS',
        payload: {
          status: 'error',
          reason:
            hasIncompleteVariables || hasIncompleteLiveVariable ? 'One or more variables require more information' : '',
        },
      })
    }

    const validate = async () => {
      if (!state.selectedFormula?.Formula) return

      try {
        const variables = state?.selectedFormula?.LivePrice?.VariableName
          ? state.selectedFormula.Variables.map((v) => v.VariableName).concat(
              state.selectedFormula?.LivePrice?.VariableName
            )
          : state.selectedFormula.Variables.map((v) => v.VariableName)

        const resp = await validateFormula.mutateAsync({
          Formula: state.selectedFormula?.Formula,
          Variables: variables,
        })
        if (!resp.Validated) {
          dispatch({
            type: 'SET_FORMULA_STATUS',
            payload: {
              status: 'error',
            },
          })
        } else if (
          state.selectedFormula.Formula !== formulas.Data.find((f) => f.FormulaId === state.selectedFormulaId)?.Formula
        ) {
          dispatch({ type: 'SET_FORMULA_STATUS', payload: { status: 'draft' } })
        }
      } catch (error) {
        dispatch({
          type: 'SET_FORMULA_STATUS',
          payload: {
            status: 'error',
          },
        })
      }
    }

    validate()
  }, [state.selectedFormula?.Formula, state.selectedFormula?.Variables, state.selectedFormula?.LivePrice])

  useEffect(() => {
    if (state.selectedFormulaId) {
      const formula = formulas?.Data.find((f) => f.FormulaId === state.selectedFormulaId)
      dispatch({ type: 'SWITCH_FORMULA', payload: formula, setLivePriceToggle })
    }
  }, [state.selectedFormulaId])

  const marketPlatformVariableGridColumnDefs = useMemo(
    () =>
      getMarketPlatformFormulasVariableColumnDefs({
        metadata,
        handleDeleteVariable,
        configureProductLocation: (id) => {
          const selectedVariable = state.selectedFormula.Variables.find((v) => v.FormulaVariableId === id)
          if (!selectedVariable) return
          dispatch({ type: 'REQUEST_PRODUCT_LOCATION_CONFIGURATION', payload: selectedVariable })
        },
        configureAdditionalOptions: (id) => {
          const selectedVariable = state.selectedFormula.Variables.find((v) => v.FormulaVariableId === id)
          if (!selectedVariable) return
          dispatch({ type: 'REQUEST_VARIABLE_CONFIGURATION', payload: selectedVariable })
        },
        needsValueColumn: state.selectedQuoteRow !== null && validForValuationStatuses.includes(state.formulaStatus),
        selectedFormulaValue,
        canWrite,
      }),
    [
      metadata,
      state.selectedFormula?.Variables,
      state.selectedQuoteRow,
      selectedFormulaValue,
      validForValuationStatuses,
      canWrite,
    ]
  )

  const livePriceColumnDefs = useMemo(
    () =>
      getLivePriceColumnDefs({
        metadata,
        needsValueColumn: state.selectedQuoteRow !== null && validForValuationStatuses.includes(state.formulaStatus),
        selectedFormulaValue,
      }),
    [metadata, selectedFormulaValue, state.selectedQuoteRow]
  )

  const selectedMarker = useMemo(
    () => metadata?.Markers?.find((m) => m.Value === state.selectedFormula?.MarkerId?.toString()),
    [metadata?.Markers, state.selectedFormula]
  )

  const variableSuggestions = useMemo(
    () =>
      state.selectedFormula?.Variables?.map((v) => ({
        label: v.VariableName,
        insertText: v.VariableName,
      })).concat([
        {
          label: state.selectedFormula?.LivePrice?.VariableName,
          insertText: state.selectedFormula?.LivePrice?.VariableName,
        },
      ]),
    [state.selectedFormula?.Variables, state.selectedFormula?.LivePrice]
  )

  return {
    ...state,
    selectedFormulaVariablesWithValues,
    selectedFormulaValue,
    formulaNameInputRef,
    dispatch,
    formulas,
    metadata,
    isMetadataLoading,
    selectedMarker,
    variableSuggestions,
    marketPlatformVariableGridColumnDefs,
    livePriceColumnDefs,
    handleFormulaClick,
    handleVariableChange,
    handleLiveVariableChange,
    handleVariableConfigurationChange,
    handleVariableProductLocationChange,
    handleNewVariable,
    handleNewFormula,
    handleFormulaSave,
    handleFormulaDuplicate,
    handleFormulaValueChange,
    handleFormulaNameChange,
    handleFormulaMarkerChange,
    handleNewFormulaMapping,
    handleFormulaMappingDelete,
    handleDeleteVariable,
    handleSelectMarketPlatformSetupRow,
    handleDiscardChanges,
    closeVariableConfigurationModal,
    closeVariableProductLocationModal,
    setQuickSearchFocus,
    upsertFormula,
    handleFormulaDelete,
    isSetupValueLoading,
    isDraft: !validForValuationStatuses.includes(state.formulaStatus),
    canWrite,
    livePriceToggle,
    setLivePriceToggle,
    affectedSetups,
    isAffectedSetupRowsLoading,
  }
}
