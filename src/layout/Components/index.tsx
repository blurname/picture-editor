import { Tabs } from 'antd'
import React, { useContext, useEffect } from 'react'
import { globalContext, userContext } from '../../context'
import { Background } from './Background'
import { Img } from './Img'
import { Mark } from './Mark'
import { Mosaic } from './Mosaic'
import { SortingLayers } from './SortingLayers'
const { TabPane } = Tabs
export function Components() {
  const { spiritCanvas, socket, setCmpCount, setAdjustNum, adjustNum } =
    useContext(globalContext)
  useEffect(() => {
    socket.on('client-add', (type: string, element: any, id: number) => {
      if (type === 'Image') {
        spiritCanvas.addImage(element, id,true)
      } else if (type === 'Mark') {
        spiritCanvas.addMark(element, id,true)
      } else if (type === 'Mosaic') {
        spiritCanvas.addMosaic(element, id,true)
      }
      setCmpCount(id + 1)
      setAdjustNum(adjustNum + 1)
    })
  }, [])

  return (
    <Tabs
      className="flex-grow-0 bg-blue-gray-200"
      tabPosition="left"
      size="small"
      tabBarStyle={{ width: 100 }}
      type="card"
    >
      <TabPane className="w-45 h-30" tab="image" key="1">
        <Img socket={socket} />
      </TabPane>
      <TabPane className="w-45 h-30" tab="mark" key="2">
        <Mark socket={socket}/>
      </TabPane>
      <TabPane className="w-45 h-30" tab="mosaic" key="3">
        <Mosaic socket={socket}/>
      </TabPane>
      <TabPane className="w-45 h-30" tab="background" key="4">
        <Background />
      </TabPane>
      {/* <TabPane className="w-45 h-30" tab="layers" key="5">
        <SortingLayers />
      </TabPane> */}
    </Tabs>
  )
}
