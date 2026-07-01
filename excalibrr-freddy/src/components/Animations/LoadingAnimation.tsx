import { Col, Row } from 'antd'
import Lottie, { Options } from 'react-lottie'
import { Texto } from '../DataDisplay/Texto/Texto'

type Props = {
  loop?: boolean
  animationData: Options['animationData']
  large?: boolean
  title: string
  message: string
  width?: number
  height?: number
}

export const LoadingAnimation: React.FC<Props> = ({
  loop = true,
  animationData,
  large,
  title,
  message,
  width = 355,
  height = 245,
}) => {
  return (
    <div className='loading-container p-5'>
      <Row>
        <Col>
          <Lottie
            options={{
              loop,
              animationData,
              autoplay: true,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
              },
            }}
            height={height}
            width={width}
            isStopped={false}
            isPaused={false}
          />
        </Col>
      </Row>
      <Texto category={large ? 'h1' : 'h5'} weight='bold'>
        {title}
      </Texto>
      <Texto className='pt-3' category={large ? 'h5' : 'p1'}>
        {message}
      </Texto>
    </div>
  )
}
