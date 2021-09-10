import React, {
  DragEvent,
  MouseEvent,
  MutableRefObject,
  Ref,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { globalContext } from '../../context'
import {
  createRectangle,
  drawRectBorder,
  getCursorIsInQuad,
  getCursorMovDistance,
  getCursorPosInCanvas,
} from '../../utils/geo-utils'
import { BeamSpirit } from '../../utils/gl-uitls'

type Props = {
  canvasParentRef: MutableRefObject<HTMLDivElement>
}

export function Canvas(props: Props) {
  const { spiritCanvas, selectNum, setSelectNum, adjustNum, cmpCount } =
    useContext(globalContext)
  let curScrollTop = 0
  const { canvasParentRef } = props
  let canvas: CanvasPos = {
    width: 1100,
    height: 890,
    left: 0,
    top: 0,
  }
  const handleScroll = (e: any) => {
    let scrollTop = document.documentElement.scrollTop
    //curScrollTop = scrollTop
    console.log(`scrollTop${scrollTop}`)
  }
  const [images, setImages] = useState([] as BeamSpirit[])
  let upNum = 0

  const [maxZOffset, setMaxZOffset] = useState(1)

  const canvas2dRef = useRef(null as HTMLCanvasElement)
  const canvas3dRef = useRef(null as HTMLCanvasElement)
  const handleOnMouseMove = (e: MouseEvent) => {
    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
    //console.log('scroll: ' + curScrollTop)
    //console.log(
    //`left:${cursor.left - canvas.left},top:${cursor.top - canvas.top}`,
    //)
    //console.log(`offseLeft:${canvas3dRef.current.offsetLeft}`)
    //console.log(`offsetTop${canvas3dRef.current.offsetTop}`)
    //console.log(`offseLeft:${canvasParentRef.current.offsetLeft}`)
    //console.log(`offsetTop${canvasParentRef.current.offsetTop}`)
    //canvas3dRef.current.offsetLeft
    //console.log(getCursorPosInCanvas(cursor,canvas))
		console.log(getCursorPosInCanvas(cursor,canvas))
  }
  const handleOnMouseClick = (e: MouseEvent) => {
    Object.keys(canvas).map((key) => {
      console.log(canvas[key])
    })

    const cursor: Pos = {
      left: e.clientX,
      top: e.clientY,
    }
		console.log(getCursorPosInCanvas(cursor,canvas))
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
    const image2 = new Image()
    image2.src = '../../../public/t2.jpg'
    const pic2 = new BeamSpirit(canvas3dRef.current, image2)
    images.push(pic2)

    //canvas.left = canvas3dRef.current.clien
    canvas.top = canvasParentRef.current.offsetTop
    canvas.left = canvasParentRef.current.offsetLeft

    console.log('parentref:width' + canvasParentRef.current.offsetLeft)
    console.log('parentref:height' + canvasParentRef.current.offsetTop)

    console.log('ref:width' + canvas3dRef.current.clientWidth)
    console.log('ref:height' + canvas3dRef.current.clientHeight)

    const ctx = canvas2dRef.current.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
  }, [])

  //useEffect(() => {
  //window.addEventListener('scroll', handleScroll)
  //return () => {
  //window.removeEventListener('scroll', handleScroll)
  //}
  //},[])
  //useEffect(() => {
  //console.log('afterChage ref:width' + canvas3dRef.current.clientWidth)
  //console.log('afterChage ref:height' + canvas3dRef.current.clientHeight)
  //canvas.height = canvas3dRef.current.clientHeight
  //canvas.width = canvas3dRef.current.clientWidth
  //}, [canvas.height, canvas.width])
  useEffect(() => {
    renderImages()
  }, [adjustNum, cmpCount])

  return (
    <div style={{}} className="w-12/12 h-12/12">
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
