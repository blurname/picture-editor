import {MouseEvent, MutableRefObject} from "react"
import {mat4} from 'gl-matrix'

export const createRectangle = (offset: number) => {
  const basePosition = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0]
  const position = basePosition.map((pos) => pos * 0.3 + offset)
  // const position = pos.map((item) => {
  // 	if(item%3 ==2){
  // 		return item+offset
  // 	}else {
  // 		return item
  // 	}
  // })
  const texCoord = [0, 0, 0, 1, 1, 1, 1, 0]
  const index = {
    array: [0, 1, 2, 0, 2, 3],
  }
  return {
    vertex: {
      position,
      texCoord,
    },
    index,
  }
}
	const getCursorPos = (e:MouseEvent,canvasPos:CanvasPos):Pos => {
		return {
		left:e.pageX-canvasPos.left,
		top:e.pageY-canvasPos.top,
		}
	}
type Forward = 'left' | 'down'
export const getCursorPosInCanvas = (
	e:MouseEvent,
	canvasPos:CanvasPos
): Pos | 'outOfCanvas' => {
	const cursorPos = getCursorPos(e,canvasPos)
  const isOutsideHorizontal: boolean =
    cursorPos.left < 0 ? true : cursorPos.left > canvasPos.width ? true : false
  const isOutsideVeritcle: boolean =
    cursorPos.top < 0 ? true : cursorPos.top > canvasPos.height ? true : false
  if (isOutsideVeritcle || isOutsideHorizontal) return 'outOfCanvas'

  return {
    left: normalize2(cursorPos.left, canvasPos.width, 'left'),
    top: normalize2(cursorPos.top, canvasPos.height, 'down'),
  }
}
const normalize2 = (
  oneDimPos: number,
  edge: number,
  forward: Forward,
): number => {
  if (oneDimPos < edge / 2) {
    // console.log(edge)
    if (forward === 'left') return oneDimPos / (edge / 2) - 1
    else return -(oneDimPos / (edge / 2) - 1)
  } else {
    // console.log(edge)
    // console.log(oneDimPos - edge / 2)
    if (forward === 'left') {
      return (oneDimPos - edge / 2) / (edge / 2)
    } else {
      return -(oneDimPos - edge / 2) / (edge / 2)
    }
  }
}
type Exclude<T, U> = T extends U ? false : U

export const getCursorMovDistance = (
  pre: MouseEvent,
  cur: MouseEvent,
  canvas: CanvasPos,
): Pos => {
	console.log('pre:', pre)
  const prePos = getCursorPosInCanvas(pre, canvas) as Pos
  const curPos = getCursorPosInCanvas(cur, canvas) as Pos
  return { left: curPos.left - prePos.left, top: curPos.top - prePos.top }
}

type Point = { x: number; y: number }
export const getCursorIsInQuad = (
  cursorPos: Point,
  quad: number[],
): 'fir' | 'sec' | 'out' => {
  // leftdown->leftup->rightup->rightdown
  // a->b->c->d
  const a: Point = { x: quad[0], y: quad[1] }
  const b: Point = { x: quad[3], y: quad[4] }
  const c: Point = { x: quad[6], y: quad[7] }
  const d: Point = { x: quad[9], y: quad[10] }

  const firstTriangle = getIsInTriangle(cursorPos, a, b, c)
  if (firstTriangle) {
    return 'fir'
  } else {
    const secondTriangle = getIsInTriangle(cursorPos, c, d, a)
    if (secondTriangle) return 'sec'
    else return 'out'
  }
}
type Vec2 = {
  d1: number
  d2: number
}
const getCross = (v1: Vec2, v2: Vec2): number => {
  // pa * pb
  // crossProduct: x1y2-y1x2
  return v1.d1 * v2.d2 - v2.d1 * v1.d2
}
const getIsInTriangle = (p: Point, a: Point, b: Point, c: Point) => {
  const pa: Vec2 = { d1: p.x - a.x, d2: p.y - a.y }
  const pb: Vec2 = { d1: p.x - b.x, d2: p.y - b.y }
  const pc: Vec2 = { d1: p.x - c.x, d2: p.y - c.y }
  const pabNormalDir = getCross(pa, pb)
  const pbcNormalDir = getCross(pb, pc)
  const pcaNormalDir = getCross(pc, pa)

  return pabNormalDir <= 0 && pbcNormalDir <= 0 && pcaNormalDir <= 0
}

export const drawRectBorder = (
  canvas2dRef: HTMLCanvasElement,
  position: number[],
) => {
  const webglPosInCanvas = position.map((pos, index) => {
    const remainder = index % 3
    if (remainder === 0) return (pos * canvas2dRef.width) / 2
    // changing y to be negtive since the canvs2d's y positive axis is downward
    else if (remainder === 1) return -((pos * canvas2dRef.height) / 2)
    else return pos
  })

  const glPosInCanvas = {
    x: webglPosInCanvas[3],
    y: webglPosInCanvas[1],
    width: webglPosInCanvas[6] - webglPosInCanvas[3],
    height: webglPosInCanvas[4] - webglPosInCanvas[1],
  }

  const ctx = canvas2dRef.getContext('2d')
  ctx.clearRect(
    -canvas2dRef.width / 2,
    -canvas2dRef.height / 2,
    canvas2dRef.width,
    canvas2dRef.height,
  )
  ctx.strokeStyle = 'purple'
  ctx.strokeRect(
    glPosInCanvas.x,
    glPosInCanvas.y,
    glPosInCanvas.width,
    glPosInCanvas.height,
  )
}

export const createTranslateMat = (tx: number, ty: number) => {
  return [1, 0, 0, 0, 
		0, 1, 0, 0,
		0, 0, 1, 0,
		tx, ty, 0, 1]
}

export const createRotateMat = (rotate: number) => {
  rotate = (rotate * Math.PI) / 180
  const cos = Math.cos(rotate)
  const sin = Math.sin(rotate)
  return [cos, sin, 0, 0,
		-sin, cos, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1]
}

export const createScaleMat = (sx: number, sy: number) => {
  return [sx, 0, 0, 0,
		0, sy, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1]
}
