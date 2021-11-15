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
interface GuidRect extends Rect {
  id: number
}
interface Model {
  id: number
  trans: Pos
  scale: number
  rotate: number
  layer: number
}

type ImageProps = {
  id: number
  hue: number
  saturation: number
  brightness: number
  contrast: number
  vignette: number
}
type MarkProps = {
  id: number
  uColor: number[]
}
type CircleProps = MarkProps & {
  radius: number
}
type BackgroundProps = MarkProps& {

}
type UniqueProps = MarkProps | ImageProps | CircleProps | BackgroundProps

type Mosaic = Model
type Shape = 'line' | 'hollowRect' | 'circle' | 'theW'
type SpiritType = 'Image' | 'Mark' | 'Mosaic'|'Background'|'BackNonImage'|'BackImage'
type MosaicType = 'multi' | 'frac'
type Point = { x: number; y: number }

type SpiritsAction = UniqueProps | Model
type SpiritsActionLiteral = 'UniqueProps' | 'Model'
type UniquePropsLiteral = 'ImagePorps' | 'MarkProps'
