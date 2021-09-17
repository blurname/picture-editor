import {Beam} from 'beam-gl'
import {
  BeamSpirit,
  GuidLine,
  ImageSpirit,
  MarkSpirit,
} from '../utils/gl-uitls'

type Shape = 'line' | 'hollowRect'
export class SpiritsCanvas {
  spirits: BeamSpirit[]
  curSpirit: ImageSpirit | null
  canvas3d: HTMLCanvasElement
  canvas2d: HTMLCanvasElement
  //guidRects: GuidRect[]
  guidLines: GuidLine[]
	beamClener:Beam
  constructor() {
    this.spirits = []
		this.guidLines =[]
    this.curSpirit = null
  }
  addImage(imgSrc: string, id: number) {
    const image = new Image()
    image.src = imgSrc
    const spirit = new ImageSpirit(this.canvas3d, image, id)
    this.spirits.push(spirit)
		this.guidLines.push(new GuidLine(this.canvas3d,spirit.getGuidRect(),spirit.getId()))
  }
  addMark(shape: Shape, id: number) {
		const mark = new MarkSpirit(this.canvas3d, shape, id)
    this.spirits.push(mark)
		this.guidLines.push(new GuidLine(this.canvas3d,mark.getGuidRect(),mark.getId()))
  }

  setCanvas3d(canvas: HTMLCanvasElement) {
    this.canvas3d = canvas
		this.beamClener = new Beam(this.canvas3d)
  }
  updateGuidRect(rect: Rect, id: number) {
    for (let index = 0; index < this.guidLines.length; index++) {
      if (this.guidLines[index].getId() === id){
        this.guidLines[index].updateRect(rect)
				break;
			}
    }
  }
  renderAllLine() {
		//this.beamClener.clear()
    for (let index = 0; index < this.guidLines.length; index++) {
      this.guidLines[index].render()
		console.log('renderLine:'+index)
    }
  }
}
export const spiritCanvas = new SpiritsCanvas()
