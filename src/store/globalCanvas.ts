import { Beam } from 'beam-gl'
import {
  BeamSpirit,
  CircleSpirit,
  GuidLine,
  ImageSpirit,
  MarkSpirit,
} from '../utils/gl-uitls'

export class SpiritsCanvas {
  spirits: BeamSpirit[]
  curSpirit: ImageSpirit | null
  canvas3d: HTMLCanvasElement
  canvas2d: HTMLCanvasElement
  //guidRects: GuidRect[]
  guidLines: GuidLine[]
  beamClener: Beam
  constructor() {
    this.spirits = []
    this.guidLines = []
    this.curSpirit = null
  }
  addImage(imgSrc: string, id: number) {
    console.log('addImage:', id)
    const image = new Image()
    image.src = imgSrc
    const spirit = new ImageSpirit(this.canvas3d, image, id)
    this.spirits.push(spirit)
    this.guidLines.push(
      new GuidLine(this.canvas3d, spirit.getGuidRect(), spirit.getId()),
    )
  }
  addMark(shape: Shape, id: number) {
    let mark: BeamSpirit
    if (shape === 'circle') {
      mark = new CircleSpirit(this.canvas3d, id)
    } else {
      mark = new MarkSpirit(this.canvas3d, shape, id)
    }
    this.spirits.push(mark)
    this.guidLines.push(
      new GuidLine(this.canvas3d, mark.getGuidRect(), mark.getId()),
    )
  }

  setCanvas3d(canvas: HTMLCanvasElement) {
    this.canvas3d = canvas
    this.beamClener = new Beam(this.canvas3d)
  }
  updateGuidRect(rect: Rect, id: number) {
    for (let index = 0; index < this.guidLines.length; index++) {
      if (this.guidLines[index] !== null) {
        if (this.guidLines[index].getId() === id) {
          this.guidLines[index].updateRect(rect)
          break
        }
      }
    }
  }
  renderAllLine() {
    //this.beamClener.clear()
    for (let index = 0; index < this.guidLines.length; index++) {
      if (this.guidLines[index] !== null) this.guidLines[index].render()
      //console.log('renderLine:' + index)
    }
  }
  deleteElement(id: number) {
    for (let index = 0; index < this.spirits.length; index++) {
      if (this.spirits[index] !== null) {
        const element = this.spirits[index]
        console.log(element.getId())
        if (element.getId() === id) {
          this.spirits[index] = null
          this.guidLines[index] = null
          console.log('deleted')
        }
      }
    }
  }
}
export const spiritCanvas = new SpiritsCanvas()
