import { Breadcrumb } from 'antd'
import React from 'react'

interface CrumbsProps {
  crumbs?: string[]
}
export const Crumbs: React.FC<CrumbsProps> = ({ crumbs = [] }) => {
  if (crumbs.length == 0) return <></>
  const items = crumbs.map((title) => <Breadcrumb.Item>{title}</Breadcrumb.Item>)

  return <Breadcrumb>{items}</Breadcrumb>
}
