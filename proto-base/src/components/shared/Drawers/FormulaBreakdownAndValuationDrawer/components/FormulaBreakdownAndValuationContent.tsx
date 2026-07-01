import {
  CheckCircleFilled,
  CopyOutlined,
  EnvironmentFilled,
  ExperimentFilled,
  LoadingOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import {
  type FormulaBreakdownAndValuationDetail,
  useFormulaBreakdownAndValuation,
} from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer/api/useFormulaBreakdownAndValuationTyped'
import { BBDTag, GraviButton, GraviGrid, Horizontal, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { copyToClipboard } from '@utils/clipboard'
import { formatDateWithTimezone } from '@utils/timezone'
import type { GridApi } from 'ag-grid-enterprise'
import { Alert, Tooltip, message } from 'antd'
import React, { type MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'

import { getNumSign } from '@/utils'

import { columnDefs } from './columnDefs'
import { buildVariableColorMap, FormulaDisplay, FormulaHoverProvider, useFormulaHover } from './FormulaDisplay'
import { substituteDisplayNames, substituteValues } from './formulaSubstitution'
import styles from './styles.module.css'

const REVALUE_COOLDOWN_MS = 15_000
const REVALUED_NOW_DISPLAY_MS = 5_000
const PRICE_FLASH_MS = 1_000

interface FormulaBreakdownAndValuationContentProps {
  // Self-fetching mode (used by FormulaBreakdownAndValuationDrawer)
  curvePointPriceId?: number | null
  allowRevaluation?: boolean
  onRevalueSuccess?: (newCurvePointPriceId: number) => void
  // External data mode (used by MarketMoveDrawer which fetches its own data)
  isFetchingData?: boolean
  data?: FormulaBreakdownAndValuationDetail
}

export function FormulaBreakdownAndValuationContent(props: FormulaBreakdownAndValuationContentProps) {
  return (
    <FormulaHoverProvider>
      <FormulaBreakdownAndValuationContentInner {...props} />
    </FormulaHoverProvider>
  )
}

function FormulaBreakdownAndValuationContentInner({
  curvePointPriceId,
  allowRevaluation,
  onRevalueSuccess,
  isFetchingData: externalIsFetching,
  data: externalData,
}: FormulaBreakdownAndValuationContentProps) {
  // curvePointPriceId !== undefined means self-fetching mode
  const selfFetchMode = curvePointPriceId !== undefined
  const { query, revalueMutation } = useFormulaBreakdownAndValuation(selfFetchMode ? curvePointPriceId : null)
  const { data: queryData, isFetching } = query
  const { reset: resetRevaluation } = revalueMutation

  const [revalueErrorMessage, setRevalueErrorMessage] = useState<string | null>(null)
  const [showRevaluedNow, setShowRevaluedNow] = useState(false)
  const [showPriceFlash, setShowPriceFlash] = useState(false)

  // Tracks the CurvePointPriceId produced by our own revaluation so the reset
  // effect can distinguish "parent swapped to the new revalued ID" from
  // "user selected a genuinely different row".
  const revaluedIdRef = useRef<number | null>(null)

  // Display data comes from the query. After revaluation, the parent updates selectedValuationId
  // to the new CurvePointPriceId (via onRevalueSuccess), which triggers a fresh query automatically.
  const mergedData = queryData

  // Reset all visual state when curvePointPriceId changes (new drawer subject),
  // but skip the reset when the change was caused by our own revaluation.
  useEffect(() => {
    if (revaluedIdRef.current != null && curvePointPriceId === revaluedIdRef.current) {
      revaluedIdRef.current = null
      return
    }
    revaluedIdRef.current = null
    setRevalueErrorMessage(null)
    setShowRevaluedNow(false)
    setShowPriceFlash(false)
    resetRevaluation()
  }, [curvePointPriceId, resetRevaluation])

  // 15-second cooldown: re-enable the button after revaluation succeeds
  useEffect(() => {
    if (!revalueMutation.isSuccess) return
    const timer = setTimeout(() => {
      resetRevaluation()
    }, REVALUE_COOLDOWN_MS)
    return () => clearTimeout(timer)
  }, [revalueMutation.isSuccess, resetRevaluation])

  // Show "Revalued just now" on AS OF DATE for 5 seconds after success
  useEffect(() => {
    if (!revalueMutation.isSuccess) return
    setShowRevaluedNow(true)
    const timer = setTimeout(() => setShowRevaluedNow(false), REVALUED_NOW_DISPLAY_MS)
    return () => clearTimeout(timer)
  }, [revalueMutation.isSuccess])

  // Brief green highlight on PRICE after success
  useEffect(() => {
    if (!revalueMutation.isSuccess) return
    setShowPriceFlash(true)
    const timer = setTimeout(() => setShowPriceFlash(false), PRICE_FLASH_MS)
    return () => clearTimeout(timer)
  }, [revalueMutation.isSuccess])

  const handleRevalue = () => {
    if (!curvePointPriceId) return
    revalueMutation.mutate(curvePointPriceId, {
      onSuccess: (responseData) => {
        // Check for validation errors (e.g. lock contention)
        if (responseData?.Validations?.length) {
          const errorMessage = responseData.Validations[0]?.Message || 'Revaluation failed. Please try again.'
          setRevalueErrorMessage(errorMessage)
          return
        }
        // Notify parent with the new CurvePointPriceId produced by the revaluation.
        // Store it in the ref so the reset effect knows to skip when the parent
        // updates curvePointPriceId to this value.
        const newCurvePointPriceId = responseData?.Data?.CurvePointPriceId
        if (newCurvePointPriceId != null) {
          revaluedIdRef.current = newCurvePointPriceId
          onRevalueSuccess?.(newCurvePointPriceId)
        }
      },
    })
  }

  const { hoveredComponentId, setHoveredComponentId } = useFormulaHover()

  // rowClassRules closes over hoveredIdRef.current so it stays a stable ref;
  // redrawRows() forces re-evaluation when the hovered ID changes.
  const hoveredIdRef = useRef<number | null>(null)
  const gridApiRef = useRef<GridApi>() as MutableRefObject<GridApi>
  useEffect(() => {
    hoveredIdRef.current = hoveredComponentId
    gridApiRef.current?.redrawRows()
  }, [hoveredComponentId])

  // Resolve effective loading state and data based on mode
  const effectiveIsFetching = selfFetchMode ? isFetching : externalIsFetching ?? false
  const data = selfFetchMode ? mergedData?.Data : externalData

  const variableColorMap = useMemo(() => buildVariableColorMap(data?.ResultComponents ?? []), [data?.ResultComponents])

  const getColumnDefs = useMemo(
    () => columnDefs(revalueMutation.isPending, variableColorMap),
    [revalueMutation.isPending, variableColorMap]
  )
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.FormulaResultComponentId.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
      onCellMouseOver: (event: { data?: { FormulaResultComponentId?: number } }) => {
        const id = event.data?.FormulaResultComponentId
        if (id != null) setHoveredComponentId(id)
      },
      onCellMouseOut: () => setHoveredComponentId(null),
      rowClassRules: {
        [styles.fbavHoveredRow]: (params: { data?: { FormulaResultComponentId?: number } }) =>
          params.data?.FormulaResultComponentId != null &&
          params.data.FormulaResultComponentId === hoveredIdRef.current,
      },
    }),
    [setHoveredComponentId]
  )

  const formulaWithDisplayNames = useMemo(
    () => substituteDisplayNames(data?.Formula, data?.ResultComponents ?? []),
    [data?.Formula, data?.ResultComponents]
  )
  const calculatedFormula = useMemo(
    () => substituteValues(data?.Formula, data?.ResultComponents ?? []),
    [data?.Formula, data?.ResultComponents]
  )

  const handleCopy = async (text: string, successMessage: string) => {
    if (!text) return
    const ok = await copyToClipboard(text)
    if (ok) message.success(successMessage)
    else message.error('Failed to copy')
  }

  if (effectiveIsFetching) {
    return (
      <Horizontal fullHeight horizontalCenter verticalCenter>
        <Texto category='h1'>
          <LoadingOutlined />
        </Texto>
      </Horizontal>
    )
  }

  if (!data) {
    return (
      <Horizontal fullHeight horizontalCenter verticalCenter>
        <Texto className='bg-3 p-4' category='h5' style={{ borderRadius: 10 }}>
          <NothingMessage title='' message='No valuation details found' />
        </Texto>
      </Horizontal>
    )
  }

  // Subtle fade during revaluation to indicate PRICE and AS OF DATE are stale
  const mutationLoadingStyle = revalueMutation.isPending
    ? { opacity: 0.4, transition: 'opacity 0.2s' }
    : { transition: 'opacity 0.2s' }

  return (
    <Vertical>
      <Horizontal className='p-4 bg-2 bordered'>
        <Vertical flex={5} gap={10}>
          <Horizontal verticalCenter>
            <Tooltip title='Product'>
              <BBDTag className='py-1' style={{ whiteSpace: 'normal' }} success>
                <Horizontal verticalCenter>
                  <ExperimentFilled
                    style={{
                      marginRight: 5,
                      fontSize: 12,
                      color: 'var(--theme-color-2)',
                    }}
                  />
                  <Texto category='h5'>{data?.ForProductName}</Texto>
                </Horizontal>
              </BBDTag>
            </Tooltip>
            <Texto category='h5' className='mr-2'>
              @
            </Texto>
            <Tooltip title='Location'>
              <BBDTag className='py-1' success>
                <Horizontal verticalCenter>
                  <EnvironmentFilled
                    style={{
                      marginRight: 5,
                      fontSize: 12,
                      color: 'var(--theme-color-2)',
                    }}
                  />
                  <Texto category='h5'>{data?.ForLocationName}</Texto>
                </Horizontal>
              </BBDTag>
            </Tooltip>
          </Horizontal>
          <Horizontal verticalCenter>
            <Texto className='mr-3 mt-1'>COUNTERPARTY: </Texto>
            <Texto category='h5'>{data?.ForCounterPartyName}</Texto>
          </Horizontal>
        </Vertical>
        <Vertical flex={2} gap={10}>
          <Horizontal verticalCenter justifyContent='flex-end'>
            <Texto category='p2' className='px-3'>
              PRICE:
            </Texto>
            <Texto
              category='h4'
              style={{
                ...mutationLoadingStyle,
                color: showPriceFlash ? 'var(--theme-success)' : undefined,
                transition: 'color 0.8s, opacity 0.2s',
              }}
            >
              {data && `${getNumSign(data?.Result)}${fmt.currency(data?.Result)}`}
            </Texto>
          </Horizontal>
          <Horizontal verticalCenter justifyContent='flex-end'>
            <Texto category='p2' className='px-3'>
              AS OF DATE:
            </Texto>
            <Texto
              category='h5'
              style={{
                ...mutationLoadingStyle,
                color: showRevaluedNow ? 'var(--theme-success)' : undefined,
                transition: 'color 0.8s, opacity 0.2s',
              }}
            >
              {showRevaluedNow ? 'Revalued just now' : formatDateWithTimezone(data?.CalculationDate)}
            </Texto>
          </Horizontal>
          {allowRevaluation && (
            <Horizontal verticalCenter justifyContent='flex-end'>
              <Tooltip title={revalueMutation.isSuccess ? 'Recently revalued' : undefined}>
                <GraviButton
                  buttonText={
                    revalueMutation.isPending ? 'Revaluing...' : revalueMutation.isSuccess ? 'Revalued' : 'Revalue Now'
                  }
                  icon={
                    revalueMutation.isPending ? (
                      <LoadingOutlined spin />
                    ) : revalueMutation.isSuccess ? (
                      <CheckCircleFilled />
                    ) : (
                      <SyncOutlined />
                    )
                  }
                  size='small'
                  theme1={!revalueMutation.isSuccess}
                  success={revalueMutation.isSuccess}
                  disabled={revalueMutation.isPending || revalueMutation.isSuccess}
                  onClick={handleRevalue}
                />
              </Tooltip>
            </Horizontal>
          )}
        </Vertical>
      </Horizontal>
      {revalueErrorMessage && (
        <Alert
          type='error'
          showIcon
          closable
          message={revalueErrorMessage}
          onClose={() => setRevalueErrorMessage(null)}
          className='mx-4 mt-2'
        />
      )}
      <Horizontal className='px-4 py-2' verticalCenter>
        <Texto className='mr-4'>Formula Name:</Texto>
        <Texto category='h5'>{data?.CalculationName}</Texto>
      </Horizontal>
      <div className={styles.fbavFormulaBlock}>
        <div className={styles.fbavFormulaBlockHeader}>
          <span className={styles.fbavFormulaBlockLabel}>Formula Template:</span>
          <Tooltip title='Copy to clipboard' mouseEnterDelay={0.3}>
            <GraviButton
              appearance='outline'
              className={styles.fbavCopyButton}
              icon={<CopyOutlined className={styles.copyIcon} />}
              onClick={() => handleCopy(formulaWithDisplayNames, 'Copied to clipboard')}
            />
          </Tooltip>
        </div>
        <div className={styles.fbavMonacoWrapper}>
          <FormulaDisplay formula={data?.Formula} components={data?.ResultComponents ?? []} mode='template' />
        </div>
      </div>
      <div className={styles.fbavFormulaBlock}>
        <div className={styles.fbavFormulaBlockHeader}>
          <span className={styles.fbavFormulaBlockLabel}>Calculated Formula:</span>
          <Tooltip title='Copy to clipboard' mouseEnterDelay={0.3}>
            <GraviButton
              appearance='outline'
              className={styles.fbavCopyButton}
              icon={<CopyOutlined className={styles.copyIcon} />}
              disabled={!calculatedFormula}
              onClick={() => handleCopy(calculatedFormula, 'Copied to clipboard')}
            />
          </Tooltip>
        </div>
        <div className={styles.fbavMonacoWrapper}>
          <FormulaDisplay formula={data?.Formula} components={data?.ResultComponents ?? []} mode='calculated' />
        </div>
      </div>
      <Horizontal flex={7} fullHeight style={{ width: '100%' }}>
        <Vertical>
          <GraviGrid
            externalRef={gridApiRef}
            enableFilterContextMenu
            controlBarProps={{
              title: 'Variables',
            }}
            agPropOverrides={agPropOverrides}
            rowData={data?.ResultComponents}
            columnDefs={getColumnDefs}
          />
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
