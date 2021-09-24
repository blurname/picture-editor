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
  circleShader,
  theWShader,
  backgourndShader,
  MosaicMultiShader,
} from '../filter/shader'
import { depthCommand, Offscreen2DCommand } from './command'
import {
  createCircle,
  createHollowRectangle,
  createLine,
  createLineRect,
  createProjectionMatInShader,
  createRectangleByProjection,
  createRotateMat,
  createScaleMat,
  createProjectionXY,
  createW,
  createBackGrid,
  createMosaic,
} from './geo-utils'
const { VertexBuffers, IndexBuffer, Uniforms, Textures, OffscreenTarget } =
  ResourceTypes
export class BeamSpirit {
  protected beam: Beam
  protected id: number
  position: Float32Array
  protected prePosition: number[]
  protected vertexBuffers: VertexBuffersResource
  protected indexBuffer: IndexBufferResource
  protected uniforms: UniformsResource
  protected canvas: HTMLCanvasElement
  protected scaleMat: number[]
  protected transMat: number[]
  protected rotateMat: number[]
  protected projectionMat: number[]
  protected projectionMatInJS: Float32Array
  protected baseResources: Resource[]
  protected shader: Shader
  protected layout: number
  protected guidRect: Rect
  protected pos: Pos
  protected scale: number
  protected rotate: number
  protected guidRectPosition: Float32Array
  protected isToggle: boolean
  protected spiritType: SpiritType


  constructor(canvas: HTMLCanvasElement, id: number) {
    this.canvas = canvas
    this.beam = new Beam(canvas)
    this.beam.define(depthCommand)
    this.layout = 0.7
    this.id = id
    this.isToggle = true
  }
  updateGuidRect() {
    throw new Error('Method not implemented.')
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    throw new Error('Method not implemented.')
  }
  updateLayout(layout: number) {
    //throw new Error('Method not implemented.')
    this.layout = layout
    this.uniforms.set('layout', this.layout)
  }
  updateScaleMat(scale: number) {
    throw new Error('Method not implemented.')
  }
  updateRotateMat(value: number) {
    throw new Error('Method not implemented.')
  }
  getGuidRect() {
    return this.guidRect
  }
  getId() {
    return this.id
  }
  getScale() {
    return this.scale
  }
  getIsToggle() {
    return this.isToggle
  }
  getSpiritType() {
    return this.spiritType
  }
  getLayout() {
    return this.layout
  }
  render() {}
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

