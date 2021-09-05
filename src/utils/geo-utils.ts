export const createRectangle = (offset: number) => {
  const basePosition = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0]
  const position = basePosition.map((pos) => pos + offset)
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
    left: normalize2(curLeft, canvas.width,'left'),
    top: normalize2(curTop, canvas.height,'down'),
  }
}
const normalize2 = (
  oneDimPos: number,
  edge: number,
  forward: Forward,
): number => {
  if (oneDimPos < edge / 2) {
    console.log(edge)
		if(forward ==='left')
    return oneDimPos / (edge / 2) - 1
	else
    return -(oneDimPos / (edge / 2) - 1)
  } else {
    console.log(edge)
    console.log(oneDimPos - edge / 2)
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
console.log(getCursorPosInCanvas(cursor, canvas))
