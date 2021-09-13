import React, {
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { globalContext } from '../../context'
import {
  drawRectBorder,
  getCursorIsInQuad,
  getCursorMovDistance,
  getCursorPosInCanvas,
} from '../../utils/geo-utils'
import { BeamSpirit } from '../../utils/gl-uitls'

type Props = {
}

export function Canvas(props: Props) {
  const { spiritCanvas, selectNum, setSelectNum, adjustNum, cmpCount } =
    useContext(globalContext)
  //let curScrollTop = 0
  let canvas: CanvasPos = {
    width: 1300,
    height: 850,
    left: 320,
    top: 110,
  }
  const [images, setImages] = useState([] as BeamSpirit[])
  let upNum = 0

  //const [maxZOffset, setMaxZOffset] = useState(1)

  const canvas2dRef = useRef(null as HTMLCanvasElement)
  const canvas3dRef = useRef(null as HTMLCanvasElement)
  const handleOnMouseMove = (e: MouseEvent) => {
  }
  const handleOnMouseClick = (e: MouseEvent) => {
    for (let i = 0; i < images.length; i++) {
      const cursorPos = getCursorPosInCanvas(e, canvas) as Pos
      const result = getCursorIsInQuad(
        { x: cursorPos.left, y: cursorPos.top },
        images[i].position,
      )
      if (result !== 'out') {
        drawRectBorder(canvas2dRef.current, images[i].position)
      }
    }
  }

  let preCursor: MouseEvent|undefined
  let curImage: number

  const handleOnMouseDown = (e: MouseEvent) => {
		e.preventDefault()
    const cursorPos = getCursorPosInCanvas(e, canvas) as Pos
    for (let i = 0; i < images.length; i++) {
      const result = getCursorIsInQuad(
        { x: cursorPos.left, y: cursorPos.top },
        images[i].position,
      )
      if (result !== 'out') {
				preCursor = e
        curImage = i
        break
      }
    }
  }
  const handleOnMouseUp = (e: MouseEvent) => {
	e.preventDefault()

    if (preCursor !== undefined) {
      const distance = getCursorMovDistance(preCursor, e, canvas)
      //console.log(maxZOffset)
      //images[curImage].zOffset = maxZOffset
      images[curImage].updatePosition(distance)
      //images[curImage].render()
      setSelectNum(curImage)
      //setMaxZOffset(maxZOffset - 0.000001)
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
    //const image2 = new Image()
    //image2.src = '../../../public/t2.jpg'
    //const pic2 = new BeamSpirit(canvas3dRef.current, image2)
    //images.push(pic2)

    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
  }, [])

  useEffect(() => {
    renderImages()
  }, [adjustNum, cmpCount])

  return (
    <div style={{}} className="bg-orange-500 w-12/12 h-12/12">
      {selectNum}
      {cmpCount}
      <canvas
        className="bg-teal-500"
        ref={canvas2dRef}
        style={{
          top: canvas.top,
          left: canvas.left,
          //backgroundColor: 'whitesmoke',
          position: 'absolute',
        }}
        width={canvas.width}
        height={canvas.height}
      />
      <canvas
        className=""
        //className="bg-blue-200"
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
				//onMouseMove={handleOnMouseMove}
				onMouseDown={handleOnMouseDown}
      />
    </div>
  )
}