  isZoomed: boolean
	zoomSection:number[]
	defaultZoom:number[]

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement, id: number) {
    super(canvas, id)
    this.isZoomed = false
    this.spiritType = 'Image'
    this.image = image
		this.defaultZoom = []
		this.defaultZoom.push(0.0)
		this.defaultZoom.push(0.0)
		this.defaultZoom.push(1.0)
		this.zoomSection = this.defaultZoom

    const quad = createRectangleByProjection(image.width, image.height)

    this.beam.define(Offscreen2DCommand)

    this.shader = this.beam.shader(basicImageShader)
    this.brightnessContrastShader = this.beam.shader(BrightnessContrast)
    this.hueSaturationShader = this.beam.shader(HueSaturation)
    this.vignetteShader = this.beam.shader(Vignette)

    this.position = quad.vertex.position

    this.vertexBuffers = this.beam.resource(VertexBuffers, quad.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, quad.index)
    this.textures = this.beam.resource(Textures)

    this.rotateMat = createRotateMat(0)
    this.scaleMat = createScaleMat(1)

    const w = this.canvas.width / 2
    const h = this.canvas.height / 2
    this.projectionMat = createProjectionMatInShader(getCanvasEdge(this.canvas))
    //this.projectionMatInJS = createProjectionMatInJS(-w, w, h, -h)

    //this.guidRectPosition = new Float32Array(16)
    //mat4.mul(this.guidRectPosition, this.position, this.projectionMatInJS)

    this.uniforms = this.beam.resource(Uniforms, {
      scaleMat: this.scaleMat,
      transMat: this.transMat,
      rotateMat: this.rotateMat,
      projectionMat: this.projectionMat,
      layout: this.layout,
			zoomSection:this.zoomSection
      //hue: this.hue,
      //saturation: this.saturation,
      //vignette: this.vignette,
      //brightness: this.brightness,
      //contrast: this.contrast,
    })

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
    this.rotate = 0
    this.scale = 1
    this.updateGuidRect()
  }
  updateGuidRect() {
    this.guidRect = fUpdateGuidRect(this.position, (position: Float32Array) => {
      return {
        x: position[0] * this.scale,
        y: position[1] * this.scale,
        width: Math.abs(position[0] - position[8]) * this.scale,
        height: Math.abs(position[1] - position[5]) * this.scale,
      }
    })
  }

  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    const scaleedDis = {
      left: distance.left / this.scale,
      top: distance.top / this.scale,
    }
    this.position = this.position.map((pos, index) => {
      const remainder = index % 4
      if (remainder === 0) return pos + scaleedDis.left
      // changing y to be negtive since the canvs2d's y positive axis is downward
      else if (remainder === 1) return pos + scaleedDis.top
      else return pos
    })
    this.updateGuidRect()
    this.updateRotateMat(this.rotate)
    this.updateScaleMat(this.scale)
    this.vertexBuffers.set('position', this.position)
    //this.updateTransMat(distance.left, distance.top)
  }

  updateZ(maxZOffset: number) {
    this.zOffset = maxZOffset
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
  updateScaleMat(scale: number) {
    if (this.scale === scale) {
      return
    }
    this.scale = scale
    this.scaleMat = createScaleMat(scale)
    this.uniforms.set('scaleMat', this.scaleMat)
  }
  updateRotateMat(rotate: number) {
    const origin: Pos = {
      left: this.guidRect.x + this.guidRect.width / 2,
      top: this.guidRect.y + this.guidRect.height / 2,
    }
    this.rotate = rotate
    this.rotateMat = createRotateMat(rotate, origin)
    this.uniforms.set('rotateMat', this.rotateMat)
  }
	getIsZoomed(){
		return this.isZoomed
	}

	zoom(cursorPosInCanvas:Point){
		if(this.isZoomed){
			this.zoomSection = this.defaultZoom
		}else{
			this.zoomSection = this.setZoomSection(cursorPosInCanvas)
		}
			this.uniforms.set('zoomSection', this.zoomSection)
			this.isZoomed = !this.isZoomed
	}

  setZoomSection(cursorPosInCanvas: Point) {
    const section = this.getInRectSection(cursorPosInCanvas)
    let sectionVec3 = []
    if (section === 0) {
      sectionVec3.push(0.0)
      sectionVec3.push(0.0)
			sectionVec3.push(2.0)
    } else if (section === 1) {
      sectionVec3.push(0.0)
      sectionVec3.push(0.5)
			sectionVec3.push(2.0)
    } else if (section === 2) {
      sectionVec3.push(0.5)
      sectionVec3.push(0.5)
			sectionVec3.push(2.0)
    } else if (section === 3) {
      sectionVec3.push(0.5)
      sectionVec3.push(0.0)
			sectionVec3.push(2.0)
    }
		return sectionVec3
  }
  getInRectSection(cursorPosInCanvas: Point) {
    const { x, y, width, height } = this.guidRect
    //ld->lu->ru->rd
    const cx = cursorPosInCanvas.x
    const cy = cursorPosInCanvas.y
    let section: number
    if (cx >= x && cx < x + width / 2 && cy >= y && cy < y + height / 2)
      section = 0
    else if (
      cx >= x &&
      cx < x + width/2 &&
      cy >= y + height / 2 &&
      cy <= y + height
    ) {
      section = 1
    } else if (
      cx >= x + width / 2 &&
      cx <= x + width &&
      cy >= y + height / 2 &&
      cy <= y + height
    ) {
      section = 2
    } else if (
      cx >= x + width / 2 &&
      cx <= x + width &&
      cy >= y &&
      cy < y + height / 2
    ) {
      section = 3
    }
    return section
  }

  //updateLayout(layout: number) {
  ////throw new Error('Method not implemented.')
  //this.layout = layout
  //this.uniforms.set('layout', this.layout)
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
  }
  setIsLarged(isLarged: boolean) {
    this.isLarged = isLarged
  }
  render() {
    //this.beam.clear()
    //this.beam
    //.offscreen2D(this.targets[0], () => {
    //this.draw(this.brightnessContrastShader, this.textures)
    //})
    //.offscreen2D(this.targets[1], () => {
    //this.draw(this.hueSaturationShader, this.outputTextures[0])
    //}
    //)
    //this.draw(this.vignetteShader, this.outputTextures[0])

    this.draw(this.shader, this.textures)
  }
}

