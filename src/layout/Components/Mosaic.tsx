import { Button, List } from 'antd'
import React, {
  useState,
  useContext,
} from 'react'
import { globalContext } from '../../context'
import {imgUrl} from './Img'
type Mosaic = {
  id: number
  value: MosaicType
	imgUrl:string
}
const mosaics: Mosaic[] = [
  {
    id: 1,
    value: 'multi',
		imgUrl:imgUrl+'scr-multi.png'
  },
  {
    id: 2,
    value: 'frac',
		imgUrl:imgUrl+'scr-multi.png'
  },
]
export function Mosaic() {

  const { spiritCanvas, cmpCount, setCmpCount } = useContext(globalContext)
  const addMosaic = (type: MosaicType) => () => {
    spiritCanvas.addMosaic(type, cmpCount)
    setCmpCount(cmpCount + 1)
  }
  return (
    <List
      itemLayout="vertical"
      size="small"
      dataSource={mosaics}
      renderItem={(img, index) => (
        <List.Item key={index}>
          <div className="w-24 mb-6" onClick={addMosaic(img.value)}>
            <img className="" src={img.imgUrl} />
          </div>
        </List.Item>
      )}
    />
  )
}
