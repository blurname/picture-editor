import {Beam,ResourceTypes} from "beam-gl";

export class Spirit{
	beam:Beam
	image:HTMLImageElement
	posiiton:number[]
	constructor(canvas:HTMLCanvasElement){
		this.beam = new Beam(canvas)
	}
	setImage(imgUrl:string){
		this.image = new Image()
		this.image.src = imgUrl
	}
	render(){

	}

}
