import { AxiosInstance } from 'axios'
import { Beam } from 'beam-gl'
import {type} from 'superstruct'
import {backShader, backUniforms} from '../layout/Editor/EBack'
import {
  BackgroundSpirit,
  BackImageSpirit,
  BackNonImageSpirit,
  BeamSpirit,
  CircleSpirit,
  GuidLine,
  ImageSpirit,
  MarkSpirit,
  MosaicSpirit,
  PointContainerSpirit,
  PointSpirit,
  SolidCircleSpirit,
} from '../utils/gl-uitls'
import { createCanvas } from '../utils/http'

enum eSpiType {
  image = 1,
  mark,
  mosaic,
  backNonImage,
	backImage,
  point,
}
export function loadImage(url: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
    img.crossOrigin = ''
  })
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
  background: BackgroundSpirit
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
    this.id = await createCanvas(this.ownerId)
  }

  updateFromRemote<T extends Shape | string | MosaicType | 'background'| PointSpirit[]>(
    typeId: number,
    model: Model,
    element: T,
    uniqueProps: Partial<UniqueProps>,
  ) {
    const result = binarySearch(model.id, this.spirits)
    // debugger
    console.log('aa',result)
    if (result === -1) {
      if (typeId === 1)
        this.addImage(element as string, model.id, true, model, uniqueProps)
      else if (typeId === 2)
        this.addMark(element as Shape, model.id, true, model, uniqueProps)
      else if (typeId === 3)
        this.addMosaic(element as MosaicType, model.id, true, model)
      else if (typeId === 4) 
        this.addBackground(element as string, 'backNonImage', true,uniqueProps)
      else if(typeId === 5)
        this.addBackground(element as string, 'backImage', true)
      else if(typeId === 6)
      // debugger
      console.log('aa',)
        this.addPointContainer(element as PointSpirit[], model.id,true,uniqueProps,model)
    }
  }

  async addImage(
    imgSrc: string,
    id: number,
    exist: boolean = false,
    model?: Model,
    uniqueProps?: Partial<UniqueProps>,
  ) {
    const image = (await loadImage(imgSrc)) as HTMLImageElement
    let spirit: ImageSpirit
    spirit = new ImageSpirit(this.canvas3d, image, id)
    if (model) {
      spirit.updateFromRemote(model, 'Model')
    }
    if (uniqueProps) {
      spirit.updateFromRemote(uniqueProps as ImageProps, 'UniqueProps')
    }
    this.spirits.push(spirit)
    this.guidLines.push(
      new GuidLine(this.canvas3d, spirit.getGuidRect(), spirit.getId()),
    )
    if (!exist) this.spiritCommit(spirit.getModel(), eSpiType.image, imgSrc)
  }

  async addMark(
    shape: Shape,
    id: number,
    exist: boolean = false,
    model?: Model,
    uniqueProps?: Partial<UniqueProps>,
  ) {
    let mark: BeamSpirit
    if (shape === 'circle') {
      mark = new CircleSpirit(this.canvas3d, id)
    } else if(shape==='solidCircle') {
      mark = new SolidCircleSpirit(this.canvas3d, id)
      console.log(mark)
    } else {
      mark = new MarkSpirit(this.canvas3d, shape, id)
    }
    if (model) {
      mark.updateFromRemote(model, 'Model')
    }
    if (uniqueProps) {
      mark.updateFromRemote(uniqueProps as any, 'UniqueProps')
    }
    this.spirits.push(mark)
    this.guidLines.push(
      new GuidLine(this.canvas3d, mark.getGuidRect(), mark.getId()),
    )
    if (!exist) this.spiritCommit(mark.getModel(), eSpiType.mark, shape)
  }

  addMosaic(
    mosaicType: MosaicType,
    id: number,
    exist: boolean = false,
    model?: Model,
  ) {
    let mosaic: MosaicSpirit
    mosaic = new MosaicSpirit(this.canvas3d, mosaicType, id)
    if (model) mosaic.updateFromRemote(model, 'Model')
    this.spirits.push(mosaic)
    this.guidLines.push(
      new GuidLine(this.canvas3d, mosaic.getGuidRect(), mosaic.getId()),
    )
    if (!exist)
      this.spiritCommit(mosaic.getModel(), eSpiType.mosaic, mosaicType)
  }

  addPointContainer(
    points:PointSpirit[],
    id: number,
    exist: boolean = false,
    uniqueProps:Partial<UniqueProps>,
    model?: Model,
  ) {
    let pointContainer:PointContainerSpirit 
    pointContainer = new PointContainerSpirit(this.canvas3d,id,uniqueProps,points)
    console.log({pointContainer})
    
    if (model) pointContainer.updateFromRemote(model, 'Model')
    //if (uniqueProps) pointContainer.updateFromRemote(uniqueProps, 'uniqueProps')
    this.spirits.push(pointContainer)
    this.guidLines.push(
      new GuidLine(this.canvas3d, pointContainer.getGuidRect(), pointContainer.getId()),
    )
    if (!exist){
      const pointsPos = points.reduce((pre,cur) =>  [...pre,cur.offset.left,cur.offset.top] ,[] as number[])
      this.spiritContainerCommit(pointContainer.getModel(), eSpiType.point,JSON.stringify(pointsPos))
    }
  }

  async addBackground(
    element: string,
    type:keyof Pick<typeof eSpiType,'backNonImage'|'backImage'> ,
    exist: boolean = false,
    uniqueProps?: Partial<UniqueProps>,
  ) {
    let background: BackNonImageSpirit|BackImageSpirit
    if (type ==='backNonImage'){
      background = new BackNonImageSpirit(this.canvas3d) 
			console.log('backShader:',backUniforms[element])
			;(background as BackNonImageSpirit).setShaderName(element)
			;(background as BackNonImageSpirit).setShader(backShader[element],JSON.parse(JSON.stringify(backUniforms[element])) )
			background.updateUniqueProps(uniqueProps)
    }
    else  {
      const image = (await loadImage(element)) as HTMLImageElement
      background = new BackImageSpirit(this.canvas3d, image)
		}
    this.spirits[0] = background
    if (!exist) {
      this.spiritCommit(background.getModel(), eSpiType[type], element)
    }else{
			this.updateBackground(background.getModel(), eSpiType[type], element)
		}
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
  async spiritCommit<T extends Model, U extends Shape | string | 'background'|number[]>(
    model: T,
    spiritType: eSpiType,
    element: U,
  ) {
    const res = await this.ax.post(
      `/canvas/add/?canvasid=${this.id}&spirittype=${spiritType}&canvas_spirit_id=${model.id}&element=${element}`,
      JSON.stringify(model),
    )
  }

  async spiritDelCommit(spirit_id:number){
    const res = await this.ax.post(
      `/canvas/del/?canvas_id=${this.id}&spirit_id=${spirit_id}`
    )
  }

  async spiritContainerCommit<T extends Model, U extends Shape | string | 'background'|number[]>(
    model: T,
    spiritType: eSpiType,
    element: U,
  ) {
    const res = await this.ax.post(
      `/canvas/addElementContainer/?canvasid=${this.id}&spirittype=${spiritType}&canvas_spirit_id=${model.id}`,
        {model:JSON.stringify(model),element},
    )
  }
	
  async updateBackground<T extends Model, U extends Shape | string | 'background'>(
    model: T,
    spiritType: eSpiType,
    element: U,
  ) {
    const res = await this.ax.post(
      `/canvas/update_back/?canvasid=${this.id}&spirittype=${spiritType}&canvas_spirit_id=${model.id}&element=${element}`,
      JSON.stringify(model),
    )
  }
  renderAllLine() {
    for (let index = 0; index < this.guidLines.length; index++) {
      if (this.guidLines[index] !== null) this.guidLines[index].render()
    }
  }
	renderNames(){

	}
  setBackgournd(back: BackgroundSpirit) {
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
    this.spirits = this.spirits.filter((spirit)=>spirit.getId() !== id)
    this.guidLines = this.guidLines.filter((guidLine)=>guidLine.getId() !== id)
    this.spiritDelCommit(id)
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
    actionType: SpiritsActionLiteral,
  ) {
    const operation = {
      id: spirit.id,
      from,
      to,
    }
    console.log('operation', operation)

    this.histories.push(operation)
    this.lens = this.histories.length
    this.tail = this.lens
    this.updateRemote(operation.id, actionType)
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

    const spirit = this.spiritCanvas.spirits.find(s=>s.getId()===id)
    if (key === 'trans' || key === 'scale' || key === 'rotate') {
      spirit.updateModel(dir)
      this.spiritCanvas.updateGuidRect(spirit)
    } else if (spirit.getSpiritType() === 'Image') {
      const image = spirit as ImageSpirit
      image.updateImageProps(dir)
    } else if (spirit.getSpiritType() === 'Mark') {
      const mark = spirit as MarkSpirit
      mark.updateRectMarkProps(dir)
    }

    //this.updateRemote(id)
  }

  updateRemote(id: number, actionType: SpiritsActionLiteral) {
    if (actionType === 'Model') this.updateRemoteModel(id)
    else if (actionType === 'UniqueProps') this.updateRemoteUniqueProps(id)
  }
  async updateRemoteModel(id: number) {
    const model = this.spiritCanvas.spirits.find(s=>s.getId()===id).getModel()
    const res = await this.ax.post(
      `/canvas/update_model/?canvasid=${this.spiritCanvas.id}&canvas_spirit_id=${model.id}`,
      JSON.stringify(model),
    )
    console.log('update_model:', res)
  }
  async updateRemoteUniqueProps(id: number) {
    const unique = this.spiritCanvas.spirits.find(s=>s.getId()===id).getUniqueProps()
    console.log('unique:', unique)
    const res = await this.ax.post(
      `/canvas/update_unique_props/?canvasid=${this.spiritCanvas.id}&canvas_spirit_id=${unique.id}`,
      JSON.stringify(unique),
    )
    console.log('updated_uniqueProps:', res)
  }
}
