import React, { useContext, useState } from 'react'
import { menu } from './menuSchema'
import './index.css'
import { globalContext } from '../../context'
type ImgType = {
  id: number
  style: { width: number; height: number }
  value: string
}
const imgs: ImgType[] = [
  {
    id: 1,
    style: { width: 80, height: 140 },
    value: '../../../../public/test.jpg',
  },
  {
    id: 2,
    style: { width: 20, height: 190 },
    value: '../../../../public/t2.jpg',
  },
  {
    id: 3,
    style: { width: 30, height: 180 },
    value: '../../../../public/t3.jpg',
  },
  {
    id: 4,
    style: { width: 40, height: 180 },
    value: '../../../../public/test.jpg',
  },
  {
    id: 5,
    style: { width: 50, height: 190 },
    value: '../../../../public/test.jpg',
  },
]

export function Img() {
  const { props } = menu.children.filter((child) => child.desc === 'img')[0]
  const { spiritCanvas, cmpCount, setCmpCount } = useContext(globalContext)
  const { style } = props
  const addToSpirits = (imgSrc: string) => () => {
    spiritCanvas.addSpirit(imgSrc)
    setCmpCount(cmpCount + 1)
  }
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
