import React, {
  DragEvent,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { globalContext } from '../../context'
import { CanvasWrapper } from './CanvasWrapper'
import {} from './index.css'
// import {render} from '../../filter/t'
import { ImageCanvas } from '../../filter/ImageCanvas'
import {
  createRectangle,
  drawRectBorder,
  getCursorIsInQuad,
  getCursorMovDistance,
  getCursorPosInCanvas,
} from '../../utils/geo-utils'
import { BeamSpirit } from '../../utils/gl-uitls'

export function Canvas() {
  const { globalCanvas, cmpCount } = useContext(globalContext)
  const canvas: CanvasPos = {
    width: 600,
    height: 600,
    left: 300,
    top: 100,
  }
  const quad = createRectangle(-0.5)
  const quad2 = createRectangle(0.5)
  const quad3 = createRectangle(0.1)
  const quad4 = createRectangle(0.2)
  const quads: number[][] = new Array()
  quads.push(quad.vertex.position)
  quads.push(quad2.vertex.position)
  quads.push(quad3.vertex.position)
  quads.push(quad4.vertex.position)
  console.log(quads)

  const canvas3dRef = useRef(null as HTMLCanvasElement)
  const canvas2dRef = useRef(null as HTMLCanvasElement)
  const handleOnMouseMove = (e: MouseEvent) => {
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    const cursorPos = getCursorPosInCanvas(cursor, canvas) as Pos
    // console.log(cursorPos);
    // console.log("lux:"+quad.vertex.position[3]+" luy:"+quad.vertex.position[4]);
    // console.log("rdx:"+quad.vertex.position[9]+" rdy:"+quad.vertex.position[10]);
    drawRectBorder(canvas2dRef.current, quad.vertex.position)
    // console.log(
    //   getCursorIsInQuad(
    //     { x: cursorPos.left, y: cursorPos.top },
    //     quad.vertex.position,
    //   ),
    // )
  }
  const handleOnMouseClick = (e: MouseEvent) => {
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    for (let i = 0; i < quads.length; i++) {
      const cursorPos = getCursorPosInCanvas(cursor, canvas) as Pos
      const result = getCursorIsInQuad(
        { x: cursorPos.left, y: cursorPos.top },
        quads[i],
      )
      if (result !== 'out') {
        drawRectBorder(canvas2dRef.current, quads[i])
      }
    }
  }
  // const [preCursor, setPreCursor] = useState({left:0,top:0} as Pos);

  let preCursor: Pos = { left: 0, top: 0 }

  const handleOnMouseDown = (e: MouseEvent) => {
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    preCursor = cursor
  }
  const handleOnMouseUp = (e: MouseEvent) => {
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    const distance = getCursorMovDistance(preCursor, cursor, canvas)
		pic2.updatePosition(distance)
  }
  let pic2: BeamSpirit = undefined
  useEffect(() => {
    ImageCanvas({ canvas: canvas3dRef })
    const image2 = new Image()
    image2.src = '../../public/t3.jpg'
    pic2 = new BeamSpirit(canvas3dRef.current, image2, 0.2)
    pic2.render()
    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
    console.log(canvas2dRef.current)
  }, [])

  return (
    <div className="Canvas">
      <canvas
        ref={canvas2dRef}
        style={{
          top: canvas.top,
          left: canvas.left,
          backgroundColor: 'whitesmoke',
          position: 'absolute',
        }}
        width={canvas.width}
        height={canvas.height}
      ></canvas>
      <canvas
        ref={canvas3dRef}
        style={{
          top: canvas.top,
          left: canvas.left,
          position: 'absolute',
        }}
        width={canvas.width}
        height={canvas.height}
        onClick={handleOnMouseClick}
        onMouseUp={handleOnMouseUp}
				// onMouseMove={handleOnMouseUp}
        onMouseDown={handleOnMouseDown}
      ></canvas>
      <div>Canvas</div>
      <div>cmpCount:{cmpCount}</div>
      <div style={{ position: 'relative' }}>
        {globalCanvas.cmps.map((cmp, index) => {
          return (
            <CanvasWrapper
              key={index.toString()}
              img={{
                id: cmp.id,
                style: { width: cmp.width, height: cmp.height },
                value: cmp.value,
                image: cmp.image,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
