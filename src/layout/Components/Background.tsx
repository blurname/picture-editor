import { Button, List } from 'antd'
import React, { useContext } from 'react'
import { globalContext } from '../../context'
import { imgUrl } from './Img'
type Mosaic = {
  id: number
  value: string
  imgUrl: string
  type: 'nonImage' | 'image'
}
const backs: Mosaic[] = [
  {
    id: 1,
    value: 'cell',
    imgUrl: imgUrl + 'scr-cell.png',
    type: 'nonImage',
  },
  {
    id: 2,
    value: 'pure',
    imgUrl: imgUrl + 'scr-pure.png',
    type: 'nonImage',
  },
  {
    id: 3,
    value: imgUrl+'back1.jpg',
    imgUrl: imgUrl + 'back1.jpg',
    type: 'image',
  },
]
export function Background() {
  const { spiritCanvas, setAdjustNum, adjustNum } = useContext(globalContext)

  const onChangeBackNonImage = (shaderName: string) => () => {
    spiritCanvas.addBackground(shaderName, 'backNonImage', true)
    setAdjustNum(adjustNum + 1)
  }
  const onChangeBackImage = (imgUrl: string) => async () => {
    await spiritCanvas.addBackground(imgUrl, 'backImage', true)
    setAdjustNum(adjustNum + 1)
  }
  return (
    <List
      itemLayout="vertical"
      size="small"
      dataSource={backs}
      renderItem={(img, index) => {
        if (img.type === 'nonImage') {
          return (
            <List.Item key={index}>
              <div
                className="w-24 mb-6"
                onClick={onChangeBackNonImage(img.value)}
              >
                <img className="" src={img.imgUrl} />
              </div>
            </List.Item>
          )
        } else {
          return (
            <List.Item key={index}>
              <div className="w-24 mb-6" onClick={onChangeBackImage(img.value)}>
                <img className="" src={img.imgUrl} />
              </div>
            </List.Item>
          )
        }
      }}
    />
  )
}
