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
import {
  createRectangle,
  drawRectBorder,
  getCursorIsInQuad,
  getCursorMovDistance,
  getCursorPosInCanvas,
} from '../../utils/geo-utils'
import { BeamSpirit } from '../../utils/gl-uitls'

export function Canvas() {
  const {spiritCanvas,selectNum, setSelectNum,adjustNum } =
    useContext(globalContext)
  const canvas: CanvasPos = {
    width: 600,
    height: 600,
    left: 260,
    top: 130,
  }
  const [images, setImages] = useState([] as BeamSpirit[])

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
    if (preCursor !== null) {
      const distance = getCursorMovDistance(preCursor, cursor, canvas)
      console.log(maxZOffset)
      images[curImage].zOffset = maxZOffset
      images[curImage].updatePosition(distance)
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

  let pic1: BeamSpirit = undefined
  let pic2: BeamSpirit = undefined
  let pic3: BeamSpirit = undefined

  useEffect(() => {
    //the z position more big,the view more far
    const image = new Image()
    image.src = '../../public/t2.jpg'
    pic1 = new BeamSpirit(canvas3dRef.current, image)
    const image2 = new Image()
    image2.src = '../../public/t3.jpg'
    pic2 = new BeamSpirit(canvas3dRef.current, image2)
    const image3 = new Image()
    image3.src = '../../public/test.jpg'
    pic3 = new BeamSpirit(canvas3dRef.current, image3)
    images.push(pic1)
    images.push(pic2)
    images.push(pic3)
		renderImages()
		spiritCanvas.spirits = images

    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
  }, [])
  useEffect(() => {
    // console.log(`preCursor+${selectNum}`)
    // console.log(images)
    renderImages()
  }, [adjustNum])

  return (
    <div className="Canvas">
      <div>Canvas</div>
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