type Buffers = {
  vertex: {
    position: Float32Array
    color: number[]
  }
  index: {
    array: number[]
  }
}
type RectLikeShape = Exclude<Shape, 'circle'>
export class MarkSpirit extends BeamSpirit {
  private uColor: number[]
  private shape: RectLikeShape
  private buffers: Buffers
  constructor(canvas: HTMLCanvasElement, shape: RectLikeShape, id: number) {
    super(canvas, id)
    this.spiritType = 'Mark'
    this.uColor = [1.0, 1.0, 1.0, 1.0]
    this.shape = shape

    this.buffers = this.getBuffersByShape()
    this.vertexBuffers = this.beam.resource(VertexBuffers, this.buffers.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, this.buffers.index)
    this.rotateMat = createRotateMat(0)
    this.scaleMat = createScaleMat(1)
    const w = this.canvas.width / 2
    const h = this.canvas.height / 2
    //this.projectionMat = createProjectionMatInShader(-w, w, h, -h)
    this.projectionMat = createProjectionMatInShader(getCanvasEdge(canvas))
    this.uniforms = this.beam.resource(Uniforms, {
      uColor: this.uColor,
      rotateMat: this.rotateMat,
      scaleMat: this.scaleMat,
      projectionMat: this.projectionMat,
      layout: this.layout,
    })
    this.shader = this.getShaderByShape()
    this.position = this.buffers.vertex.position
    this.rotate = 0
    this.scale = 1
    this.updateGuidRect()
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    const scaleedDis = {
      left: distance.left / this.scale,
      top: distance.top / this.scale,
    }
    this.position = this.position.map((pos, index) => {
      const remainder = index % 4
      if (remainder === 0) return pos + scaleedDis.left
      // changing y to be negtive since the canvs2d's y positive axis is downward
      else if (remainder === 1) return pos + scaleedDis.top
      else return pos
    })
    this.updateGuidRect()
    this.updateRotateMat(this.rotate)
    this.updateScaleMat(this.scale)
    this.vertexBuffers.set('position', this.position)
    //this.updateTransMat(distance.left, distance.top)
  }
  getBuffersByShape(): Buffers {
    if (this.shape === 'line') {
      return createLineRect(400, 400)
    } else if (this.shape === 'hollowRect') {
      return createHollowRectangle(400, 400)
    }
  }
  getShaderByShape() {
    if (this.shape === 'line') {
      return this.beam.shader(lineRectShader)
    } else if (this.shape === 'hollowRect') {
      return this.beam.shader(hollowRectShader)
    }
  }
  updateColor(color: number[]) {
    this.uColor = color
    this.uniforms.set('uColor', color)
  }
  updateGuidRect() {
    this.guidRect = fUpdateGuidRect(this.position, (position: Float32Array) => {
      return {
        x: position[0] * this.scale,
        y: position[1] * this.scale,
        width: Math.abs(position[0] - position[8]) * this.scale,
        height: Math.abs(position[1] - position[5]) * this.scale,
      }
    })
  }
  updateScaleMat(scale: number) {
    if (this.scale === scale) {
      return
    }
    this.scale = scale
    this.scaleMat = createScaleMat(scale)
    this.uniforms.set('scaleMat', this.scaleMat)
  }
  updateRotateMat(rotate: number) {
    //if(this.rotate === rotate) return
    const origin: Pos = {
      left: this.guidRect.x + this.guidRect.width / 2,
      top: this.guidRect.y + this.guidRect.height / 2,
    }
    this.rotate = rotate
    this.rotateMat = createRotateMat(rotate, origin)
    this.uniforms.set('rotateMat', this.rotateMat)
  }
  private draw() {
    this.beam
      .depth()
      .draw(
        this.shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.uniforms as any,
      )
  }
  render() {
    this.draw()
  }
}
type CircleCenter = {
  x: number
  y: number
}
export class CircleSpirit extends BeamSpirit {
  protected radius: number
  protected uColor: number[]
  protected center: CircleCenter
  protected projectionX: number
  protected projectionY: number
  constructor(canvas: HTMLCanvasElement, id: number) {
    super(canvas, id)
    this.spiritType = 'Mark'
    this.radius = 200
    this.scale = 1
    const xy = createProjectionXY(getCanvasEdge(this.canvas))
    this.projectionX = xy.x
    this.projectionY = xy.y
    const circle = createCircle()
    this.center = { x: 0.0, y: 0.0 }
    this.vertexBuffers = this.beam.resource(VertexBuffers, circle.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, circle.index)
    this.uniforms = this.beam.resource(Uniforms, {
      radius: this.radius,
      scale: this.scale,
      centerX: this.center.x,
      centerY: this.center.y,
      uColor: [1.0, 1.0, 1.0, 1.0],
      projectionX: this.projectionX,
      projectionY: this.projectionY,
    })
    this.shader = this.beam.shader(circleShader)
    this.updateGuidRect()
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    this.center.x += distance.left
    this.center.y += distance.top
    this.uniforms.set('centerX', this.center.x)
    this.uniforms.set('centerY', this.center.y)
    this.updateGuidRect()
  }
  updateScaleMat(scale: number) {
    this.scale = scale
    this.uniforms.set('scale', scale)
  }
  updateGuidRect() {
    const circleBase = { center: this.center, radius: this.radius }
    this.guidRect = fUpdateGuidRect(circleBase, (circleArgs) => {
      return {
        x: circleArgs.center.x - circleArgs.radius * this.scale,
        y: circleArgs.center.y - circleArgs.radius * this.scale,
        width: circleArgs.radius * 2 * this.scale,
        height: circleArgs.radius * 2 * this.scale,
      }
    })
  }
  updateColor(color: number[]) {
    this.uColor = color
    this.uniforms.set('uColor', color)
  }
  render() {
    this.beam.draw(
      this.shader,
      this.vertexBuffers as any,
      this.indexBuffer as any,
      this.uniforms as any,
    )
  }
}
export class TheW extends BeamSpirit {
  constructor(canvas: HTMLCanvasElement, id: number) {
    super(canvas, id)
    const theW = createW(100)
    this.spiritType = 'Mark'
    this.vertexBuffers = this.beam.resource(VertexBuffers, theW.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, theW.index)
    this.shader = this.beam.shader(theWShader)
    this.rotateMat = createRotateMat(0)
    this.scaleMat = createScaleMat(1)
    this.projectionMat = createProjectionMatInShader(getCanvasEdge(canvas))
    this.uniforms = this.beam.resource(Uniforms, {
      uColor: [1.0, 1.0, 1.0, 1.0],
      rotateMat: this.rotateMat,
      scaleMat: this.scaleMat,
      projectionMat: this.projectionMat,
    })
  }
  render() {
    this.beam.draw(
      this.shader,
      this.vertexBuffers as any,
      this.indexBuffer as any,
      this.uniforms as any,
    )
  }
}

