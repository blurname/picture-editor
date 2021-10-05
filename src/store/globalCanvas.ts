import { Beam } from 'beam-gl'
import { theWShader } from '../filter/shader'
import {
  BackSpirit,
  BeamSpirit,
  CircleSpirit,
  GuidLine,
  ImageSpirit,
  MarkSpirit,
  MosaicSpirit,
  TheW,
} from '../utils/gl-uitls'

export class SpiritsCanvas{
  spirits: BeamSpirit[]
  curSpirit: ImageSpirit | null
  canvas3d: HTMLCanvasElement
  canvas2d: HTMLCanvasElement
  //guidRects: GuidRect[]
  guidLines: GuidLine[]
  beamClener: Beam
  background: BackSpirit
  chosenType: SpiritType
  isLarged: boolean
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
    } else if (shape === 'theW') {
      mark = new TheW(this.canvas3d, id)
    } else {
      mark = new MarkSpirit(this.canvas3d, shape, id)
    }
    this.spirits.push(mark)
    this.guidLines.push(
      new GuidLine(this.canvas3d, mark.getGuidRect(), mark.getId()),
    )
  }

  addMosaic(mosaicType: MosaicType, id: number) {
    let mosaic: MosaicSpirit
    mosaic = new MosaicSpirit(this.canvas3d, mosaicType, id)
    this.spirits.push(mosaic)
    this.guidLines.push(
      new GuidLine(this.canvas3d, mosaic.getGuidRect(), mosaic.getId()),
    )
  }

  setCanvas3d(canvas: HTMLCanvasElement) {
    this.canvas3d = canvas
    this.beamClener = new Beam(this.canvas3d)
  }
  updateGuidRect(spirit: BeamSpirit) {
    for (let index = 0; index < this.guidLines.length; index++) {
      if (this.guidLines[index] !== null) {
        if (this.guidLines[index].getId() === spirit.getId()) {
          this.guidLines[index].updateRect(spirit.getGuidRect())
          break
        }
      }
    }
  }
  renderAllLine() {
    //this.beamClener.clear()
    //this.background.render()
    for (let index = 0; index < this.guidLines.length; index++) {
      if (this.guidLines[index] !== null) this.guidLines[index].render()
      //console.log('renderLine:' + index)
    }
  }
  setBackgournd(back: BackSpirit) {
    this.background = back
  }
  setChosenType(type: SpiritType) {
    this.chosenType = type
  }
  renderBackground() {
    this.background.render()
  }
  setIsLarged(isLarged: boolean) {
    this.isLarged = isLarged
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

declare type LinearActions = {
  id: number
  from: Partial<SpiritActionType>
  to: Partial<SpiritActionType>
}
export class OperationHistory {
  histories: LinearActions[]
  lens: number
  tail: number
  spiritCanvas: SpiritsCanvas
  constructor(spiritCanvas: SpiritsCanvas) {
    this.histories = []
    this.tail = 0
    this.lens = 0
    this.spiritCanvas = spiritCanvas
  }
  commit<T extends SpiritsAction, U extends Partial<T>, V extends U>(
    spirit: T,
    from: U,
    to: V,
  ) {
		const operation = {
			id:spirit.id,
			from,to
		}
		console.log("operation.id",operation.id)
		this.histories.push(operation)
		this.lens = this.histories.length
		this.tail+=1
  }
  undo() {
    if (this.tail > 0) {
			this.mapOperation(this.histories[this.tail-1], true)
      this.tail -= 1
    }
  }
  redo() {
    if (this.tail < this.lens) {
      //const { id, from, to } = this.histories[this.tail]
			this.mapOperation(this.histories[this.tail], false)
      this.tail += 1
    }
  }
  mapOperation(
    operation: LinearActions,
		back:boolean
  ) {
    const { id, from, to } = operation
		let dir:any
		if (back) {
			dir = from
		}else{
			dir = to
		}
    const key = Object.keys(dir)[0]
		console.log('operation:', operation)
    const spirit = this.spiritCanvas.spirits[id]
		console.log('spirit:', spirit)
    if (key === 'trans') {
			console.log('trans')
			console.log('dir:',dir)
      spirit.updatePosition(dir.trans)
			spirit.render()
    } else if (key === 'scale') {
      spirit.updateScaleMat(dir.scale)
      // func from to
    } else if (key === 'rotate') {
      spirit.updateRotateMat(dir.rotate)
      // func from to
    } else if (key === 'color') {
			const mark = spirit as MarkSpirit
			mark.updateColor(dir)
      // func from to
    } 
    spiritCanvas.updateGuidRect(spirit)
  }
}
export const spiritCanvas = new SpiritsCanvas()
export const operationHistory = new OperationHistory(spiritCanvas)
