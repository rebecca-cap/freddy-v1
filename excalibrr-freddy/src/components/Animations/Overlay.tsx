import { Spin, SpinProps } from 'antd'
import { Fragment } from 'react'

type Props = SpinProps & {
  children: React.ReactNode
  renderOverlay: boolean
  overlayContent: SpinProps['tip']
  overlayIndicator: SpinProps['indicator']
}

export const Overlay: React.FC<Props> = ({
  children,
  renderOverlay,
  overlayContent,
  overlayIndicator,
}) => {
  if (renderOverlay) {
    return (
      <Spin tip={overlayContent} indicator={overlayIndicator}>
        {children}
      </Spin>
    )
  } else {
    return <Fragment>{children}</Fragment>
  }
}
