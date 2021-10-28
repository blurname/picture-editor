import React, { useContext, useEffect, useState } from 'react'
import { menu } from './menuSchema'
import './index.css'
import { globalContext } from '../../context'
import {baseUrl} from '../../utils/http'
type ImgType = {
  id: number
  value: string
}
const imgUrl = baseUrl+'/image/get_single/'
const imgs: ImgType[] = [
  {
    id: 1,
    value: imgUrl+'test.jpg',
  },
  {
    id: 2,
    value: imgUrl+'t2.jpg',
  },
  {
    id: 3,
    value: imgUrl+'t3.jpg',
  },
  {
    id: 4,
    value: imgUrl+'t1.jpeg',
  },
  {
    id: 5,
    value: imgUrl+'t4.jpeg',
  },{
    id: 5,
    value: imgUrl+'t5.jpeg',
  },
]

export function Img() {
  const { props } = menu.children.filter((child) => child.desc === 'img')[0]
  const { spiritCanvas, cmpCount, setCmpCount } = useContext(globalContext)
  const { style } = props
  const addToSpirits = (imgSrc: string) => () => {
    spiritCanvas.addImage(imgSrc,cmpCount)
    setCmpCount(cmpCount + 1)
  }
	useEffect(() => {
		//addToSpirits(imgs[1].value)()
	}, []);
  return (
    <div className="">
      {imgs.map((img, index) => {
        return (
          <div
            className="auto mb-6"
            onClick={addToSpirits(img.value)}
            key={index}
          >
            <img className="imgComponent" src={img.value} alt="" />
          </div>
        )
      })}
    </div>
  )
}
