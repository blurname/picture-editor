import React, { DragEvent, MouseEvent, useContext, useState } from 'react'
import { globalContext } from '../../../context'
import './index.css'
type Style = {
  width: number
  height: number
}
type BaseType = {
  style: Style
}
type ImgType = {
  id: number
  style: Style
  value: string
	image: HTMLImageElement
}
type Props = {
  img: ImgType
}
type Pos = {
  top: number
  left: number
}
export function CanvasWrapper(props: Props) {
  const { img } = props
  const [pos, setPos] = useState<Pos>({ top: 100, left: 500 })
  const { globalCanvas, cmpCount, selectNum, setSelectNum } =
    useContext(globalContext)
		
		//todo: optimze render components by useState in image
  // const [curImage, SetCurImage] = useState(
  //   new Image(img.style.height, img.style.width),
  // )

  let curTop = 0
  let curLeft = 0
  const moveHandler = (e: MouseEvent) => {
    e.preventDefault()
    console.log({ top: e.pageY, left: e.pageX })
    console.log(e)
  }
  const upHandler = (e: MouseEvent) => {
    // e.preventDefault()
    setPos({ top: e.screenY, left: e.screenX })
    console.log({ top: e.pageY, left: e.pageX })
    console.log(e)
    console.log('up')
  }
  const downHandler = (e: MouseEvent) => {
    // e.preventDefault()
    curTop = e.clientX
    curLeft = e.clientY
    console.log('down')
    console.log(e)
  }
  const onChoosen = (e: MouseEvent) => {
    const { id, style, value,image } = img
    globalCanvas.selectCmp({
      id,
      width: style.width,
      height: style.height,
      posX: pos.left,
      posY: pos.top,
      value: value,
      image: image,
    })
    setSelectNum(selectNum + 1)
    console.log('has benn choosen')
    console.log(globalCanvas.selectedCmp)
  }
  return (
    <div
      onClick={onChoosen}
      style={{
        height: img.style.height,
        width: img.style.width,
        top: pos.top,
        left: pos.left,
        backgroundColor:
          globalCanvas?.selectedCmp?.id == img.id ? 'red' : 'blue',
      }}
    >
      <img className="imgCanvas" src={img.image.src} alt="" />
    </div>
  )
}
