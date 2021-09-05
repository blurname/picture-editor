import React, { MouseEvent, useContext, useEffect, useRef } from 'react'
import { globalContext } from '../../context'
import { CanvasWrapper } from './CanvasWrapper'
import {} from './index.css'
// import {render} from '../../filter/t'
import { TCanvas } from '../../filter/t'
import { ImageCanvas } from '../../filter/ImageCanvas'
import { CanvasPos, getCursorPosInCanvas, Pos } from '../../utils/geo-utils'
export function Canvas() {
  const { globalCanvas, cmpCount } = useContext(globalContext)
  const canvas: CanvasPos = {
    width: 600,
    height: 600,
    left: 550,
    top: 100,
  }
  const tCmp: Cmp = {
    id: 0,
    width: 200,
    height: 200,
    posX: 100,
    posY: 100,
    value: '../../../../public/test.jpg',
    image: undefined,
  }
  tCmp.image = new Image(tCmp.width, tCmp.height)
  tCmp.image.src = tCmp.value
  // tCmp.image.width = tCmp.width
  // tCmp.image.height = tCmp.height
  // tCmp.image.src = tCmp.value

  const canvasRef = useRef(null as HTMLCanvasElement)
  const handleOnMouseMove = (e: MouseEvent) => {
    console.log('x' + (e.pageX-canvas.left))
    console.log('y' + (e.pageY-canvas.top))
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    console.log(getCursorPosInCanvas(cursor, canvas))
  }
  useEffect(() => {
    ImageCanvas({ canvas: canvasRef })
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
