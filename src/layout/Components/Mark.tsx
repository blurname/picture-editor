import { Button, List } from 'antd'
import React, { useContext } from 'react'
import {Socket} from 'socket.io-client'
import { globalContext } from '../../context'
import { imgUrl } from './Img'
import { menu } from './menuSchema'

type MarkType = {
  id: number
  value: Shape
  imgUrl: string
}
const marks: MarkType[] = [
  {
    id: 1,
    value: 'line',
    imgUrl: imgUrl + 'scr-line.png',
  },
  {
    id: 2,
    value: 'hollowRect',
    imgUrl: imgUrl + 'scr-hollowrect.png',
  },
  { id: 3, value: 'circle',

    imgUrl: imgUrl + 'scr-circle.png',
	},
]

type Props = {
	socket:Socket
}
export function Mark(prop:Props) {
  const { spiritCanvas, cmpCount, setCmpCount } = useContext(globalContext)
  const addMark = (shape: Shape) => () => {
    spiritCanvas.addMark(shape, cmpCount)
		prop.socket.emit('server-add',spiritCanvas.id,'Mark',shape,cmpCount)
    setCmpCount(cmpCount + 1)
  }
  return (
    <List
      itemLayout="vertical"
      size="small"
      dataSource={marks}
      renderItem={(img, index) => (
        <List.Item key={index}>
          <div className="w-24 mb-6" onClick={addMark(img.value)}>
            <img className="" src={img.imgUrl} />
          </div>
        </List.Item>
      )}
    />
  )
}
    //<div className="">
      //{marks.map((mark, index) => {
        //return (
          //<div className="w-1/12 mb-6" key={mark.id}>
            //<Button onClick={addMark(mark.value)}>{mark.value}</Button>
          //</div>
        //)
      //})}
    //</div>
