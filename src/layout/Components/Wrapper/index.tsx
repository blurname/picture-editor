import React, {useContext, useState } from 'react'
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
id:number
  style: Style
  value: string
}
type Props = {
  base: BaseType
  img: ImgType
}
export function Wrapper(props: Props) {
  const { base, img } = props
  const { globalCanvas, cmpCount, setCmpCount } = useContext(globalContext)
  const addCmp = (cmp: Cmp):void => {
    globalCanvas.addCmp(cmp)
    setCmpCount(cmpCount + 1)
    console.log(globalCanvas.cmps)
  }
	const image = new Image()
	image.src = img.value
  return (
    <div
      onClick={():void =>
			{
        addCmp({
				id:globalCanvas.cmps.length,
          height: img.style.height,
          width: img.style.width,
          posX: 100,
          posY: 100,
          value: img.value,
					image
        })
				console.log(img.id);
				}
      }
      style={{ height: base.style.height, width: base.style.width }}
    >
      <img className="imgComponent" src={img.value} alt="" />
    </div>
  )
}
