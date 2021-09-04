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
  width: 2415,
  height: 5321,
}

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
    left: curLeft * widthRatio,
    top: curTop * heightRatio,
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
