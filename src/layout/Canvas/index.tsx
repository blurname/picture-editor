import { Button } from 'antd'
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
  spirit_type: number
  model: string
  element: Shape | string
  unique_props: string
}

export function Canvas(props: Props) {
  const {
    spiritCanvas,
    selectNum,
    setSelectNum,
    adjustNum,
    setAdjustNum,
    cmpCount,
    setCmpCount,
    zoomable,
    operationHistory,
  } = useContext(globalContext)
  let canvas: CanvasPos = {
    width: 1300,
    height: 900,
    left: 320,
    top: 110,
  }
  const [images, setImages] = useState([] as BeamSpirit[])
  const [initCount, setInitCount] = useState(-1)
  const [initImages, setInitImages] = useState([] as remoteModel[])
  const [initComplete, setInitComplete] = useState(false)

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
		spiritCanvas.renderAllLine()
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
        'Model',
      )
    }
    //operationHistory.commit(s, from, wto)
    console.log('images.length:' + images.length)
    if (!zoomable) canvas3dRef.current.style.cursor = 'default'
    renderImages()
    setAdjustNum(adjustNum + 1)
  }
  const renderImages = () => {
    //spiritCanvas.renderBackground()
    console.log(spiritCanvas.spirits)
    for (const image of images) {
      if (image) image.render()
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
  // init canvas
  useEffect(() => {
    //the z position more big,the view more far

    spiritCanvas?.setCanvas3d(canvas3dRef.current)
    spiritCanvas.spirits = images
    const getCount = async () => {
      const count = await getIsHavingSpirits(spiritCanvas.id)
      setInitCount(count)
    }
    getCount()
    console.log('incanvas:' + spiritCanvas.id)

    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
    //textRneder()
  }, [])

  //there if has existed
  useEffect(() => {
    const getInit = async () => {
      const init = (await getSpirits(spiritCanvas.id)) as remoteModel[]
      const sorted = init.sort((a, b) => a.id - b.id)
      console.log('sorted:', sorted)
      setInitImages(sorted)
    }
    if (initCount > 0) {
      getInit()
      setCmpCount(initCount)
    }
  }, [initCount])

  type CModel = {
    spiritType: number
    model: Model
    element: Shape | string
    uniqueProps: Partial<UniqueProps>
  }
  useEffect(() => {
    if (initImages.length > 0) {
      console.log('initImages:', initImages)
      const models: CModel[] = initImages.map((img) => {
        return {
          spiritType: img.spirit_type,
          model: JSON.parse(img.model),
          element: img.element,
          uniqueProps: JSON.parse(img.unique_props)
        }
      })
      console.log('models:', models)
      for (let i = 0; i < models.length; i++) {
        spiritCanvas.updateFromRemote(
          models[i].spiritType,
          models[i].model,
          models[i].element,
					models[i].uniqueProps
        )
      }
      setTimeout(() => {
        renderImages()
      }, 500)
    }
  }, [initImages])

  useEffect(() => {
    if (initComplete) {
      renderImages()
    }
  }, [initComplete])

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
    <div className="flex-grow w-max h-full bg-blue-400">
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
