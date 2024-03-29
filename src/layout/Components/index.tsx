import { Tabs } from 'antd'
import React, { useContext, useEffect } from 'react'
import { globalContext, userContext } from '../../context'
import { PointSpirit } from '../../utils/gl-uitls'
import { getPoints, getSpirits } from '../../utils/http'
import { CModel, remoteModel } from '../Canvas'
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
    socket.on('client-add', async (type: string, element: any, id: number) => {
      if (type === 'Image') {
        spiritCanvas.addImage(element, id,true)
      } else if (type === 'Mark') {
        spiritCanvas.addMark(element, id,true)
      } else if (type === 'Mosaic') {
        spiritCanvas.addMosaic(element, id,true)
      } else if (type === 'PointContainer') {
        const points = await getPoints(id)
          const pointSpirits = points.map((point) => (new PointSpirit(spiritCanvas.canvas3d, point)))
          console.log({ points })
          spiritCanvas.updateFromRemote(
            model.spiritType,
            model.model,
            pointSpirits as any,
            model.uniqueProps,
          )
      }
      setCmpCount(id + 1)
      setAdjustNum(adjustNum + 1)
    })
  }, [])
  useEffect(() => {
    socket.on("client-back",async()=>{
      
    // debugger
      const init = (await getSpirits(spiritCanvas.id)) as remoteModel[]
      const sorted = init.sort((a, b) => a.canvas_spirit_id - b.canvas_spirit_id)
      if (sorted.length > 0) {
        const models: CModel[] = sorted.map((img) => {
          return {
            id: img.id,
            spiritType: img.spirit_type,
            model: JSON.parse(img.model),
            element: img.element,
            uniqueProps: JSON.parse(img.unique_props),
          }
        })
        models.forEach(async (model,index) => {
          // for special spirit
          // if (model.spiritType === 6) {
          //   const points = await getPoints(model.id)
          //   const pointSpirits = points.map((point) => (new PointSpirit(spiritCanvas.canvas3d, point)))
          //   console.log({ points })
          //   spiritCanvas.updateFromRemote(
          //     model.spiritType,
          //     model.model,
          //     pointSpirits as any,
          //     model.uniqueProps,
          //   )
          // } else {
            if(index===0){
              spiritCanvas.updateFromRemote(
                model.spiritType,
                model.model,
                model.element,
                model.uniqueProps,
              )
            }
          // }
        })
        // setTimeout(() => {
        //   renderAll()
        // }, 1000)
      }
      
      setAdjustNum(adjustNum + 1)
    })
  }, []);
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
        <Background socket={socket} />
      </TabPane>
      {/* <TabPane className="w-45 h-30" tab="layers" key="5">
        <SortingLayers />
      </TabPane> */}
    </Tabs>
  )
}
