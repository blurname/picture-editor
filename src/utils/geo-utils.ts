export const createRectangle = (offset: number) => {
  const basePosition = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0]
  const position = basePosition.map((pos) => pos * 0.3 + offset)
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
export interface Pos {
  left: number
  top: number
}
export interface CanvasPos extends Pos {
  width: number
  height: number
}
const cursor: Pos = {
  left: 1,
  top: 1231,
}
const canvas: CanvasPos = {
  left: 50,
  top: 153,
  width: 400,
  height: 400,
}

type Forward = 'left' | 'down'
export const getCursorPosInCanvas = (
  cursor: Pos,
  canvas: CanvasPos,
): Pos | 'outOfCanvas' => {
  const curLeft = cursor.left - canvas.left
  const curTop = cursor.top - canvas.top
  const isOutsideHorizontal: boolean =
    curLeft < 0 ? true : curLeft > canvas.width ? true : false
  const isOutsideVeritcle: boolean =
    curTop < 0 ? true : curTop > canvas.height ? true : false
  if (isOutsideVeritcle || isOutsideHorizontal) return 'outOfCanvas'
  const { widthRatio, heightRatio } = normallizeStandard(canvas)

  return {
    left: normalize2(curLeft, canvas.width, 'left'),
    top: normalize2(curTop, canvas.height, 'down'),
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
const normallizeStandard = (canvas: CanvasPos) => {
  const widthRatio = getBitLength(canvas.width)
  const heightRatio = getBitLength(canvas.height)
  return {
    widthRatio,
    heightRatio,
  }
}
const getBitLength = (num: number): number => {
  let bitLength = 1
  while (num !== 0) {
    bitLength *= 0.1
    num = Math.floor(num / 10)
  }
  return bitLength
}
// console.log(23432 * getBitLength(1234))
// console.log(getCursorPosInCanvas(cursor, canvas))

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
