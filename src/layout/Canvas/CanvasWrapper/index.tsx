import React ,{DragEvent, MouseEvent, useState}from 'react'
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
type Pos = {
top:number
left:number
}
export function CanvasWrapper(props: Props) {
  const { img } = props
	const [pos, setPos] = useState({top:100,left:500} as Pos);
	let curTop = 0 
	let curLeft = 0 
	const moveHandler =  (e:MouseEvent) => {
	e.preventDefault()
		console.log({top:e.pageY,left:e.pageX})
		console.log(e)
	}
	const upHandler =  (e:MouseEvent) => {
	// e.preventDefault()
		setPos({top:e.screenY,left:e.screenX})
		console.log({top:e.pageY,left:e.pageX})
		console.log(e)
		console.log('up');
	}
	const downHandler =  (e:MouseEvent) => {
	// e.preventDefault()
	curTop = e.clientX
	curLeft = e.clientY
		console.log('down')
		console.log(e)
	}
  return (
    <div onMouseMove={moveHandler} onMouseUp={upHandler} onMouseDown={downHandler} style={{ position:'absolute', height: img.style.height, width: img.style.width,top:pos.top,left:pos.left }}>
      <img className="img" src={img.value} alt="" />
    </div>
  )
}
