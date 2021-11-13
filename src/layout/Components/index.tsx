import { Collapse, Tabs } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React from 'react'
import {Background} from './Background'
import { Img } from './Img'
import { Mark } from './Mark'
import {Mosaic} from './Mosaic'
const {TabPane} = Tabs
export function Components() {
  return (
	<Tabs className="flex-grow-0 bg-lime-50" tabPosition='left' size='small' tabBarStyle={{width:100}} type='card'>
      <TabPane className="w-45"  tab="image" key="1">
        <Img />
      </TabPane>
      <TabPane className="w-45" tab="mark" key="2">
        <Mark />
      </TabPane>
      <TabPane className="w-45" tab="mosaic" key="3">
        <Mosaic />
      </TabPane>
      <TabPane className="w-45" tab="background" key="4">
        <Background />
      </TabPane>
	</Tabs>
  )
}
