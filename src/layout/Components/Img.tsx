import React, { useContext, useEffect, useState } from 'react'
import { menu } from './menuSchema'
import './index.css'
import { globalContext } from '../../context'
import { baseUrl } from '../../utils/http'
import { Image, List, Avatar, Space } from 'antd'
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

export function Img() {
  //const { props } = menu.children.filter((child) => child.desc === 'img')[0]
  //const { spiritCanvas, cmpCount, setCmpCount } = useContext(globalContext)
  //const { style } = props
  //const addToSpirits = (imgSrc: string) => () => {
  //spiritCanvas.addImage(imgSrc, cmpCount)
  //setCmpCount(cmpCount + 1)
  //}
  return (
    //<div className="w-1/12">
    //{imgs.map((img, index) => {
    //return (
    //<div
    //className="auto mb-6"
    //onClick={addToSpirits(img.value)}
    //key={index}
    //>
    //<img className="" src={img.value} />
    //</div>
    //)
    //})}
    //</div>
    <List
      itemLayout="vertical"
      size="small"
      dataSource={imgs}
      renderItem={(img, index) => (
        <List.Item key={index}>
          <div className="w-24 mb-6">
            <img className="" src={img.value} />
          </div>
        </List.Item>
      )}
    />
  )
}
