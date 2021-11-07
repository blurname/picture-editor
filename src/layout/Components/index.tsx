import { Collapse, Tabs } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React from 'react'
import { Img } from './Img'
import { Mark } from './Mark'
import {Mosaic} from './Mosaic'
const {TabPane} = Tabs
export function Components() {
  return (
	<Tabs className="flex-grow-0" tabPosition='left'>
      <TabPane className="w-50"  tab="image" key="1">
        <Img />
      </TabPane>
      <TabPane className="w-50" tab="mark" key="2">
        <Mark />
      </TabPane>
      <TabPane className="w-50" tab="mosaic" key="3">
        <Mosaic />
      </TabPane>
	</Tabs>
  )
}
    //<Collapse className="w-2/12 bg-blue-100 pb-5" defaultActiveKey={[1,2,3]}>
    //</Collapse>
