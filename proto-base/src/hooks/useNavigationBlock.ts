import { Modal } from 'antd'
import { useCallback, useEffect, useRef } from 'react'
import { useBlocker } from 'react-router-dom'

interface IHookProps {
  blockCondition: boolean
  modalTitle?: string
  modalContent?: string
  beforeProceed?: (blocker: ReturnType<typeof useBlocker>) => Promise<void>
}

export const useNavigationBlock = ({
  blockCondition,
  modalTitle = 'Are you sure you want to leave this page?',
  modalContent = 'You have unsaved changes that will be lost.',
  beforeProceed,
}: IHookProps) => {
  // Keep the latest blockCondition in a ref so the blocker function (a stable
  // reference) always reads the most recent value. Without this, useBlocker's
  // re-registration effect can lag behind sibling/child effects that trigger
  // navigation, causing a stale "true" to fire the modal after the user has
  // already discarded their changes.
  const blockConditionRef = useRef(blockCondition)
  blockConditionRef.current = blockCondition

  const shouldBlock = useCallback(() => blockConditionRef.current, [])

  const blocker = useBlocker(shouldBlock)

  // This will block hard reloads in the browser if changes are unsaved
  useEffect(() => {
    window.onbeforeunload = blockCondition ? () => true : null
    return () => {
      window.onbeforeunload = null
    }
  }, [blockCondition])

  useEffect(() => {
    if (blocker.state === 'blocked') {
      Modal.confirm({
        title: modalTitle,
        content: modalContent,
        okText: 'Leave',
        okType: 'danger',
        cancelText: 'Stay',
        onOk: async () => {
          if (beforeProceed && typeof beforeProceed === 'function') {
            await beforeProceed(blocker)
          }
          blocker.proceed()
        },
        onCancel: () => {
          blocker.reset()
        },
      })
    }
  }, [blocker])

  return blocker
}
