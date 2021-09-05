import React, { MouseEvent, useContext, useEffect, useRef } from 'react'
import { globalContext } from '../../context'
import { CanvasWrapper } from './CanvasWrapper'
import {} from './index.css'
// import {render} from '../../filter/t'
import { ImageCanvas } from '../../filter/ImageCanvas'
import { CanvasPos, createRectangle, getCursorIsInQuad, getCursorPosInCanvas, Pos } from '../../utils/geo-utils'
export function Canvas() {
  const { globalCanvas, cmpCount } = useContext(globalContext)
  const canvas: CanvasPos = {
    width: 600,
    height: 600,
    left: 550,
    top: 100,
  }
  const quad = createRectangle(-0.5)
  const quad2 = createRectangle(0.1)
	const quads:number[][] = new Array()
	quads.push(quad.vertex.position)
	quads.push(quad2.vertex.position)
	console.log(quads);

  const canvasRef = useRef(null as HTMLCanvasElement)
  const handleOnMouseMove = (e: MouseEvent) => {
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    const cursorPos =  getCursorPosInCanvas(cursor, canvas) as Pos
		// console.log(cursorPos);
		// console.log("lux:"+quad.vertex.position[3]+" luy:"+quad.vertex.position[4]);
		// console.log("rdx:"+quad.vertex.position[9]+" rdy:"+quad.vertex.position[10]);
		console.log(getCursorIsInQuad({x:cursorPos.left,y:cursorPos.top}, quad.vertex.position));
  }

  useEffect(() => {
    ImageCanvas({ canvas: canvasRef })
		console.log(canvasRef.current)
  }, [])

  return (
    <div className="Canvas">
      <canvas
        ref={canvasRef}
        style={{
          top: canvas.top,
          left: canvas.left,
          backgroundColor: 'yellowgreen',
          position: 'absolute',
        }}
        width={canvas.width}
        height={canvas.height}
        onMouseMove={handleOnMouseMove}
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
