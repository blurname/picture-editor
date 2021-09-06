import React, { MouseEvent, useContext, useEffect, useRef } from 'react'
import { globalContext } from '../../context'
import { CanvasWrapper } from './CanvasWrapper'
import {} from './index.css'
// import {render} from '../../filter/t'
import { ImageCanvas } from '../../filter/ImageCanvas'
import {
  CanvasPos,
  createRectangle,
  drawRectBorder,
  getCursorIsInQuad,
  getCursorPosInCanvas,
  Pos,
} from '../../utils/geo-utils'

type DrawInCanvas = {
  x: number
  y: number
  width: number
  height: number
}
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
  const quads: number[][] = new Array()
  quads.push(quad.vertex.position)
  quads.push(quad2.vertex.position)
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
    console.log(
      getCursorIsInQuad(
        { x: cursorPos.left, y: cursorPos.top },
        quad.vertex.position,
      ),
    )
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

  useEffect(() => {
    ImageCanvas({ canvas: canvas3dRef })
    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
    // ctx.fillStyle = 'rgb(200,0,0)'
    // ctx.fillRect(0, 0, 60, 50)
    // ctx.fillStyle = 'rgb(0,200,0)'
    // ctx.fillRect(0, 50, 60, 50)
    // ctx.strokeStyle = 'blue'
    // ctx.strokeRect(0, 0, 60, 50)
    console.log(canvas2dRef.current)
  }, [])

  return (
    <div>
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
