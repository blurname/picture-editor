import {
  Beam,
  IndexBufferResource,
  ResourceTypes,
  Shader,
  TexturesResource,
  VertexBuffersResource,
} from 'beam-gl'
import { basicImageShader } from '../filter/saturationShader'
import { createRectangle } from './geo-utils'

const quadClearCommand = (gl: WebGLRenderingContext, rect: Rect) => {
  // console.log(rect)
  gl.enable(gl.SCISSOR_TEST)
  gl.scissor(rect.x, rect.y, rect.width, rect.height)
  gl.clearColor(0, 0, 0, 0)
  // gl.clearDepth(1)
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  // gl.enable(gl.DEPTH_TEST)
  gl.disable(gl.SCISSOR_TEST)
}
const depthCommand = {
  name: 'depth',
  onBefore(gl: WebGLRenderingContext) {
    gl.enable(gl.DEPTH_TEST)
  },
	onAfter(){}
}

export class BeamSpirit {
  beam: Beam
  image: HTMLImageElement
  position: number[]
  prePosition: number[]
  vertexBuffers: VertexBuffersResource
  indexBuffer: IndexBufferResource
  shader: Shader
  textures: TexturesResource
  canvas: HTMLCanvasElement
	zOffset:number

  constructor(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    offset: number,
  ) {
    const quad = createRectangle(offset)
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
  }
  updatePosition(distance: Pos={left:0,top:0}) {
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
	updateZ(maxZOffset:number){
		this.zOffset = maxZOffset
	}
  render() {
    this.beam
      // .clear()
      .depth()
      .draw(
        this.shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.textures as any,
      )
    return this
  }
}
