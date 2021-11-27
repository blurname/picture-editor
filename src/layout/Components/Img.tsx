import React, { useContext, useEffect, useState } from 'react'
import { menu } from './menuSchema'
import './index.css'
import { globalContext } from '../../context'
import { baseUrl } from '../../utils/http'
import { Image, List, Avatar, Space } from 'antd'
import {Socket} from 'socket.io-client'
type ImgType = {
  id: number
  value: string
}
export const imgUrl = baseUrl + '/image/get_single/'
const imgs: ImgType[] = [
  {
    id: 1,
    value: imgUrl + 'test.jpg',
  },
  {
    id: 2,
    value: imgUrl + 't2.jpg',
  },
  {
    id: 3,
    value: imgUrl + 't3.jpg',
  },
  {
    id: 4,
    value: imgUrl + 't1.jpeg',
  },
  {
    id: 5,
    value: imgUrl + 't4.jpeg',
  },
  {
    id: 5,
    value: imgUrl + 't5.jpeg',
  },
]
type Props = {
	socket:Socket
}
export function Img(prop:Props) {
  //const { props } = menu.children.filter((child) => child.desc === 'img')[0]
  const { spiritCanvas, cmpCount, setCmpCount, setAdjustNum, adjustNum } =
    useContext(globalContext)
  //const { style } = props
  const addToSpirits = (imgSrc: string) => () => {
    spiritCanvas.addImage(imgSrc, cmpCount)
		prop.socket.emit('server-add',spiritCanvas.id,'Image',imgSrc,cmpCount)
    setCmpCount(cmpCount + 1)
    setAdjustNum(adjustNum + 1)
  }
  return (
    <List
      itemLayout="vertical"
      size="small"
      dataSource={imgs}
      renderItem={(img, index) => (
        <List.Item key={index}>
          <div className="w-24 mb-6" onClick={addToSpirits(img.value)}>
            <img className="" src={img.value} />
          </div>
        </List.Item>
      )}
    />
  )
}
