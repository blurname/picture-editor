import React, { useContext, useState } from 'react'
import { globalContext } from '../../../context'
import { Canvas } from '../../../store/globalCanvas'
import './index.css'
type Style = {
  width: number
  height: number
}
type BaseType = {
  style: Style
}
type ImgType = {
  style: Style
  value: string
}
type Props = {
  base: BaseType
  img: ImgType
}
export function Wrapper(props: Props) {
  const { base, img } = props
	const {globalCanvas,cmpCount,setCmpCount} = useContext(globalContext)
  const addCmp = (cmp: Cmp) => {
    globalCanvas.addCmp(cmp)
		setCmpCount(cmpCount+1)
    console.log(globalCanvas.cmps)
  }
  return (
    <div
      onClick={() =>
        addCmp({
          id: 1,
          height: img.style.height,
          width: img.style.width,
          posX: 100,
          posY: 100,
          value:
            'https://gss0.baidu.com/70cFfyinKgQFm2e88IuM_a/baike/pic/item/c995d143ad4bd1139851712355afa40f4bfb0507.jpg',
        })
      }
      style={{ height: base.style.height, width: base.style.width }}
    >
      <img className="img" src={img.value} alt="" />
    </div>
  )
}
