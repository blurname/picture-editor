import {
  Beam,
  IndexBufferResource,
  OffscreenTargetResource,
  Resource,
  ResourceTypes,
  Shader,
  TexturesResource,
  UniformsResource,
  VertexBuffersResource,
} from 'beam-gl'
import {
  basicImageShader,
  BrightnessContrast,
  Vignette,
  HueSaturation,
  hollowRectShader,
  lineRectShader,
	lineShader,
} from '../filter/shader'
import { depthCommand, Offscreen2DCommand } from './command'
import { mat4 } from 'gl-matrix'
import {
  createHollowRectangle,
  createLine,
  createLineRect,
  createRectangle,
  createRotateMat,
  createScaleMat,
  createTranslateMat,
} from './geo-utils'
const { VertexBuffers,IndexBuffer,Uniforms,Textures,OffscreenTarget } = ResourceTypes
export class BeamSpirit {
  protected beam: Beam
	protected id:number
  position: number[]
  protected prePosition: number[]
  protected vertexBuffers: VertexBuffersResource
  protected indexBuffer: IndexBufferResource
  protected uniforms: UniformsResource
  protected canvas: HTMLCanvasElement
  protected scaleMat: number[]
  protected transMat: number[]
  protected rotateMat: number[]
  protected baseResources: Resource[]
  protected shader: Shader
  protected layout: number
  protected guidRect: Rect
  constructor(canvas: HTMLCanvasElement,id:number) {
    this.canvas = canvas
    this.beam = new Beam(canvas)
    this.beam.define(depthCommand)
    this.layout = 0.7
		this.id = id
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    this.prePosition = this.position.map((pos) => pos)
    this.position = this.position.map((pos, index) => {
      const remainder = index % 3
      if (remainder === 0) return pos + distance.left
      // changing y to be negtive since the canvs2d's y positive axis is downward
      else if (remainder === 1) return pos + distance.top
      else return this.layout
    })
    this.vertexBuffers.set('position', this.position)
    //this.updateTransMat(distance.left, distance.top)
  }
  updateLayout(layout: number) {
    this.layout = layout
    console.log(this.layout)
    this.uniforms.set('layout', this.layout)
  }
  render() {}
  updateGuidRect() {}
	getGuidRect(){
		return this.guidRect
	}
	getId(){
		return this.id
	}
}
export class ImageSpirit extends BeamSpirit {
  image: HTMLImageElement
  textures: TexturesResource
  zOffset: number

  targets: OffscreenTargetResource[]
  inputTextures: TexturesResource
  outputTextures: TexturesResource[]

  hue: number
  saturation: number
  vignette: number
  brightness: number
  contrast: number

