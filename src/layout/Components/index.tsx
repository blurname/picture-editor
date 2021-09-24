import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React from 'react'
import { Img } from './Img'
import { Mark } from './Mark'
import {Mosaic} from './Mosaic'
export function Components() {
  return (
    <Collapse className="w-2/12 bg-blue-100 pb-5" defaultActiveKey={[2,3]}>
      <CollapsePanel header="image" key="1">
        <Img />
      </CollapsePanel>
      <CollapsePanel header="mark" key="2">
        <Mark />
      </CollapsePanel>
      <CollapsePanel header="mosaic" key="3">
        <Mosaic />
      </CollapsePanel>
    </Collapse>
  )
}
