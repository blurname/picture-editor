import React, {
  DragEvent,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { globalContext } from '../../context'
import {} from './index.css'
import {
  createRectangle,
  drawRectBorder,
  getCursorIsInQuad,
  getCursorMovDistance,
  getCursorPosInCanvas,
} from '../../utils/geo-utils'
import { BeamSpirit } from '../../utils/gl-uitls'

export function Canvas() {
  const { spiritCanvas, selectNum, setSelectNum, adjustNum, cmpCount } =
    useContext(globalContext)
  const canvas: CanvasPos = {
    width: 600,
    height: 600,
    left: 260,
    top: 130,
  }
  const [images, setImages] = useState([] as BeamSpirit[])
  let upNum = 0

  const [maxZOffset, setMaxZOffset] = useState(1)

  const canvas3dRef = useRef(null as HTMLCanvasElement)
  const canvas2dRef = useRef(null as HTMLCanvasElement)
  const handleOnMouseMove = (e: MouseEvent) => {}
  const handleOnMouseClick = (e: MouseEvent) => {
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    for (let i = 0; i < images.length; i++) {
      const cursorPos = getCursorPosInCanvas(cursor, canvas) as Pos
      const result = getCursorIsInQuad(
        { x: cursorPos.left, y: cursorPos.top },
        images[i].position,
      )
      if (result !== 'out') {
        drawRectBorder(canvas2dRef.current, images[i].position)
      }
    }
  }

  let preCursor: Pos | null
  let curImage: number

  const handleOnMouseDown = (e: MouseEvent) => {
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    preCursor = null
    const cursorPos = getCursorPosInCanvas(cursor, canvas) as Pos
    for (let i = 0; i < images.length; i++) {
      const result = getCursorIsInQuad(
        { x: cursorPos.left, y: cursorPos.top },
        images[i].position,
      )
      if (result !== 'out') {
        preCursor = cursor
        curImage = i
        break
      }
    }
  }
  const handleOnMouseUp = (e: MouseEvent) => {
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    console.log((upNum += 1))
    if (preCursor !== null) {
      const distance = getCursorMovDistance(preCursor, cursor, canvas)
      //console.log(maxZOffset)
      images[curImage].zOffset = maxZOffset
      images[curImage].updatePosition(distance)
      //images[curImage].render()
      setSelectNum(curImage)
      setMaxZOffset(maxZOffset - 0.000001)
      for (let i = 0; i < images.length; i++) {
        images[i].render()
        if (curImage === i) {
          drawRectBorder(canvas2dRef.current, images[i].position)
        }
      }
    }
  }
  const renderImages = () => {
    for (const image of images) {
      image.render()
    }
  }

  useEffect(() => {
    //the z position more big,the view more far
    spiritCanvas.setCanvas3d(canvas3dRef.current)
    spiritCanvas.spirits = images
    const image = new Image()
    image.src = '../../../public/t3.jpg'
    const pic1 = new BeamSpirit(canvas3dRef.current, image)
		images.push(pic1)

    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
  }, [])
  useEffect(() => {
    renderImages()
  }, [adjustNum, cmpCount])

  return (
    <div className="Canvas">
      <div>Canvas</div>
      {cmpCount}
      {adjustNum}
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
    </div>
  )
}
