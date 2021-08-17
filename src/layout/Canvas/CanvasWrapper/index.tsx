import React from 'react'
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
  img: ImgType
}
export function CanvasWrapper(props: Props) {
  const { img } = props
  return (
    <div style={{ height: img.style.height, width: img.style.width }}>
      <img className="img" src={img.value} alt="" />
    </div>
  )
}
