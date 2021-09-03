import React, { useState } from 'react'
import { Wrapper } from '../Wrapper'
import { menu } from '../menu'
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
  const imgBase = menu.children.filter((child) => child.desc === 'img')[0]
  return (
    <>
      {imgs.map((img, index) => {
        return <Wrapper key={index.toString()} base={imgBase.props} img={img} />
      })}
    </>
  )
}
