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
  clearRectBorder,
  drawNames,
  drawRectBorder,
  getCursorIsInQuad,
  getCursorMovDistance,
  getCursorPosInCanvas,
} from '../../utils/geo-utils'

import {
  BackgroundSpirit,
  BeamSpirit,
  CircleSpirit,
  ImageSpirit,
  MosaicSpirit,
  TheW,
} from '../../utils/gl-uitls'
import { baseUrl, getIsHavingSpirits, getSpirits, wsbaseUrl } from '../../utils/http'
import { screenshot } from '../../utils/saveImage'
import { useRenderAll } from '../../hooks/useRenderAll'
import {useSocket} from '../../hooks/useSocket'

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
    left: 300,
    top: 150,
  }
  const [images, setImages] = useState([] as BeamSpirit[])
  const [initCount, setInitCount] = useState(-1)
  const [initImages, setInitImages] = useState([] as remoteModel[])
  const [initComplete, setInitComplete] = useState(false)
  const [localInit, setLocalInit] = useState(false)
  const [renderAll] = useRenderAll(spiritCanvas.spirits)
	//const socket = useSocket(wsbaseUrl,spiritCanvas.id,24)


  let isMoveable = false
  const canvas2dRef = useRef(null as HTMLCanvasElement)
  const canvas3dRef = useRef(null as HTMLCanvasElement)
	

  const maxLayer = (indexArray: number[], spirits: BeamSpirit[]) => {
    console.log(indexArray)
    let min = 2
    let maxIndex = -1
    for (let i = 0; i < indexArray.length; i++) {
      const j = indexArray[i]
      const element = spirits[j]
      const elementlayer = element.getlayer()
      if (elementlayer < min) {
        min = elementlayer
        maxIndex = j
      }
    }
    console.log('maxIndex:', maxIndex)
    return maxIndex
  }

  let curImage: number
  let oldPos: Pos

  const handleOnMouseMove = (e: MouseEvent) => {
    if (curImage===0 || !isMoveable || zoomable) return
    e.preventDefault()
    canvas2dRef.current.style.cursor = 'move'
    //const cursorPos = getCursorPosInCanvas(e, canvas) as Pos
    //const result = getCursorIsInQuad(
      //{ x: cursorPos.left, y: cursorPos.top },
      //images[selectNum].getGuidRect(),
    //)
    //if (result === 'out') return
    const distance = getCursorMovDistance(e, canvas)
    images[curImage].updatePosition(distance)
    spiritCanvas.updateGuidRect(images[curImage])
    //spiritCanvas.spirits[curImage].render()
    //renderAll()
    for (let i = 0; i < images.length; i++) {
      if (images[i] !== null) {
        images[i].render()
        if (curImage === i) {
          drawRectBorder(canvas2dRef.current, images[curImage].getGuidRect())
					drawNames(canvas2dRef.current,images[curImage].getGuidRect(),{id:31,name:'baolei'})
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
		//if(indexArray.length===1){
			//setSelectNum(0)
		//}
		 if (indexArray.length > 0) {
      const cur = maxLayer(indexArray, images)
      curImage = cur
      setSelectNum(curImage)
      spiritCanvas.setChosenType(images[curImage].getSpiritType())
      drawRectBorder(canvas2dRef.current, images[cur].getGuidRect())
			drawNames(canvas2dRef.current,images[curImage].getGuidRect(),{id:31,name:'baolei'})
      if (zoomable && images[curImage].getSpiritType() === 'Image') {
        const image = images[curImage] as ImageSpirit
        if (image.isZoomed) {
          canvas2dRef.current.style.cursor = 'zoom-in'
        } else {
          canvas2dRef.current.style.cursor = 'zoom-out'
        }
        image.zoom({ x: cursorPos.left, y: cursorPos.top })
        return
      }
      isMoveable = true
      //setIsMoveable(true)
      oldPos = images[curImage].getPos()
      canvas2dRef.current.style.cursor = 'move'
    }
		else{
		setSelectNum(0)
		spiritCanvas.setChosenType(images[0].getSpiritType())
		}
  }

  const thandleOnMouseUp = (e: MouseEvent) => {

    isMoveable = false
    //console.log('oldPos:', oldPos)
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
    //console.log('images.length:' + images.length)
    if (!zoomable) canvas2dRef.current.style.cursor = 'default'
    renderAll()
    setAdjustNum(adjustNum + 1)
  }
  const handleBack = () => {
    operationHistory.undo()
    renderAll()
    setAdjustNum(adjustNum + 1)
  }
  const handleNext = () => {
    operationHistory.redo()
    renderAll()
    setAdjustNum(adjustNum + 1)
  }
  // init canvas
  useEffect(() => {
    //the z position more big,the view more far

    spiritCanvas?.setCanvas3d(canvas3dRef.current)
    spiritCanvas.spirits = images
    const getCount = async () => {
      const count = await getIsHavingSpirits(spiritCanvas.id)
      if (count === 0) {
        setLocalInit(true)
      }
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
          uniqueProps: JSON.parse(img.unique_props),
        }
      })
      console.log('models:', models)
      for (let i = 0; i < models.length; i++) {
        spiritCanvas.updateFromRemote(
          models[i].spiritType,
          models[i].model,
          models[i].element,
          models[i].uniqueProps,
        )
      }
      setTimeout(() => {
        renderAll()
      }, 1000)
    } else {
      console.log('addBackground')
    }
  }, [initImages])
  useEffect(() => {
    if (localInit) {
			spiritCanvas.addBackground('pure','backNonImage')
			setCmpCount(cmpCount + 1)
    }
  }, [localInit])

  useEffect(() => {
    if (initComplete) {
      renderAll()
    }
  }, [initComplete])

  useEffect(() => {
    if (zoomable) canvas2dRef.current.style.cursor = 'zoom-in'
    else canvas2dRef.current.style.cursor = 'default'
  }, [zoomable])

  useEffect(() => {
    console.log('canvas changed the selectNum')
  }, [selectNum])

  useEffect(() => {
    renderAll()
  }, [adjustNum, cmpCount])

  return (
    <div className="flex-grow w-max h-full bg-blue-400">
      <h1>cmpcount{cmpCount}</h1>
      <Button onClick={screenshot(canvas3dRef.current, renderAll)}>
        screenshot
      </Button>
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
        className="bg-grey-100"
        ref={canvas2dRef}
        style={{
          top: canvas.top,
          left: canvas.left,
          position: 'absolute',
					zIndex:2
        }}
        width={canvas.width}
        height={canvas.height}
        onMouseUp={thandleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        onMouseDown={handleOnMouseDown}
      />
      <canvas
        className=""
        ref={canvas3dRef}
        style={{
          top: canvas.top,
          left: canvas.left,
          position: 'absolute',
					zIndex:1
        }}
        width={canvas.width}
        height={canvas.height}
      />
    </div>
  )
}
