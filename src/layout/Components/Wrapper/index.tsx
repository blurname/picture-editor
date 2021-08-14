import React from 'react'
import './index.css'
type Style = {
  width: number
  height: number
}
type BaseType = {
  style: Style
}
type ImgType = {
	style:Style
	value:string
}
type Props = {
  base: BaseType
	img:ImgType
}
export function Wrapper(props: Props) {
  const { base,img } = props
  return (
    <div style={{ height: base.style.height, width: base.style.width }}>
      <img className='img' src={img.value} alt="" />
    </div>
  )
}
