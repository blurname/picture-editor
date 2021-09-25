import { Beam } from 'beam-gl'
import {theWShader} from '../filter/shader'
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

export class SpiritsCanvas {
  spirits: BeamSpirit[]
  curSpirit: ImageSpirit | null
  canvas3d: HTMLCanvasElement
  canvas2d: HTMLCanvasElement
  //guidRects: GuidRect[]
  guidLines: GuidLine[]
  beamClener: Beam
	background:BackSpirit
	chosenType:SpiritType
	isLarged:boolean
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
    }else if(shape ==='theW') {
			mark = new TheW(this.canvas3d,id)
		}
		else {
      mark = new MarkSpirit(this.canvas3d, shape, id)
    } 
    this.spirits.push(mark)
		this.guidLines.push(
			new GuidLine(this.canvas3d, mark.getGuidRect(), mark.getId()),
		)
  }

	addMosaic(mosaicType:MosaicType,id:number){
		let mosaic:MosaicSpirit;
		mosaic = new MosaicSpirit(this.canvas3d,mosaicType,id)
		this.spirits.push(mosaic)
		this.guidLines.push(
			new GuidLine(this.canvas3d, mosaic.getGuidRect(), mosaic.getId()),
		)
	}

  setCanvas3d(canvas: HTMLCanvasElement) {
    this.canvas3d = canvas
    this.beamClener = new Beam(this.canvas3d)
  }
  updateGuidRect(spirit:BeamSpirit) {

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
	setBackgournd(back:BackSpirit){
		this.background = back
	}
	setChosenType(type:SpiritType){
		this.chosenType = type
	}
	renderBackground(){
		this.background.render()
	}
	setIsLarged(isLarged:boolean){
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
export const spiritCanvas = new SpiritsCanvas()
