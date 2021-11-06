import FormItemInput from 'antd/lib/form/FormItemInput'
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
import { object } from 'superstruct'
import {
  hollowRectShader,
  lineRectShader,
  lineShader,
  circleShader,
  theWShader,
  backgourndShader,
  MosaicMultiShader,
  MonolithicShader,
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
  protected offset: Pos
  protected scale: number
  protected rotate: number
  protected model: Model
  protected uniqueProps: UniqueProps
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
    this.scale = 1
    this.rotate = 0
    this.offset = { left: 0, top: 0 }
    this.model = {
      id: this.id,
      scale: this.scale,
      rotate: this.rotate,
      trans: this.offset,
    }
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
  getRotate() {
    return this.rotate
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
  getModel() {
    return this.model
  }
  getPos() {
    return this.offset
  }
  getUniqueProps() {
    return this.uniqueProps
  }
  render() {}
}
export class RectModel extends BeamSpirit {
  //rotate:number
  //scale:number
  //offset:Pos
  //transMat:number[]
  //rotateMat:number[]
  //scaleMat:number[]
  constructor(canvas: HTMLCanvasElement, id: number) {
    super(canvas, id)
    this.transMat = createTranslateMat(this.offset)
    this.rotateMat = createRotateMat(this.rotate)
    this.scaleMat = createScaleMat(this.scale)
    this.projectionMat = createProjectionMatInShader(getCanvasEdge(this.canvas))
  }
  updateScaleMat(scale: number) {
    this.scale = scale
    this.model.scale = this.scale
    this.scaleMat = createScaleMat(scale)
    this.uniforms.set('scaleMat', this.scaleMat)
  }
  updateRotateMat(rotate: number) {
    this.rotate = rotate
    this.model.rotate = this.rotate
    this.rotateMat = createRotateMat(rotate)
    this.uniforms.set('rotateMat', this.rotateMat)
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    this.updateTransMat(distance)
    this.updateGuidRect()
  }
  updateGuidRect() {
    this.guidRect = updateRectLike(this.position, this.offset, this.scale)
  }
  updateTransMat(offset: Pos) {
    this.offset = {
      left: offset.left / this.scale,
      top: offset.top / this.scale,
    }
    this.model.trans = offset
    //const guidRect = this.getGuidRect()
    //const center:Pos = {left:guidRect.x+guidRect.width/2,top:guidRect.y+guidRect.height/2}
    this.transMat = createTranslateMat({
      left: offset.left,
      top: offset.top,
    })
    this.uniforms.set('transMat', this.transMat)
  }
}
export class ImageSpirit extends RectModel {
  image: HTMLImageElement
  textures: TexturesResource

  targets: OffscreenTargetResource[]
  inputTextures: TexturesResource
  outputTextures: TexturesResource[]

  hue: number
  saturation: number
  vignette: number
  brightness: number
  contrast: number

  uniqueProps: ImageProps = {
    id: -1,
    brightness: 0,
    contrast: 0,
    hue: 0,
    saturation: 0,
    vignette: 0,
  }

  isZoomed: boolean
  zoomSection: number[]
  defaultZoom: number[]

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
    this.shader = this.beam.shader(MonolithicShader)
    this.position = quad.vertex.position

    this.vertexBuffers = this.beam.resource(VertexBuffers, quad.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, quad.index)
    this.textures = this.beam.resource(Textures)

    this.uniforms = this.beam.resource(Uniforms, {
      scaleMat: this.scaleMat,
      transMat: this.transMat,
      rotateMat: this.rotateMat,
      projectionMat: this.projectionMat,
      layout: this.layout,
      zoomSection: this.zoomSection,
      brightness: 0,
      contrast: 0,
      hue: 0,
      saturation: 0,
      vignette: 0,
    })
    this.uniqueProps.id = this.id

    this.textures.set('img', { image: this.image, flip: true })
    //this.setFilterChain()
    this.updateGuidRect()
    //this.updateImageProps(this.uniqueProps)
  }
  setFilterChain() {
    //this.inputTextures = this.textures
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
  }
  updateModel<T extends Model>(model: T) {
    this.updateTransMat(model.trans)
    this.updateRotateMat(model.rotate)
    this.updateScaleMat(model.scale)
    this.updateGuidRect()
  }

  private updateUniform(uniform: string, value: number) {
    this[uniform] = value
		this.uniqueProps[uniform] = value
    this.uniforms.set(uniform, this[uniform])
    console.log('contrast:', uniform)
  }


  updateImageProps<T extends Omit<Partial<ImageProps>, 'id'>>(props: T) {
    for (const key in props) {
      const element = props[key]
      if (key !== 'id') {
        console.log('key:', element)
				this.updateUniform(key, element as any)
      }
    }
  }

  updateFromRemote<T extends SpiritsAction>(
    action: T,
    actionType: SpiritsActionLiteral,
  ) {
    if (actionType === 'Model') {
      console.log('Model')
      this.updateModel(action as Model)
    } else {
      console.log('UniquePropsslakjfsaldkfj')
      this.updateImageProps(action as ImageProps)
    }
  }

  updateContrast(contrast: number) {
    this.contrast = contrast
    this.uniqueProps.contrast = this.contrast
    this.uniforms.set('contrast', this.contrast)
  }
  updateBrightness(brightness: number) {
    this.brightness = brightness
		this.uniqueProps.brightness = this.brightness
    this.uniforms.set('brightness', this.brightness)
  }
  updateHue(hue: number) {
    this.hue = hue
		this.uniqueProps.hue = this.hue
    this.uniforms.set('hue', this.hue)
  }
  updateSaturation(saturation: number) {
    this.saturation = saturation
		this.uniqueProps.saturation = this.saturation
    this.uniforms.set('saturation', this.saturation)
  }
  updateVignette(vignette: number) {
    this.vignette = vignette
		this.uniqueProps.vignette = this.vignette
    this.uniforms.set('vignette', this.vignette)
  }
  getIsZoomed() {
    return this.isZoomed
  }

  zoom(cursorPosInCanvas: Point) {
    if (this.isZoomed) {
      this.zoomSection = this.defaultZoom
    } else {
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
      cx < x + width / 2 &&
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

  draw(shader: Shader, input: TexturesResource) {
    this.beam
      //.clear()
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
    this.isZoomed = isLarged
  }
  render() {
    //this.beam
    //.offscreen2D(this.targets[0], () => {
    //this.draw(this.brightnessContrastShader, this.textures)
    //})
    ////.offscreen2D(this.targets[1], () => {
    //this.draw(this.hueSaturationShader, this.outputTextures[0])
    ////})
    //this.draw(this.hueSaturationShader, this.textures)
    this.draw(this.shader, this.textures)
  }
  getHue() {
    return this.hue
  }
  getSaturation() {
    return this.saturation
  }
  getContrast() {
    return this.contrast
  }
  getBrightness() {
    return this.brightness
  }
  getVignette() {
    return this.vignette
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
export class MarkSpirit extends RectModel {
  private uColor: number[]
  private shape: RectLikeShape
  private buffers: Buffers
  constructor(
    canvas: HTMLCanvasElement,
    shape: RectLikeShape,
    id: number,
    model?: Model,
  ) {
    console.log('Mark', model)
    super(canvas, id, model)
    this.spiritType = 'Mark'
    this.uColor = [1.0, 1.0, 1.0, 1.0]
    this.shape = shape

    this.buffers = this.getBuffersByShape()
    this.vertexBuffers = this.beam.resource(VertexBuffers, this.buffers.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, this.buffers.index)

    this.projectionMat = createProjectionMatInShader(getCanvasEdge(canvas))
    this.uniforms = this.beam.resource(Uniforms, {
      transMat: this.transMat,
      uColor: this.uColor,
      rotateMat: this.rotateMat,
      scaleMat: this.scaleMat,
      projectionMat: this.projectionMat,
      layout: this.layout,
    })
    this.shader = this.getShaderByShape()
    this.position = this.buffers.vertex.position
    this.updateGuidRect()
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

export class MosaicSpirit extends RectModel {
  constructor(canvas: HTMLCanvasElement, type: MosaicType, id: number) {
    super(canvas, id)
    this.spiritType = 'Mark'
    const buffers = this.getBuffersByShape(type)
    this.position = buffers.vertex.position
    console.log(this.position)
    this.vertexBuffers = this.beam.resource(VertexBuffers, buffers.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, buffers.index)
    this.shader = this.beam.shader(this.getShaderByShape(type))
    this.uniforms = this.beam.resource(Uniforms, {
      transMat: this.transMat,
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
export class CircleSpirit extends BeamSpirit {
  protected radius: number
  protected uColor: number[]
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
    this.vertexBuffers = this.beam.resource(VertexBuffers, circle.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, circle.index)
    this.uniforms = this.beam.resource(Uniforms, {
      radius: this.radius,
      scale: this.scale,
      centerX: this.offset.left,
      centerY: this.offset.top,
      uColor: [1.0, 1.0, 1.0, 1.0],
      projectionX: this.projectionX,
      projectionY: this.projectionY,
    })
    this.shader = this.beam.shader(circleShader)
    this.updateGuidRect()
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    this.offset.left = distance.left
    this.offset.top = distance.top
    this.uniforms.set('centerX', this.offset.left)
    this.uniforms.set('centerY', this.offset.top)
    this.updateGuidRect()
  }
  updateScaleMat(scale: number) {
    this.scale = scale
    this.uniforms.set('scale', scale)
  }
  updateGuidRect() {
    this.guidRect = updateCircle(this.radius, this.offset, this.scale)
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

const fUpdateGuidRect = <T>(
  fn: (base: T, offset: Pos, scale: number) => Rect,
  base: T,
  offset: Pos,
  scale: number,
): Rect => {
  return fn(base, offset, scale)
}
const updateRectLike = (position: Float32Array, offset: Pos, scale: number) => {
  return fUpdateGuidRect(
    (position, offset, scale) => {
      return {
        x: (position[0] + offset.left) * scale,
        y: (position[1] + offset.top) * scale,
        width: Math.abs(position[0] - position[4]) * scale,
        height: Math.abs(position[1] - position[3]) * scale,
      }
    },
    position,
    offset,
    scale,
  )
}
const updateCircle = (radius: number, offset: Pos, scale: number) => {
  return fUpdateGuidRect(
    (radius, offset, scale) => {
      return {
        x: offset.left - radius * scale,
        y: offset.top - radius * scale,
        width: radius * 2 * scale,
        height: radius * 2 * scale,
      }
    },
    radius,
    offset,
    scale,
  )
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