  brightnessContrastShader: Shader
  hueSaturationShader: Shader
  vignetteShader: Shader

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement,id:number) {
    super(canvas,id)
    const quad = createRectangle(0)
    this.image = image

    this.beam.define(Offscreen2DCommand)

    this.shader = this.beam.shader(basicImageShader)
    this.brightnessContrastShader = this.beam.shader(BrightnessContrast)
    this.hueSaturationShader = this.beam.shader(HueSaturation)
    this.vignetteShader = this.beam.shader(Vignette)

    this.position = quad.vertex.position
    this.prePosition = quad.vertex.position

    this.vertexBuffers = this.beam.resource(
      VertexBuffers,
      quad.vertex,
    )
    this.indexBuffer = this.beam.resource(IndexBuffer, quad.index)
    this.textures = this.beam.resource(Textures)

    this.rotateMat = createRotateMat(0)
    this.transMat = createTranslateMat(0, 0)
    this.scaleMat = createScaleMat(1, 1)

    this.uniforms = this.beam.resource(Uniforms, {
      scaleMat: this.scaleMat,
      transMat: this.transMat,
      rotateMat: this.rotateMat,
      hue: this.hue,
      saturation: this.saturation,
      vignette: this.vignette,
      brightness: this.brightness,
      contrast: this.contrast,
    })

    this.baseResources = []
    this.baseResources.push(this.indexBuffer as any)
    this.baseResources.push(this.vertexBuffers as any)
    this.baseResources.push(this.uniforms as any)

    this.textures.set('img', { image: this.image, flip: true })
    this.inputTextures = this.textures
    this.outputTextures = [
      this.beam.resource(Textures),
      this.beam.resource(Textures),
    ]
    this.targets = [
      this.beam.resource(OffscreenTarget),
      this.beam.resource(OffscreenTarget),
    ]
    this.outputTextures[0].set('img', this.targets[0])
    this.outputTextures[1].set('img', this.targets[1])
		this.updateGuidRect()
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    this.prePosition = this.position.map((pos) => pos)
    this.position = this.position.map((pos, index) => {
      const remainder = index % 3
      if (remainder === 0) return pos + distance.left
      // changing y to be negtive since the canvs2d's y positive axis is downward
      else if (remainder === 1) return pos + distance.top
      else return this.layout
    })
    this.vertexBuffers.set('position', this.position)
    //this.updateTransMat(distance.left, distance.top)
  }
	updateGuidRect(){
		this.guidRect = {
      x: this.position[0],
      y: this.position[1],
      width: this.position[6] - this.position[3],
      height: this.position[4] - this.position[1],
		}
	}
  getGuidRect() {
		return this.guidRect
  }
  updateZ(maxZOffset: number) {
    this.zOffset = maxZOffset
  }
  updateScaleMat(sx: number, sy: number) {
    this.scaleMat = createScaleMat(sx, sy)
    this.uniforms.set('scaleMat', this.scaleMat)
  }
  updateRotateMat(rotate: number) {
    this.rotateMat = createRotateMat(rotate)
    this.uniforms.set('rotateMat', this.rotateMat)
  }
  updateTransMat(tx: number, ty: number) {
    this.updatePosition({ left: tx, top: ty })
    this.transMat = createTranslateMat(tx, ty)
    this.uniforms.set('transMat', this.transMat)
  }
  updateContrast(contrast: number) {
    this.contrast = contrast
    this.uniforms.set('contrast', this.contrast)
  }
  updateBrightness(brightness: number) {
    this.brightness = brightness
    this.uniforms.set('brightness', this.brightness)
  }
  updateHue(hue: number) {
    this.hue = hue
    this.uniforms.set('hue', this.hue)
  }
  updateSaturation(saturation: number) {
    this.saturation = saturation
    this.uniforms.set('saturation', this.saturation)
  }
  updateVignette(vignette: number) {
    this.vignette = vignette
    this.uniforms.set('vignette', this.vignette)
  }

  //render() {
  //this.beam
  ////.clear()
  ////.quadClear(this.getRect())
  //.depth()
  //.draw(
  //this.hueSaturationShader,
  //this.vertexBuffers as any,
  //this.indexBuffer as any,
  //this.textures as any,
  //this.uniforms as any,
  //)
  ////.quadClear(this.getRect())
  //.draw(
  //this.brightnessContrastShader,
  //this.vertexBuffers as any,
  //this.indexBuffer as any,
  //this.textures as any,
  //this.uniforms as any,
  //)
  //.draw(
  //this.vignetteShader,
  //this.vertexBuffers as any,
  //this.indexBuffer as any,
  //this.textures as any,
  //this.uniforms as any,
  //)
  //console.log('rendered')
  //return this
  //}
  draw(shader: Shader, input: TexturesResource) {
    this.beam
      .depth()
      .draw(
        shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.uniforms as any,
        input as any,
      )
    console.log('drawImg')
  }
  render() {
    //this.beam.clear()
    //this.beam
    //.offscreen2D(this.targets[0], () => {
    //this.draw(this.brightnessContrastShader, this.textures)
    //})
    // .offscreen2D(this.targets[1], () => {
    //this.draw(this.hueSaturationShader, this.outputTextures[0])
    //}
    //)
    //this.draw(this.vignetteShader, this.outputTextures[0])

    this.draw(this.shader, this.textures)
  }
}

type Shape = 'line' | 'hollowRect'
type Buffers = {
  vertex: {
    position: number[]
    color: number[]
  }
  index: {
    array: number[]
  }
}
export class MarkSpirit extends BeamSpirit {
  private uColor: number[]
  private shape: 'line' | 'hollowRect'
  private buffers: Buffers
  constructor(canvas: HTMLCanvasElement, shape: Shape,id:number) {
    super(canvas,id)
    this.uColor = [1, 0, 0]
    this.buffers = this.getBuffersByShape(shape)

    this.vertexBuffers = this.beam.resource(
      VertexBuffers,
      this.buffers.vertex,
    )
    this.indexBuffer = this.beam.resource(
      IndexBuffer,
      this.buffers.index,
    )
    this.uniforms = this.beam.resource(Uniforms, {
      uColor: this.uColor,
    })
    this.shader = this.beam.shader(this.getShaderByShape(shape))

    this.position = this.buffers.vertex.position
  }
  getBuffersByShape(shape: Shape): Buffers {
    if (shape === 'line') {
      return createLineRect()
    } else if (shape === 'hollowRect') {
      return createHollowRectangle()
    }
  }
  getShaderByShape(shape: Shape) {
    if (shape === 'line') {
      return lineRectShader
    } else if (shape === 'hollowRect') {
      return hollowRectShader
    }
  }
  updateColor(color: number[]) {
    this.uColor = color
    this.uniforms.set('uColor', color)
  }
  private draw() {
    this.beam
      //.depth()
      .draw(
        this.shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.uniforms as any,
      )
    console.log('drawMark')
  }
  render() {
    this.draw()
  }
}
export class GuidLine {
  protected beam: Beam
	protected id:number
  protected vertexBuffers: VertexBuffersResource
  protected indexBuffer: IndexBufferResource
	protected shader: Shader
  protected canvas: HTMLCanvasElement
	constructor (canvas:HTMLCanvasElement,rect:Rect,id:number) {
		this.id = id
		this.canvas = canvas
		this.beam = new Beam(canvas)
		const line = createLine(rect)
		this.vertexBuffers = this.beam.resource(VertexBuffers,line.vertex)
		this.indexBuffer= this.beam.resource(IndexBuffer,line.index)
		this.shader = this.beam.shader(lineShader)
		
	}
	updateRect(rect:Rect){
		this.vertexBuffers.set('position', createLine(rect).vertex)
		
	}
	render(){
		this.beam.draw(this.shader,this.vertexBuffers as any, this.indexBuffer as any)
	}
	getId(){
		return this.id

	}
	
}