import { BeamSpirit, ImageSpirit, MarkSpirit } from '../utils/gl-uitls'

type Shape = 'line' | 'hollowRect'
export class SpiritsCanvas {
  spirits: BeamSpirit[]
  curSpirit: ImageSpirit | null
  canvas3d: HTMLCanvasElement
  canvas2d: HTMLCanvasElement
  constructor() {
    this.spirits = []
    this.curSpirit = null
  }
  addImage(imgSrc: string) {
    const image = new Image()
    image.src = imgSrc
    const spirit = new ImageSpirit(this.canvas3d, image)
    this.spirits.push(spirit)
    console.log('add new')
  }
  addMark(shape: Shape) {
    this.spirits.push(new MarkSpirit(this.canvas3d, shape))
  }

  setCanvas3d(canvas: HTMLCanvasElement) {
    this.canvas3d = canvas
  }
	addGuidLine(beamSpirit:BeamSpirit){


	}
}
export const spiritCanvas = new SpiritsCanvas()

export class Layout {
  rootNodes: number[]
}
