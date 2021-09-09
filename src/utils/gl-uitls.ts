import {
  Beam,
  IndexBufferResource,
  OffscreenTargetResource,
  ResourceTypes,
  Shader,
  TexturesResource,
  UniformsResource,
  VertexBuffersResource,
} from 'beam-gl'
import { basicImageShader } from '../filter/saturationShader'
import {depthCommand,Offscreen2DCommand} from './command'
import {
  createRectangle,
  createRotateMat,
  createScaleMat,
  createTranslateMat,
} from './geo-utils'

export class BeamSpirit {
  beam: Beam
  image: HTMLImageElement
  position: number[]
  prePosition: number[]
  vertexBuffers: VertexBuffersResource
  indexBuffer: IndexBufferResource
  shader: Shader
  textures: TexturesResource
  uniforms: UniformsResource
  canvas: HTMLCanvasElement
  zOffset: number
  scaleMat: number[]
  transMat: number[]
  rotateMat: number[]
	inputTextures:TexturesResource[]
	outputTargets:OffscreenTargetResource[]

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    const quad = createRectangle(0)
    this.image = image
    this.canvas = canvas
    this.beam = new Beam(canvas)
    this.beam.define(depthCommand)
    this.shader = this.beam.shader(basicImageShader)
    this.position = quad.vertex.position
    this.prePosition = quad.vertex.position
    this.vertexBuffers = this.beam.resource(
      ResourceTypes.VertexBuffers,
      quad.vertex,
    )
    this.indexBuffer = this.beam.resource(ResourceTypes.IndexBuffer, quad.index)
    this.textures = this.beam.resource(ResourceTypes.Textures)
    this.textures.set('img', { image: this.image, flip: true })
    this.rotateMat = createRotateMat(0)
    this.transMat = createTranslateMat(0, 0)
    this.scaleMat = createScaleMat(1, 1)
    this.uniforms = this.beam.resource(ResourceTypes.Uniforms, {
      scaleMat: this.scaleMat,
      transMat: this.transMat,
      rotateMat: this.rotateMat,
    })
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    this.prePosition = this.position.map((pos) => pos)
    this.position = this.position.map((pos, index) => {
      const remainder = index % 3
      if (remainder === 0) return pos + distance.left
      // changing y to be negtive since the canvs2d's y positive axis is downward
      else if (remainder === 1) return pos + distance.top
      else return this.zOffset
    })
    this.vertexBuffers.set('position', this.position)
  }
  getRect() {
    const webglPosInCanvas = this.prePosition.map((pos) => pos)
    const glPosInCanvas = {
      x: webglPosInCanvas[0],
      y: webglPosInCanvas[1],
      width: webglPosInCanvas[6] - webglPosInCanvas[3],
      height: webglPosInCanvas[4] - webglPosInCanvas[1],
    }
    return glPosInCanvas
  }
  updateZ(maxZOffset: number) {
    this.zOffset = maxZOffset
  }
  updateScaleMat(sx: number, sy: number) {
    this.scaleMat = createScaleMat(sx, sy)
		this.uniforms.set('scaleMat', this.scaleMat)
}
  updateRotateMat(rotate:number) {
    this.rotateMat = createRotateMat(rotate)
		this.uniforms.set('rotateMat', this.rotateMat)
  }
  updateTransMat(tx: number, ty: number) {
    this.transMat = createTranslateMat(tx, ty)
		this.uniforms.set('transMat', this.transMat)
  }
  render() {
    this.beam
		//.clear()
      //.quadClear(this.getRect())
			.depth()
      .draw(
        this.shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.textures as any,
        this.uniforms as any,
      )
    console.log('rendered')
    return this
  }
	filterRender(){
		this.beam
		.depth()
      .draw(
        this.shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.textures as any,
        this.uniforms as any,
      )
	}
}
