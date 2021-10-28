import { Button } from 'antd'
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
  CircleSpirit,
  ImageSpirit,
  MosaicSpirit,
  TheW,
} from '../../utils/gl-uitls'
import { getIsHavingSpirits, getSpirits } from '../../utils/http'
import { textRneder } from '../../utils/textRender'

type Props = {}
type remoteModel = {
  id: number
  canvas_id: number
  canvas_spirit_id: number
  spirit_type: string
  model: string
}

export function Canvas(props: Props) {
  const {
    spiritCanvas,
    selectNum,
    setSelectNum,
    adjustNum,
    setAdjustNum,
    cmpCount,
    zoomable,
    operationHistory,
  } = useContext(globalContext)
  let canvas: CanvasPos = {
    width: 1300,
    height: 1300,
    left: 320,
    top: 110,
  }
  const [images, setImages] = useState([] as BeamSpirit[])
  const [initCount, setInitCount] = useState(-1)
  const [initImages, setInitImages] = useState([] as remoteModel[])

  //const [oldPos, setOldPos] = useState({} as Pos);
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
  let oldPos: Pos

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
      oldPos = images[curImage].getPos()
      canvas3dRef.current.style.cursor = 'move'
    }
  }

  const thandleOnMouseUp = (e: MouseEvent) => {
    isMoveable = false
    console.log('oldPos:', oldPos)
    if (oldPos !== undefined) {
      const spirit = spiritCanvas.spirits[curImage]
      operationHistory.commit(
        spirit.getModel(),
        { trans: oldPos },
        { trans: spirit.getModel().trans },
      )
      console.log(spiritCanvas.spirits[curImage])
      console.log('spirit.getModel():', spirit.getModel())
    }
    console.log('operationHistory.lens:', operationHistory.lens)
    //operationHistory.commit(s, from, wto)
    if (!zoomable) canvas3dRef.current.style.cursor = 'default'
    renderImages()
    setAdjustNum(adjustNum + 1)
  }
  const renderImages = () => {
    //spiritCanvas.renderBackground()
    for (const image of images) {
      if (image !== null) image.render()
    }
  }
  const handleBack = () => {
    operationHistory.undo()
    renderImages()
    setAdjustNum(adjustNum + 1)
  }
  const handleNext = () => {
    operationHistory.redo()
    renderImages()
    setAdjustNum(adjustNum + 1)
  }
  //console.log('operationHistory.tail:', operationHistory.tail)
  //console.log('operationHistory.lens:', operationHistory.lens)

  useEffect(() => {
    //the z position more big,the view more far

    spiritCanvas?.setCanvas3d(canvas3dRef.current)
    spiritCanvas.spirits = images
    const getCount = async () => {
      const count = await getIsHavingSpirits(spiritCanvas.id)
      setInitCount(count)
    }
    getCount()
    //console.log("incanvas:"+spiritCanvas.id)

    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
    //textRneder()
  }, [])
  useEffect(() => {
    const getInit = async () => {
      const init = await getSpirits(spiritCanvas.id)
      setInitImages(init)
    }
    if (initCount > 0) {
      getInit()
    }
  }, [initCount])
  useEffect(() => {
    if (initImages.length > 0) {
      console.log(JSON.parse(initImages[0].model))
    }
  }, [initImages])
  useEffect(() => {
    if (zoomable) canvas3dRef.current.style.cursor = 'zoom-in'
    else canvas3dRef.current.style.cursor = 'default'
  }, [zoomable])
  useEffect(() => {
    console.log('canvas changed the selectNum')
  }, [selectNum])

  useEffect(() => {
    renderImages()
    console.log('reanderAll')
  }, [adjustNum, cmpCount])

  return (
    <div className="w-12/12 h-12/12">
      <Button onClick={handleBack} disabled={!(operationHistory.tail > 0)}>
        undo
      </Button>
      <Button
        onClick={handleNext}
        disabled={!(operationHistory.tail < operationHistory.lens)}
      >
        redo
      </Button>
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
