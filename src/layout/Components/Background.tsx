import { Button } from 'antd'
import React, {
  useContext,
} from 'react'
import { globalContext } from '../../context'
import {imgUrl} from './Img'
type Mosaic = {
  id: number
  value: MosaicType
}
const mosaics: Mosaic[] = [
  {
    id: 1,
    value: 'multi',
  },
  //{
    //id: 2,
    //value: 'fract',
  //},
]
export function Background() {
  const { spiritCanvas, setAdjustNum, adjustNum } = useContext(globalContext)

  const onChangeBackNonImage = (shaderName: string) => () => {
    spiritCanvas.addBackground(shaderName, 'backNonImage',true)
    setAdjustNum(adjustNum + 1)
  }
  const onChangeBackImage = (imgUrl: string) => async () => {
    await spiritCanvas.addBackground(imgUrl, 'backImage',true)
    setAdjustNum(adjustNum + 1)
  }
  return (
    <div className="w-1/12">
      <Button onClick={onChangeBackNonImage('cell')}>cell_back</Button>
      <Button onClick={onChangeBackImage(imgUrl + 'back1.jpg')}>back1</Button>
      <Button onClick={onChangeBackNonImage('pure')}>pure_back</Button>
    </div>
  )
}
