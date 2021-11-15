import { Tabs } from 'antd'
import React from 'react'
import {Background} from './Background'
import { Img } from './Img'
import { Mark } from './Mark'
import {Mosaic} from './Mosaic'
import {SortingLayers} from './SortingLayers'
const {TabPane} = Tabs
export function Components() {
  return (
	<Tabs className="flex-grow-0 bg-blue-300" tabPosition='left' size='small' tabBarStyle={{width:100}} type='card'>
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
      <TabPane className="w-45" tab="layers" key="5">
        <SortingLayers />
      </TabPane>
	</Tabs>
  )
}
