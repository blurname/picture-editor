import { Beam, ResourceTypes } from 'beam-gl'
import React, {
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { globalContext } from '../../context'
import { circleShader, theWShader } from '../../filter/shader'
import {
  createCircle,
  createHollowRectangle,
  drawRectBorder,
  getCursorIsInQuad,
  getCursorMovDistance,
  getCursorPosInCanvas,
} from '../../utils/geo-utils'
import {
	BackGrid,
  BeamSpirit,
  CircleSpirit,
  ImageSpirit,
  MarkSpirit,
	TheW,
} from '../../utils/gl-uitls'
import {mat2} from 'gl-matrix'

type Props = {}

export function Canvas(props: Props) {
  const { spiritCanvas, selectNum, setSelectNum, adjustNum, cmpCount } =
    useContext(globalContext)
  let canvas: CanvasPos = {
    width: 1300,
    height: 1300,
    left: 320,
    top: 110,
  }
  const [images, setImages] = useState([] as BeamSpirit[])

  //const [maxZOffset, setMaxZOffset] = useState(1)

  const canvas2dRef = useRef(null as HTMLCanvasElement)
  const canvas3dRef = useRef(null as HTMLCanvasElement)
  const handleOnMouseMove = (e: MouseEvent) => {
	
	}
  //const handleOnMouseClick = (e: MouseEvent) => {
	//}

  let preCursor: MouseEvent | undefined
  let curImage: number
  const handleOnMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    const cursorPos = getCursorPosInCanvas(e, canvas) as Pos
    let isChecked: boolean = false
    for (let i = 0; i < images.length; i++) {
      if (images[i] !== null) {
        const result = getCursorIsInQuad(
          { x: cursorPos.left, y: cursorPos.top },
          images[i].getGuidRect(),
        )
        console.log(result)

				if (result !== 'out') {
					preCursor = e
					curImage = i
					drawRectBorder(canvas2dRef.current, images[i].getGuidRect())
					canvas3dRef.current.style.cursor = 'move'
					isChecked = true
					break
				}
      }
      if (isChecked === false) {
        preCursor = undefined
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
      spiritCanvas.updateGuidRect(
        images[curImage].getGuidRect(),
        images[curImage].getId(),
      )

      setSelectNum(curImage)
      //setMaxZOffset(maxZOffset - 0.000001)
      for (let i = 0; i < images.length; i++) {
        if (images[i] !== null) {
          images[i].render()
          if (curImage === i) {
            preCursor = e
            drawRectBorder(canvas2dRef.current, images[i].getGuidRect())
            canvas3dRef.current.style.cursor = 'default'
          }
        }
      }
      spiritCanvas.renderAllLine()
    }
  }
  const renderImages = () => {
    for (const image of images) {
      if (image !== null) image.render()
    }
  }

  useEffect(() => {
    //the z position more big,the view more far
    spiritCanvas.setCanvas3d(canvas3dRef.current)
    spiritCanvas.spirits = images
		//spiritCanvas.addMark('theW', 101)
		//spiritCanvas.addImage('../../../public/t4.jpeg', 101)
		//const theW = new TheW(canvas3dRef.current,101)
		//theW.render()
		const back = new BackGrid(canvas3dRef.current,101);
		spiritCanvas.spirits.push(back)
		//back.render()

    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
		//spiritCanvas.renderAllLine()
  }, [])

  useEffect(() => {
    renderImages()
  }, [adjustNum, cmpCount])

  return (
    <div
			className="w-12/12 h-12/12"
    >
      <canvas
        className="bg-gray-100"
        ref={canvas2dRef}
        style={{
          top: canvas.top,
          left: canvas.left,
          position: 'absolute',
        }}
        width={canvas.width}
        height={canvas.height}
      />
      <canvas
        className=""
        ref={canvas3dRef}
        style={{
          top: canvas.top,
          left: canvas.left,
          position: 'absolute',
        }}
        width={canvas.width}
        height={canvas.height}
        onMouseUp={handleOnMouseUp}
				//onMouseMove={handleOnMouseMove}
				onMouseDown={handleOnMouseDown}
      />
    </div>
  )
}
