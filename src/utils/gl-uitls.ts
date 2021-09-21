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
} from '../filter/shader'
import { depthCommand, Offscreen2DCommand } from './command'
import { mat4 } from 'gl-matrix'
import {
  createCircle,
  createHollowRectangle,
  createLine,
  createLineRect,
  createProjectionMatInShader,
  createProjectionMatInJS,
  createRectangle,
  createRectangleByProjection,
  createRotateMat,
  createScaleMat,
  createTranslateMat,
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

  constructor(canvas: HTMLCanvasElement, id: number) {
    this.canvas = canvas
    this.beam = new Beam(canvas)
    this.beam.define(depthCommand)
    this.layout = 0.7
    this.id = id
  }
  updateGuidRect() {
    throw new Error('Method not implemented.')
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    throw new Error('Method not implemented.')
  }
  updateLayout(layout: number) {
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

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement, id: number) {
    super(canvas, id)
    this.image = image
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
    this.projectionMat = createProjectionMatInShader(-w, w, h, -h)
    //this.projectionMatInJS = createProjectionMatInJS(-w, w, h, -h)

    //this.guidRectPosition = new Float32Array(16)
    //mat4.mul(this.guidRectPosition, this.position, this.projectionMatInJS)
    //console.log('this.guidRectPosition:', this.guidRectPosition)

    this.uniforms = this.beam.resource(Uniforms, {
      scaleMat: this.scaleMat,
      transMat: this.transMat,
      rotateMat: this.rotateMat,
      projectionMat: this.projectionMat,
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
    console.log(this.guidRect)
  }
  updateGuidRect() {
    this.guidRect = fUpdateGuidRect(this.position, (position: Float32Array) => {
      return {
        x: position[0]*this.scale,
        y: position[1]*this.scale,
        width: Math.abs(position[0]-position[8])*this.scale,
        height: Math.abs(position[1]-position[5])*this.scale,
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
    console.log(this.position)
    this.updateGuidRect()
    this.updateRotateMat(this.rotate)
    this.updateScaleMat(this.scale)
    this.vertexBuffers.set('position', this.position)
    console.log('child updatePosition')
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

type Buffers = {
  vertex: {
    position: number[]
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
    this.uColor = [1.0, 1.0, 1.0, 1.0]
    this.shape = shape

    this.buffers = this.getBuffersByShape()
    this.vertexBuffers = this.beam.resource(VertexBuffers, this.buffers.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, this.buffers.index)
    this.rotateMat = createRotateMat(0)
    this.scaleMat = createScaleMat(1)
    this.uniforms = this.beam.resource(Uniforms, {
      uColor: this.uColor,
      rotateMat: this.rotateMat,
      scaleMat: this.scaleMat,
    })
    this.shader = this.getShaderByShape()

    this.position = this.buffers.vertex.position
    this.rotate = 0
    this.scale = 1
    this.updateGuidRect()
  }
  getBuffersByShape(): Buffers {
    if (this.shape === 'line') {
      return createLineRect()
    } else if (this.shape === 'hollowRect') {
      return createHollowRectangle()
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
  private draw() {
    this.beam
      .depth()
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
type CircleCenter = {
  x: number
  y: number
}
export class CircleSpirit extends BeamSpirit {
  protected radius: number
  protected uColor: number[]
  protected center: CircleCenter
  constructor(canvas: HTMLCanvasElement, id: number) {
    super(canvas, id)
    this.radius = 0.2
    const circle = createCircle()
    this.center = { x: 0.0, y: 0.0 }
    this.vertexBuffers = this.beam.resource(VertexBuffers, circle.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, circle.index)
    this.uniforms = this.beam.resource(Uniforms, {
      radius: this.radius,
      centerX: this.center.x,
      centerY: this.center.y,
      uColor: [1.0, 1.0, 1.0, 1.0],
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
    this.updateRadius(scale)
  }
  updateRadius(radius: number) {
    this.radius = radius
    this.uniforms.set('radius', this.radius)
  }
  updateGuidRect() {
    this.guidRect = {
      x: this.center.x - this.radius,
      y: this.center.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    }
  }
  updateColor(color: number[]) {
    this.uColor = color
    this.uniforms.set('uColor', color)
  }
  render() {
    this.beam
      .clear()
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
  constructor(canvas: HTMLCanvasElement, rect: Rect, id: number) {
    this.id = id
    this.canvas = canvas
    this.beam = new Beam(canvas)
    const line = createLine(rect)
    this.vertexBuffers = this.beam.resource(VertexBuffers, line.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, line.index)
    this.shader = this.beam.shader(lineShader)
  }
  updateRect(rect: Rect) {
    const vertex = createLine(rect).vertex
    console.log(vertex)
    this.vertexBuffers.set('position', vertex.position)
  }
  render() {
    this.beam.draw(
      this.shader,
      this.vertexBuffers as any,
      this.indexBuffer as any,
    )
  }
  getId() {
    return this.id
  }
}
const fUpdateGuidRect = (
  position: Float32Array,
  fn: (position: Float32Array) => Rect,
): Rect => {
  return fn(position)
}
const fUpdatePosition = (
  position: Float32Array,
  fn: (position: Float32Array) => Float32Array,
) => {
  return fn(position)
}
