import { Button, Input, Modal } from 'antd'
import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { globalContext, userContext } from '../../context'
import {
  clearRectBorder,
  drawNames,
  drawRectBorder,
  getCursorIsInQuad,
  getCursorMovDistance,
  getCursorPosInCanvas,
} from '../../utils/geo-utils'
import { ChatRoom } from '../ChatRoom'

import {
  BackgroundSpirit,
  BeamSpirit,
  CircleSpirit,
  ImageSpirit,
  MosaicSpirit,
  PointSpirit,
  TheW,
} from '../../utils/gl-uitls'
import {
  ax,
  baseUrl,
  getIsHavingSpirits,
  getPoints,
  getSpirits,
  wsbaseUrl,
} from '../../utils/http'
import { screenshot } from '../../utils/saveImage'
import { useRenderAll } from '../../hooks/useRenderAll'
import { useController } from '../../hooks/useEmitControll'
import { CanvasScoekt } from '../../utils/socket-utils'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../../hooks/useUsers'
import { useMovement } from '../../hooks/useMovement'
import { InviteModal } from './InviteModal'
import { UploadButton } from './UploadButton'

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
export const getCurrentSpirit = (spiritId: number, spirits: BeamSpirit[]) => {
  return spirits.find((spirit) => spirit.getId() === spiritId)
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
    socket,
    isPainting,
    setIsPainting
  } = useContext(globalContext)
  const { userId } = useContext(userContext)
  const navigate = useNavigate()
  let canvas: CanvasPos = {
    width: 1300,
    height: 900,
    left: 300,
    top: 150,
  }
  const canvas2dRef = useRef(null as HTMLCanvasElement)
  const canvas3dRef = useRef(null as HTMLCanvasElement)
  const [images, setImages] = useState([] as BeamSpirit[])
  const [initCount, setInitCount] = useState(-1)
  const [initImages, setInitImages] = useState([] as remoteModel[])
  const [initComplete, setInitComplete] = useState(false)
  const [localInit, setLocalInit] = useState(false)
  const [renderAll] = useRenderAll(spiritCanvas.spirits, cmpCount)
  //const socket = useSocket(wsbaseUrl, spiritCanvas.id, userId)
  const [canvasSocket] = useState(
    new CanvasScoekt(userId, spiritCanvas.id, socket),
  )
  //canvasSocket.onConnection()
  const { controllerList } = useController(
    socket,
    spiritCanvas.id,
    userId,
    selectNum,
    canvas2dRef,
    images,
  )
  const { users } = useUsers(socket, adjustNum)

  let isMoveable = false

  const renderController = useCallback(() => {
    clearRectBorder(canvas2dRef.current)
    for (let i = 0; i < controllerList.length; i++) {
      const selectId = controllerList[i].spiritId
      if (selectId !== -1 && selectId !== 0) {
        // if(global[selectId]!==null){
        const currentSpirit = getCurrentSpirit(selectId, spiritCanvas.spirits)
        if(currentSpirit){
          drawRectBorder(canvas2dRef.current, currentSpirit.getGuidRect())
          drawNames(canvas2dRef.current, currentSpirit.getGuidRect(), {
            id: controllerList[i].id,
            name: 'baolei',
          })
        }
        
        //if (!zoomable && !isMoveable)
        //spiritCanvas.setChosenType(images[curImage].getSpiritType())
        // }

      }
    }
    // spiritCanvas.spirits.forEach(()=>{

    // })
  }, [controllerList, canvas2dRef, spiritCanvas.spirits])
  useMovement(socket, spiritCanvas.spirits, spiritCanvas, renderController)

  let curSpiritId: number
  let oldPos: Pos

  

  const handleOnMouseMove = (e: MouseEvent) => {
    handlePainting(e)
    if (curSpiritId === 0 || !isMoveable || zoomable) return
    e.preventDefault()
    canvas2dRef.current.style.cursor = 'move'
    const distance = getCursorMovDistance(e, canvas)
    const currentSpirit = getCurrentSpirit(curSpiritId, spiritCanvas.spirits)

    currentSpirit.updatePosition(distance)
    spiritCanvas.updateGuidRect(currentSpirit)

    socket.emit('server-move', spiritCanvas.id, curSpiritId, distance)
    spiritCanvas.spirits.forEach((spirit) => spirit.render())


    renderController()
    spiritCanvas.renderAllLine()
  }


  const maxLayer = (indexArray: number[], spirits: BeamSpirit[]) => {
    let min = 2
    let maxIndex = -1
    indexArray.forEach((spiritId) => {
      console.log()
      const layer = getCurrentSpirit(spiritId, spirits).getlayer()
      if (layer < min) {
        min = layer
        maxIndex = spiritId
      }
    })

    return maxIndex
  }

  const handleOnMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    startPainting()
    const controllSet = new Set()

    controllerList.forEach((controller) => { controllSet.add(controller.spiritId) })

    const cursorPos = getCursorPosInCanvas(e, canvas) as Pos

    //choose spirit in the top level from same area

    let indexArray: number[] = []
    console.log(spiritCanvas.spirits)
    spiritCanvas.spirits.forEach((spirit) => {
      const spiritId = spirit.getId()
      if ((!controllSet.has(spiritId) || selectNum === spiritId) && spirit.getIsToggle()) {
        const result = getCursorIsInQuad(
          { x: cursorPos.left, y: cursorPos.top },
          spirit.getGuidRect(),
        )
        if (result !== 'out') {
          indexArray.push(spiritId)
        }
      }
    })
    console.log(indexArray)
    if (indexArray.length > 0) {
      const maxLayerSpiritId = maxLayer(indexArray, spiritCanvas.spirits)
      curSpiritId = maxLayerSpiritId
      // debugger
      setSelectNum(curSpiritId)
      const curSpirit = getCurrentSpirit(curSpiritId, spiritCanvas.spirits)

      spiritCanvas.setChosenType(curSpirit.getSpiritType())
      renderController()

      if (zoomable && curSpirit.getSpiritType() === 'Image') {
        const image = curSpirit as ImageSpirit
        canvas2dRef.current.style.cursor = `zoom-${image.isZoomed ? 'in' : 'out'}`
        image.zoom({ x: cursorPos.left, y: cursorPos.top })
        return
      }
      isMoveable = true
      oldPos = curSpirit.getPos()
      canvas2dRef.current.style.cursor = 'move'
    } else {
      setSelectNum(0)
      spiritCanvas.setChosenType(spiritCanvas.spirits[0].getSpiritType())
    }
  }

  const thandleOnMouseUp = (e: MouseEvent) => {
    endPainting()
    isMoveable = false
    if (oldPos !== undefined) {
      const spirit = getCurrentSpirit(curSpiritId, spiritCanvas.spirits)
      operationHistory.commit(
        spirit.getModel(),
        { trans: oldPos },
        { trans: spirit.getModel().trans },
        'Model',
      )
    }
    //operationHistory.commit(s, from, wto)
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

    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
    //textRneder()
  }, [])

  //there if has existed
  useEffect(() => {
    const getInit = async () => {
      const init = (await getSpirits(spiritCanvas.id)) as remoteModel[]
      const sorted = init.sort((a, b) => a.canvas_spirit_id - b.canvas_spirit_id)
      console.log('sorted',sorted)
      setInitImages(sorted)
      setCmpCount(sorted[sorted.length - 1].canvas_spirit_id + 1)
    }
    if (initCount > 0) {
      getInit()
    }
  }, [initCount])

  type CModel = {
    id: number
    spiritType: number
    model: Model
    element: Shape | string
    uniqueProps: Partial<UniqueProps>
  }
  useEffect(() => {
    if (initImages.length > 0) {
      const models: CModel[] = initImages.map((img) => {
        return {
          id: img.id,
          spiritType: img.spirit_type,
          model: JSON.parse(img.model),
          element: img.element,
          uniqueProps: JSON.parse(img.unique_props),
        }
      })
      models.forEach(async (model) => {
        // for special spirit
        if (model.spiritType === 6) {
          const points = await getPoints(model.id)
          const pointSpirits = points.map((point) => (new PointSpirit(canvas3dRef.current, point)))
          console.log({ points })
          spiritCanvas.updateFromRemote(
            model.spiritType,
            model.model,
            pointSpirits as any,
            model.uniqueProps,
          )
        } else {
          spiritCanvas.updateFromRemote(
            model.spiritType,
            model.model,
            model.element,
            model.uniqueProps,
          )
        }
      })
      setTimeout(() => {
        renderAll()
      }, 1000)
    } else {
    }
  }, [initImages])
  useEffect(() => {
    if (localInit) {
      spiritCanvas.addBackground('pure', 'backNonImage')
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
    renderController()
  }, [selectNum, controllerList])

  useEffect(() => {
    renderAll()
  }, [adjustNum, cmpCount])
  const closeSockt = () => {
    canvasSocket.exit()
    //navigate('/usercenter/')
  }


  let points = [] as PointSpirit[]
  //painting
  let [T, L, D, R] = [-10000, 10000, 10000, -10000]
  const [painting, setPainting] = useState(false)
  const handlePating = () => {
    setIsPainting(!isPainting)
  }
  useEffect(() => {
    if (isPainting) canvas2dRef.current.style.cursor = 'crosshair'
    else canvas2dRef.current.style.cursor = 'default'
  }, [isPainting])

  const startPainting = () => {
    if (!isPainting) return
    points = []
    setPainting(true)
  }
  const calcRange = (pos: Pos) => {
    if (pos.top > T) T = pos.top
    if (pos.left < L) L = pos.left
    if (pos.top < D) D = pos.top
    if (pos.left > R) R = pos.left
  }
  const handlePainting = (e: MouseEvent) => {
    if (!painting) return
    const pos = getCursorPosInCanvas(e, canvas)
    if (pos === 'outOfCanvas') return
    if (points.length > 0) {
      const lastPoint = points[points.length - 1]
      if (pos.left < lastPoint.offset.left + 15 && pos.left > lastPoint.offset.left - 15)
        return
      if (pos.top < lastPoint.offset.top + 15 && pos.top > lastPoint.offset.top - 15)
        return
    }

    renderAll()
    points = [...points, new PointSpirit(canvas3dRef.current, pos)]
    calcRange(pos)

    points.forEach((point) => { point.render() })
  }
  const endPainting = async () => {
    if (painting) {
      setPainting(false)
      const width = Math.abs(L - R)
      const height = Math.abs(T - D)
      const left = L
      const top = D
      
      spiritCanvas.addPointContainer(points, cmpCount, false, { width, height, left, top })
      setTimeout(() => {
        operationHistory.updateRemote(cmpCount, 'UniqueProps')
      }, 100);
      setTimeout(async () => {
        console.log(cmpCount)
      const res = await ax.get(`/canvas/get_single_point_container/?canvas_id=${spiritCanvas.id}&canvas_spirit_id=${cmpCount}>`)
      
      console.log('model res',res)
      const model = res.data[0]
      // debugger
      console.log('model',model)
      const id = model.id
      const canvasId = spiritCanvas.id
      socket.emit('server-add-pointcontainer',canvasId, id)
      }, 300)
      
      setCmpCount(cmpCount + 1)
      return
    }
  }
  useEffect(() => {
    socket.on('client-add-pointcontainer', async (id: number) => {
      console.log('point add id',id)
      // debugger
      //todo
      // cosnt await ax.get(`/canvas/get_single_point_container/?canvas_id=${spiritCanvas.id}&canvas_spirit_id=${cmpCount}>`)
      // const model 
        const res = await ax.get(`/canvas/get_single_spirit/?spirit_id=${id}`)
        const modelc: any = res.data[0]
        const model: CModel = {
            id: modelc.id,
            spiritType: modelc.spirit_type,
            model: JSON.parse(modelc.model),
            element: modelc.element,
            uniqueProps: JSON.parse(modelc.unique_props),
          }
        console.log('aa',model)
        const points = await getPoints(id)
          const pointSpirits = points.map((point) => (new PointSpirit(spiritCanvas.canvas3d, point)))
          console.log('aa',points)
          spiritCanvas.updateFromRemote(
            6,
            model.model,
            pointSpirits as any,
            model.uniqueProps,
          )
          // setTimeout(() => {
          //   renderAll()
          // }, 1000)
      setCmpCount(id + 1)
      setAdjustNum(adjustNum + 1)
    })
  }, [])

  return (
    <div className="flex-grow w-max h-full bg-gray-100">
      {/*{users.map((cur, index) => {*/}
      {/*return <h1 key={index}>{cur.name}</h1>*/}
      {/*})}*/}
      {/*<h1>cmpcount{cmpCount}</h1>*/}
      <Button onClick={handlePating}>pating</Button>
      <Button onClick={closeSockt}>back home</Button>

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
      <InviteModal ax={ax} userId={userId} canvasId={spiritCanvas.id} />
      <UploadButton ax={ax} userId={userId} socket={socket} />
      <canvas
        className=""
        ref={canvas2dRef}
        style={{
          top: canvas.top,
          left: canvas.left,
          position: 'absolute',
          zIndex: 2,
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
          zIndex: 1,
        }}
        width={canvas.width}
        height={canvas.height}
      />
      <div
        className=""
        style={{
          top: canvas.top,
          left: canvas.left + canvas.width + 30,
          position: 'absolute',
          zIndex: 1,
        }}
      >
        {controllerList.map((cur, index) => {
          return (
            <h1 key={index}>
              user:{cur.id} controlls {cur.spiritId}
            </h1>
          )
        })}
        <ChatRoom socket={socket} canvasId={spiritCanvas.id} />
      </div>
    </div>
  )
}
