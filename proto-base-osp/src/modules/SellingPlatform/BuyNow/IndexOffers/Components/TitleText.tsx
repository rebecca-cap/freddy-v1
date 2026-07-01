import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Divider } from 'antd'

export function TitleText({ title }: { title: string }) {
  return (
    <Vertical>
      <Texto weight={'bold'} textTransform={'uppercase'} category={'h4'}>
        {title}
      </Texto>
      <Divider className={'my-2'} />{' '}
    </Vertical>
  )
}

export function SubtitleText({ title }: { title: string }) {
  return (
    <Texto category={'p2'} textTransform={'capitalize'}>
      {title}
    </Texto>
  )
}
