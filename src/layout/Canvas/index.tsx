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
        drawRectBorder(canvas2dRef.current, images[selectId].getGuidRect())
        drawNames(canvas2dRef.current, images[selectId].getGuidRect(), {
          id: controllerList[i].id,
          name: 'baolei',
        })
        //if (!zoomable && !isMoveable)
        //spiritCanvas.setChosenType(images[curImage].getSpiritType())
      }
    }
  }, [controllerList, canvas2dRef])
  useMovement(socket, images, spiritCanvas, renderController)

  const maxLayer = (indexArray: number[], spirits: BeamSpirit[]) => {
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
    return maxIndex
  }

  let curImage: number
  let oldPos: Pos

  const handleOnMouseMove = (e: MouseEvent) => {
    //const distance0 = getCursorMovDistance(e, canvas)
    //console.log(distance0)
    handlePainting(e)
    if (curImage === 0 || !isMoveable || zoomable) return
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
    socket.emit('server-move', spiritCanvas.id, curImage, distance)
    //spiritCanvas.spirits[curImage].render()
    //renderAll()
    for (let i = 0; i < images.length; i++) {
      if (images[i] !== null) {
        images[i].render()
        ////if (!zoomable && !isMoveable)
        ////spiritCanvas.setChosenType(images[curImage].getSpiritType())
        //}
      }
    }
    renderController()
    spiritCanvas.renderAllLine()
  }

  const handleOnMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    startPainting()
    const controllSet = new Set()
    for (let i = 0; i < controllerList.length; i++) {
      controllSet.add(controllerList[i].spiritId)
    }
    const cursorPos = getCursorPosInCanvas(e, canvas) as Pos

    //choose spirit in the top level from same area
    let indexArray: number[] = []
    for (let i = 0; i < images.length; i++) {
      if (images[i] !== null) {
        if (
          (!controllSet.has(i) || selectNum === i) &&
          images[i].getIsToggle()
        ) {
          const result = getCursorIsInQuad(
            { x: cursorPos.left, y: cursorPos.top },
            images[i].getGuidRect(),
          )
          console.log('handledown',i,images[i].getGuidRect())
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
      renderController()
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
    } else {
      setSelectNum(0)
      spiritCanvas.setChosenType(images[0].getSpiritType())
    }
  }

  const thandleOnMouseUp = (e: MouseEvent) => {
    endPainting()
    isMoveable = false
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
  id:number
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
          id:img.id,
          spiritType: img.spirit_type,
          model: JSON.parse(img.model),
          element: img.element,
          uniqueProps: JSON.parse(img.unique_props),
        }
      })
      console.log('models:', models)
      models.forEach(async (model) => {
      // for special spirit
      if(model.spiritType===6){
      const points = await getPoints(model.id)
      const pointSpirits = points.map((point) => (
new PointSpirit(canvas3dRef.current, point)
      ))
      console.log({points})
        spiritCanvas.updateFromRemote(
          model.spiritType,
          model.model,
          pointSpirits as any,
          model.uniqueProps,
        )
      }else{
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
      console.log('addBackground')
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
    console.log('canvas changed the selectNum')
    renderController()
  }, [selectNum, controllerList])

  useEffect(() => {
    renderAll()
  }, [adjustNum, cmpCount])
  const closeSockt = () => {
    canvasSocket.exit()
    //navigate('/usercenter/')
  }
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    ax.post(`/user/invite/?name=${invitedName}`)
    setIsModalVisible(false)
    setInvitedName('')
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const [invitedName, setInvitedName] = useState('')
  const handleInputName = (e: ChangeEvent<HTMLInputElement>) => {
    setInvitedName(e.target.value)
  }
  const [isModalVisible, setIsModalVisible] = useState(false)

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
    console.log('start painting')
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
    if(points.length>0){
      const lastPoint = points[points.length-1]
      if(pos.left< lastPoint.offset.left+15 && pos.left > lastPoint.offset.left-15 )
        return
      if(pos.top< lastPoint.offset.top+15 && pos.top > lastPoint.offset.top-15 )
        return
    }

    renderAll()
    points = [...points, new PointSpirit(canvas3dRef.current, pos)]
    calcRange(pos)

    points.forEach((point) => { point.render() })

    // console.log(points)
  }
  const endPainting = async () => {
    if (painting) {
      setPainting(false)
    const width = Math.abs(L - R) 
    const height= Math.abs(T - D) 
    const left = L
    const top = D
      spiritCanvas.addPointContainer(points,cmpCount,false,{width,height,left,top} )
      setTimeout(()=>{

      operationHistory.updateRemote(cmpCount, 'UniqueProps')
      },100)
      console.log(spiritCanvas.guidLines)
      setCmpCount(cmpCount + 1)
      // const pointSpirits = points.map((point)=>)
      console.log('end painting', points)
      console.log(T, L, D, R)
      return
    }
  }

  return (
    <div className="flex-grow w-max h-full bg-gray-100">
      {/*{users.map((cur, index) => {*/}
        {/*return <h1 key={index}>{cur.name}</h1>*/}
      {/*})}*/}
      {/*<h1>cmpcount{cmpCount}</h1>*/}
      <Button onClick={handlePating}>pating</Button>
      <Button onClick={closeSockt}>back home</Button>
      <Button onClick={showModal}>invite</Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          defaultValue={invitedName}
          onInput={handleInputName}
          type="text"
        />
      </Modal>
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
        <ChatRoom socket={socket} canvasId={spiritCanvas.id}/>
      </div>
    </div>
  )
}
