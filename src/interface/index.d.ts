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
interface GuidRect extends Rect{
	id:number
}
type Shape = 'line' | 'hollowRect'|'circle'|'theW'
type SpiritType = 'Image'| 'Mark'|'Mosaic'
type MosaicType = 'multi'| 'fract'
type Point = { x: number; y: number }
