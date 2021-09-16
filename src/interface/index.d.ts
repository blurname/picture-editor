interface Cmp {
  id: number
  width: number
  height: number
  posX: number
  posY: number
  value: string
  image: HTMLImageElement | undefined
}
interface Rect {
	// x and y are in bottom left 
  x: number
  y: number

  width: number
  height: number
}
interface Pos {
  left: number
  top: number
}
interface CanvasPos extends Pos {
  width: number
  height: number
}
