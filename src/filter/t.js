import { Beam, ResourceTypes } from 'beam-gl'
import { Texture } from './saturationShader'

console.log(1);
const canvas = document.querySelector('canvasRef')
// const beam = new Beam(canvas as HTMLCanvasElement)
console.log('sdlfkj')
const beam = new Beam(canvas as HTMLCanvasElement)
const shader = beam.shader(Texture)
const {VertexBuffers,IndexBuffer} = ResourceTypes

const vertexBuffers = beam.resource(VertexBuffers, {
  position: [-1, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0],
  texCoord: [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0],
})
const indexBuffer = beam.resource(IndexBuffer,{
	array:[0,1,2,0,2,3]
})
const textures = beam.resource(ResourceTypes.Textures)
const uniforms = beam.resource(ResourceTypes.Uniforms)
// const render = () => {
//   beam.clear().draw(shader,vertexBuffers)
// }
// export function render()
const a = 1
export function ca(){
	console.log(a);
}
