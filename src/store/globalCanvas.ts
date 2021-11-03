import { AxiosInstance } from 'axios'
import { Beam } from 'beam-gl'
import { ax } from '../utils/http'
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
import { createCanvas } from '../utils/http'
import { imgUrl } from '../layout/Components/Img'

type canvas = {
  id: number
  ownerId: number
}
enum eSpiType {
  image = 1,
  mark,
  mosaic,
}
function loadImage(url:string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
		img.crossOrigin=""
  });
}

const binarySearch = <T extends BeamSpirit>(
  target: unknown,
  sortedArray: T[],
) => {
  let l = 0
  let r = sortedArray.length
  let m = Math.floor((l + r) / 2)
  if (r === 0) return -1
  while (l >= r) {
    if (sortedArray[m].getId() === target) {
      return m
    } else {
      if (sortedArray[m].getId() > target) {
        r = m
      } else {
        l = m
      }
    }
  }
  return -1
}

export class SpiritCanvas {
  id: number
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
  ax: AxiosInstance
  ownerId: number
  constructor(ownerId: number, id: number, ax: AxiosInstance) {
    this.spirits = []
    this.guidLines = []
    this.curSpirit = null
    this.ownerId = ownerId
    this.ax = ax
    this.id = id
    console.log('constructor: ' + this.id)
  }
  async setCanvas() {
    console.log('asldfkjsad;lfjk')
    this.id = await createCanvas(this.ownerId)
  }
   updateFromRemote<T extends Shape | string>(typeId: number, model: Model,element:T) {
    const result = binarySearch(model.id, this.spirits)
    //console.log(`searchresult:${result}`)
    if (result === -1) {
      if (typeId === 1)
				//this.addImage('../../public/t1.jpeg', model.id, true, model)
			 this.addImage(element, model.id, true, model)
      else if (typeId === 2) this.addMark(element as Shape, model.id,true,model)
    }
  }
 async addImage(imgSrc: string, id: number, exist: boolean = false, model?: Model) {
    console.log('addImage:', id)
    const image = await loadImage(imgSrc) as HTMLImageElement
    console.log('afterAddImage:', id)
    let spirit: ImageSpirit
    if (model) {
      spirit = new ImageSpirit(this.canvas3d, image, id, model)
    } else {
      spirit = new ImageSpirit(this.canvas3d, image, id)
    }
		this.spirits[id] = spirit
		//this.spirits.push(spirit)
    this.guidLines.push(
      new GuidLine(this.canvas3d, spirit.getGuidRect(), spirit.getId()),
    )
    if (!exist) this.spiritCommit(spirit.getModel(), eSpiType.image,imgSrc)
  }

  async addMark(shape: Shape, id: number, exist: boolean = false, model?: Model) {
    let mark: BeamSpirit
    if (model) {
      if (shape === 'circle') {
        //mark = new CircleSpirit(this.canvas3d, id,model)
      } else if (shape === 'theW') {
        //mark = new TheW(this.canvas3d, id,model)
      } else {
        mark = new MarkSpirit(this.canvas3d, shape, id,model)
      }
    } else {
      if (shape === 'circle') {
        mark = new CircleSpirit(this.canvas3d, id)
      } else if (shape === 'theW') {
        mark = new TheW(this.canvas3d, id)
      } else {
        mark = new MarkSpirit(this.canvas3d, shape, id)
      }
    }

    //this.spirits.push(mark)
		this.spirits[id] = mark
    this.guidLines.push(
      new GuidLine(this.canvas3d, mark.getGuidRect(), mark.getId()),
    )
    if (!exist) this.spiritCommit(mark.getModel(), eSpiType.mark,shape)
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
  async spiritCommit<T extends Model,U extends Shape| string>(model: T, spiritType: eSpiType,element:U) {
    const res = await this.ax.post(
      `/canvas/add/?canvasid=${this.id}&spirittype=${spiritType}&canvas_spirit_id=${model.id}&element=${element}`,
      JSON.stringify(model),
    )
    console.log(res.data)
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
  ax: AxiosInstance
  spiritCanvas: SpiritCanvas
  constructor(spiritCanvas: SpiritCanvas, ax: AxiosInstance) {
    this.histories = []
    this.tail = 0
    this.lens = 0
    this.spiritCanvas = spiritCanvas
    this.ax = ax
  }
  commit<T extends SpiritsAction, U extends Partial<T>, V extends U>(
    spirit: T,
    from: U,
    to: V,
  ) {
    const operation = {
      id: spirit.id,
      from,
      to,
    }
    //console.log("operation.id",operation.id)
    this.histories.push(operation)
    this.lens = this.histories.length
    this.tail = this.lens
    this.updateRemote(operation.id)
  }
  undo() {
    if (this.tail > 0) {
      this.mapOperation(this.histories[this.tail - 1], true)
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
  async mapOperation(operation: LinearActions, back: boolean) {
    const { id, from, to } = operation
    let dir: any
    if (back) {
      dir = from
    } else {
      dir = to
    }
    const key = Object.keys(dir)[0]

    //console.log('operation:', operation)
    const spirit = this.spiritCanvas.spirits[id]
    //console.log('spirit:', spirit)
    if (key === 'trans') {
      //console.log('trans')
      //console.log('dir:',dir)
      spirit.updatePosition(dir.trans)
      //spirit.render()
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
    this.updateRemote(id)
    this.spiritCanvas.updateGuidRect(spirit)
  }
  async updateRemote(id: number) {
    const AFModel = this.spiritCanvas.spirits[id].getModel()
    const res = await this.ax.post(
      `/canvas/update/?canvasid=${this.spiritCanvas.id}&canvas_spirit_id=${AFModel.id}`,
      JSON.stringify(AFModel),
    )
    console.log('res:', res)
  }
}

//export const spiritCanvas = new SpiritsCanvas(24, ax)
//spiritCanvas.setCanvas()
//export const operationHistory = new OperationHistory(spiritCanvas, ax)
