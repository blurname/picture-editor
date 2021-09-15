import {BeamSpirit, ImageSpirit} from "../utils/gl-uitls"

export class Canvas {
  cmps: Cmp[]
  selectedCmp: null | Cmp
  constructor() {
    this.cmps = []
    this.selectedCmp = null
  }
  selectCmp = (cmp: Cmp): void => {
    if (typeof this.selectCmp !== null) {
      if (this.selectedCmp === cmp) {
      } else {
        this.selectedCmp = cmp
      }
    } else {
      this.selectedCmp = cmp
    }
  }
  addCmp = (cmp: Cmp): void => {
    this.cmps = [...this.cmps, cmp]
  }
	updateCmps = ()=>{
		this.cmps = this.cmps.map((cmp)=>{
			if(cmp.id===this.selectedCmp.id){
				return this.selectedCmp
			}
			else{
				return cmp
			}
		})
	}
	updateSelectedCmp=(prop:string,value:number) => {
		this.selectedCmp[prop] = value
		console.log(this.selectedCmp[prop]);
	}
}
export const globalCanvas = new Canvas()

export class SpiritsCanvas{
	spirits:BeamSpirit[]
	curSpirit:ImageSpirit|null
	canvas3d:HTMLCanvasElement
	canvas2d:HTMLCanvasElement
	constructor(){
		this.spirits = []
		this.curSpirit = null
	}
	addSpirit(imgSrc:string){
		const image = new Image();
		image.src = imgSrc
		const spirit = new ImageSpirit(this.canvas3d,image);
		this.spirits.push(spirit)
		console.log('add new')
	}
	setCanvas3d (canvas:HTMLCanvasElement) {
		this.canvas3d = canvas
	}

}
export const spiritCanvas = new SpiritsCanvas()

export class Layout {
	rootNodes:number[]

}