export class MosaicSpirit extends BeamSpirit {
  constructor(canvas: HTMLCanvasElement, type: MosaicType, id: number) {
    super(canvas, id)
    this.spiritType = 'Mark'
    const buffers = this.getBuffersByShape(type)
    this.position = buffers.vertex.position
    console.log(this.position)
    this.vertexBuffers = this.beam.resource(VertexBuffers, buffers.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, buffers.index)
    this.shader = this.beam.shader(this.getShaderByShape(type))
    this.rotateMat = createRotateMat(0)
    this.scaleMat = createScaleMat(1)
    this.scale = 1
    this.rotate = 0
    this.projectionMat = createProjectionMatInShader(getCanvasEdge(canvas))
    this.uniforms = this.beam.resource(Uniforms, {
      rotateMat: this.rotateMat,
      scaleMat: this.scaleMat,
      projectionMat: this.projectionMat,
      layout: this.layout,
    })
    this.updateGuidRect()
  }
  getShaderByShape(type: MosaicType) {
    let shader: any
    if (type === 'multi') {
      shader = MosaicMultiShader
    }
    return shader
  }
  getBuffersByShape(type: MosaicType): Buffers {
    let buffers: any
    if (type === 'multi') {
      buffers = createMosaic(300, 300)
    }
    return buffers
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    const scaleedDis = {
      left: distance.left / this.scale,
      top: distance.top / this.scale,
    }
    this.position = this.position.map((pos, index) => {
      const remainder = index % 4
      if (remainder === 0) return pos + scaleedDis.left
      // changing y to be negtive since the canvs2d's y positive axis is downward
      else if (remainder === 1) return pos + scaleedDis.top
      else return pos
    })
    this.updateGuidRect()
    this.updateRotateMat(this.rotate)
    this.updateScaleMat(this.scale)
    this.vertexBuffers.set('position', this.position)
    //this.updateTransMat(distance.left, distance.top)
  }
  updateGuidRect() {
    this.guidRect = fUpdateGuidRect(this.position, (position: Float32Array) => {
      return {
        x: position[0] * this.scale,
        y: position[1] * this.scale,
        width: Math.abs(position[0] - position[8]) * this.scale,
        height: Math.abs(position[1] - position[5]) * this.scale,
      }
    })
    console.log(this.guidRect)
  }
  updateScaleMat(scale: number) {
    if (this.scale === scale) {
      return
    }
    this.scale = scale
    this.scaleMat = createScaleMat(scale)
    this.uniforms.set('scaleMat', this.scaleMat)
  }
  updateRotateMat(rotate: number) {
    //if(this.rotate === rotate) return
    const origin: Pos = {
      left: this.guidRect.x + this.guidRect.width / 2,
      top: this.guidRect.y + this.guidRect.height / 2,
    }
    this.rotate = rotate
    this.rotateMat = createRotateMat(rotate, origin)
    this.uniforms.set('rotateMat', this.rotateMat)
  }

