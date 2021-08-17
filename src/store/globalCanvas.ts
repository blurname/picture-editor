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
}
export const globalCanvas = new Canvas()
