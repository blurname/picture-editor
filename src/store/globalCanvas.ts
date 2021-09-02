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
