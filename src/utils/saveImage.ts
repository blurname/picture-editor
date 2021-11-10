import {} from '../layout/Canvas/'
export const screenshot = (canvas:HTMLCanvasElement,func:any) => () => {
	func()
  canvas.toBlob((blob) => {
    saveBlob()(blob, `screencapture-${canvas.width}x${canvas.height}.png`)
  })
}

const saveBlob = () => {
	const a = document.createElement('a')
	document.body.appendChild(a)
	a.style.display = 'none'
	return (blob:Blob,fileName:string)=>{
		const url = window.URL.createObjectURL(blob)
		a.href = url
		a.download = fileName
		a.click()
	}  
}
