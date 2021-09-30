import { Beam, ResourceTypes } from 'beam-gl'
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
import {
  BeamSpirit,
  ImageSpirit,
  MosaicSpirit,
  TheW,
} from '../../utils/gl-uitls'
import { textRneder } from '../../utils/textRender'

type Props = {}

export function Canvas(props: Props) {
  const {
    spiritCanvas,
    selectNum,
    setSelectNum,
    adjustNum,
    cmpCount,
    zoomable,
    appRef,
  } = useContext(globalContext)
  let canvas: CanvasPos = {
    width: 1300,
    height: 1300,
    left: 320,
    top: 110,
  }
  const [images, setImages] = useState([] as BeamSpirit[])
  let isMoveable = false
  const canvas2dRef = useRef(null as HTMLCanvasElement)
  const canvas3dRef = useRef(null as HTMLCanvasElement)

  //}
  const maxLayout = (indexArray: number[], spirits: BeamSpirit[]) => {
    console.log(indexArray)
    let min = 2
    let maxIndex = -1
    for (let i = 0; i < indexArray.length; i++) {
      const j = indexArray[i]
      const element = spirits[j]
      const elementLayout = element.getLayout()
      if (elementLayout < min) {
        min = elementLayout
        maxIndex = j
      }
    }
    console.log('maxIndex:', maxIndex)
    return maxIndex
  }

  let curImage: number

  const handleOnMouseMove = (e: MouseEvent) => {
    if (!isMoveable || zoomable) return
    e.preventDefault()
    //canvas3dRef.current.style.cursor = 'move'
    const cursorPos = getCursorPosInCanvas(e, canvas) as Pos
    const result = getCursorIsInQuad(
      { x: cursorPos.left, y: cursorPos.top },
      images[selectNum].getGuidRect(),
    )
    if (result === 'out') return
    const distance = getCursorMovDistance(e, canvas)
    images[curImage].updatePosition(distance)
    spiritCanvas.updateGuidRect(images[curImage])
    //spiritCanvas.spirits[curImage].render()
    for (let i = 0; i < images.length; i++) {
      if (images[i] !== null) {
				images[i].render()
        if (curImage === i) {
          drawRectBorder(canvas2dRef.current, images[curImage].getGuidRect())
          //if (!zoomable && !isMoveable)
          //spiritCanvas.setChosenType(images[curImage].getSpiritType())
        }
      }
    }
    //spiritCanvas.renderAllLine()
  }
  const handleOnMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    const cursorPos = getCursorPosInCanvas(e, canvas) as Pos
    let indexArray: number[] = []
    for (let i = 0; i < images.length; i++) {
      if (images[i] !== null) {
        if (images[i].getIsToggle()) {
          const result = getCursorIsInQuad(
            { x: cursorPos.left, y: cursorPos.top },
            images[i].getGuidRect(),
          )
          if (result !== 'out') {
            indexArray.push(i)
          }
        }
      }
    }

    if (indexArray.length > 0) {
      const cur = maxLayout(indexArray, images)
      curImage = cur
      setSelectNum(curImage)
      spiritCanvas.setChosenType(images[curImage].getSpiritType())
      drawRectBorder(canvas2dRef.current, images[cur].getGuidRect())
      if (zoomable && images[curImage].getSpiritType() === 'Image') {
        const image = images[curImage] as ImageSpirit
        if (image.isZoomed) {
          canvas3dRef.current.style.cursor = 'zoom-in'
        } else {
          canvas3dRef.current.style.cursor = 'zoom-out'
        }
        image.zoom({ x: cursorPos.left, y: cursorPos.top })
        return
      }
      isMoveable = true
      //setIsMoveable(true)
      canvas3dRef.current.style.cursor = 'move'
    }
  }

  const thandleOnMouseUp = (e: MouseEvent) => {
    isMoveable = false
    if (!zoomable) canvas3dRef.current.style.cursor = 'default'
    renderImages()
  }
  //const handleOnMouseUp = (e: MouseEvent) => {
  //e.preventDefault()
  //if (preCursor !== undefined) {
  //const distance = getCursorMovDistance(preCursor, e, canvas)
  ////console.log(maxZOffset)
  ////images[curImage].zOffset = maxZOffset
  //images[curImage].updatePosition(distance)
  //spiritCanvas.updateGuidRect(
  //images[curImage].getGuidRect(),
  //images[curImage].getId(),
  //)
  //spiritCanvas.setChosenType(images[curImage].getSpiritType())
  //setSelectNum(curImage)
  ////setMaxZOffset(maxZOffset - 0.000001)
  //for (let i = 0; i < images.length; i++) {
  //if (images[i] !== null) {
  //images[i].render()
  //if (curImage === i) {
  //preCursor = e
  //drawRectBorder(canvas2dRef.current, images[i].getGuidRect())
  //if (!zoomable) canvas3dRef.current.style.cursor = 'default'
  //}
  //}
  //}
  //spiritCanvas.renderAllLine()
  //}
  //}
  const renderImages = () => {
    //spiritCanvas.renderBackground()
    for (const image of images) {
      if (image !== null) image.render()
    }
  }

  useEffect(() => {
    //the z position more big,the view more far
    spiritCanvas.setCanvas3d(canvas3dRef.current)
    spiritCanvas.spirits = images

    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
    //spiritCanvas.renderAllLine()
    console.log('appRef:', appRef.current)
    textRneder()
  }, [])
  useEffect(() => {
    if (zoomable) canvas3dRef.current.style.cursor = 'zoom-in'
    else canvas3dRef.current.style.cursor = 'default'
  }, [zoomable])
  useEffect(() => {
    console.log('canvas changed the selectNum')
  }, [selectNum])

  useEffect(() => {
    renderImages()
  }, [adjustNum, cmpCount])

  return (
    <div className="w-12/12 h-12/12">
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
        onMouseUp={thandleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        onMouseDown={handleOnMouseDown}
      />
    </div>
  )
}