  render() {
    this.beam
      .depth()
      .draw(
        this.shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.uniforms as any,
      )
  }
}
export class GuidLine {
  protected beam: Beam
  protected id: number
  protected vertexBuffers: VertexBuffersResource
  protected indexBuffer: IndexBufferResource
  protected shader: Shader
  protected canvas: HTMLCanvasElement
  protected projectionMat: number[]
  protected uniform: UniformsResource
  constructor(canvas: HTMLCanvasElement, rect: Rect, id: number) {
    this.id = id
    this.canvas = canvas
    this.beam = new Beam(canvas)
    this.projectionMat = createProjectionMatInShader(getCanvasEdge(this.canvas))
    const line = createLine(rect)
    this.vertexBuffers = this.beam.resource(VertexBuffers, line.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, line.index)
    this.uniform = this.beam.resource(Uniforms, {
      projectionMat: this.projectionMat,
    })
    this.shader = this.beam.shader(lineShader)
  }
  updateRect(rect: Rect) {
    const vertex = createLine(rect).vertex
    this.vertexBuffers.set('position', vertex.position)
  }
  render() {
    this.beam.draw(
      this.shader,
      this.vertexBuffers as any,
      this.indexBuffer as any,
      this.uniform as any,
    )
  }
  getId() {
    return this.id
  }
}
export class BackSpirit extends BeamSpirit {
  constructor(canvas: HTMLCanvasElement, id: number) {
    super(canvas, id)
    this.isToggle = false
    const back = createBackGrid()
    this.vertexBuffers = this.beam.resource(VertexBuffers, back.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, back.index)
    this.shader = this.beam.shader(backgourndShader)
    this.uniforms = this.beam.resource(Uniforms, {
      rows: 32,
    })
  }
  render() {
    this.beam
      .depth()
      .draw(
        this.shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.uniforms as any,
      )
  }
}

const fUpdateGuidRect = <T>(position: T, fn: (args: T) => Rect): Rect => {
  return fn(position)
}
const fUpdatePosition = (
  position: Float32Array,
  fn: (position: Float32Array) => Float32Array,
) => {
  return fn(position)
}
const getCanvasEdge = (canvas: HTMLCanvasElement) => {
  const w = canvas.width / 2
  const h = canvas.height / 2
  return {
    l: -w,
    r: w,
    t: h,
    b: -h,
  }
}
