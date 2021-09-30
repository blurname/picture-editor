export const textRneder = () => {
  const width = 200
  const height = 200
  const cnavas = new OffscreenCanvas(width, height)
  const ctx = cnavas.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  const size = 100
  const text = `ssaklfjlsakdjflsakdjflssadklfjlaskfjlksajdflkasjfdk`
	ctx.font = size+'px'
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
  let image = ctx.getImageData(0, 0, width, height)

	console.log(image.data.filter((data) => data!==0))
  //console.log(image.data)
}



//unionfind
//1. find root
const find = (index: number, array: number[]) => {
  //args: index
  while (index != array[index]) {
		array[index] = array[array[index]]
    index = array[index]
  }
  return index
}
//2. union two elements' roots
const union = (x: number, y: number, array: number[]) => {
  const rootX = find(x, array)
  const rootY = find(y, array)
  if (rootX === rootY) return
  array[rootX] = rootY
}

const hasPixel = (x:number,y:number,array:number[],width:number) => {
	return array[(y*width+x)*4+3]>0

}
const markPoint = (x:number,y:number) => {


}
