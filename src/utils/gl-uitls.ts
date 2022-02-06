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
  hollowRectShader,
  lineRectShader,
  lineShader,
  circleShader,
  theWShader,
  backCellShader,
  MosaicMultiShader,
  MonolithicShader,
  backImageShader,
  MosaicFracShader,
  MosaicSnowShader,
  solidCircleShader,
} from '../filter/shader'
import { User } from '../hooks/useUsers'
import { loadImage } from '../store/globalCanvas'
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
  createSolidCircle,
} from './geo-utils'
const { VertexBuffers, IndexBuffer, Uniforms, Textures, OffscreenTarget } =
  ResourceTypes

export class PointSpirit {
  beam: Beam
  canvas: HTMLCanvasElement
  layer: number
  offset: Pos
  vertexBuffers: VertexBuffersResource
  indexBuffer: IndexBufferResource
  uniforms: UniformsResource
  shader: Shader
  radius: number
  scale: number
  projectionX: number
  projectionY: number
  constructor(canvas: HTMLCanvasElement, offset: Pos) {
    this.canvas = canvas
    this.beam = new Beam(canvas)
    this.offset = offset
    this.beam.define(depthCommand)
    const point = createSolidCircle()
    this.radius = 15
    this.scale = 1
    this.layer = 20
    const xy = createProjectionXY(getCanvasEdge(this.canvas))
    this.projectionX = xy.x
    this.projectionY = xy.y
    this.vertexBuffers = this.beam.resource(VertexBuffers, point.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, point.index)
    this.shader = this.beam.shader(solidCircleShader)
    this.uniforms = this.beam.resource(Uniforms, {
      radius: this.radius,
      scale: this.scale,
      centerX: this.offset.left,
      centerY: this.offset.top,
      uColor: [1.0, 1.0, 1.0, 1.0],
      projectionX: this.projectionX,
      projectionY: this.projectionY,
      layer: this.layer,
    })
    this.updatePosition(this.offset)
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    this.offset = { ...distance }
    this.uniforms.set('centerX', this.offset.left)
    this.uniforms.set('centerY', this.offset.top)
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
  protected layer: number
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
    this.layer = 0.7
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
      layer: this.layer,
    }
  }
  updateGuidRect() {
    throw new Error('Method not implemented.')
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    throw new Error('Method not implemented.')
  }
  updateLayer(layer: number) {
    //throw new Error('Method not implemented.')
    this.layer = layer
    this.model.layer = this.layer
    this.uniforms.set('layer', this.layer)
  }
  updateScaleMat(scale: number) {
    throw new Error('Method not implemented.')
  }
  updateRotateMat(value: number) {
    throw new Error('Method not implemented.')
  }
  updateModel(model: Partial<Model>) {
    throw new Error('Method not implemented.')
  }
  updateUniqueProps<T extends Omit<Partial<UniqueProps>, 'id'>>(
    uniqueProps: T,
  ) {
    throw new Error('Method not implemented.')
  }

  updateFromRemote<T extends SpiritsAction>(
    action: T,
    actionType: SpiritsActionLiteral,
  ) {
    throw new Error('Method not implemented.')
  }
  getGuidRect() {
    return this.guidRect
  }
  getId() {
    return this.id
  }
  getIsToggle() {
    return this.isToggle
  }
  getSpiritType() {
    return this.spiritType
  }
  getlayer() {
    return this.layer
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
  render() { }
}
export class RectModel extends BeamSpirit {
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
    this.transMat = createTranslateMat({
      left: offset.left,
      top: offset.top,
    })
    this.uniforms.set('transMat', this.transMat)
  }
  updateModel(model: Partial<Model>) {
    this.updateRectModel(model)
  }
  updateRectModel<T extends Partial<Model>>(model: T) {
    if (model.scale) {
      this.updateScaleMat(model.scale)
      this.updateTransMat(this.model.trans)
    }
    if (model.rotate) this.updateRotateMat(model.rotate)
    if (model.trans) this.updateTransMat(model.trans)
    if (model.layer) this.updateLayer(model.layer)
    this.updateGuidRect()
  }
}
export class PointContainerSpirit extends RectModel {
  width:number
  height:number
  points:PointSpirit[]
  constructor(canvas: HTMLCanvasElement, id: number, TLDR: number[], points: PointSpirit[]) {
    super(canvas, id)
    this.spiritType = 'PointContainer'
    this.width = Math.abs(TLDR[1] - TLDR[3]) 
    this.height= Math.abs(TLDR[0] - TLDR[2]) 
    this.offset = {left:TLDR[1],top:TLDR[2]}
    this.points = points
    this.updateGuidRect()
  }
  updateFromRemote<T extends SpiritsAction>(
    action: T,
    actionType: SpiritsActionLiteral,
  ) {
    if (actionType === 'Model') {
      this.updateRectModel(action as Model)
      //} else {
      //this.updateRectMarkProps(action as MarkProps)
    }
  }
  updatePosition(distance:Pos){
    this.offset = distance
    this.points.forEach((point) => point.updatePosition(distance))
    this.updateGuidRect()
  }
  updateGuidRect() {
    this.guidRect = updateContainer(this.offset,this.width,this.height,this.scale)
  }
  render() {
    this.points.forEach((point) => point.render())
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
      layer: this.layer,
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

  updateUniform(uniform: string, value: number) {
    this[uniform] = value
    this.uniqueProps[uniform] = value
    this.uniforms.set(uniform, this[uniform])
  }

  updateImageProps<T extends Omit<Partial<ImageProps>, 'id'>>(props: T) {
    for (const key in props) {
      const element = props[key]
      if (key !== 'id') {
        this.updateUniform(key, element as any)
      }
    }
  }
  updateUniqueProps<T extends Omit<Partial<ImageProps>, 'id'>>(uniqueProps: T) {
    this.updateImageProps(uniqueProps)
  }

  updateFromRemote<T extends SpiritsAction>(
    action: T,
    actionType: SpiritsActionLiteral,
  ) {
    if (actionType === 'Model') {
      this.updateRectModel(action as Model)
    } else {
      this.updateImageProps(action as ImageProps)
    }
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
  getUniqueProps() {
    return this.uniqueProps
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
  uniqueProps: MarkProps = {
    id: -1,
    uColor: [],
  }
  constructor(canvas: HTMLCanvasElement, shape: RectLikeShape, id: number) {
    super(canvas, id)
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
      layer: this.layer,
    })
    this.shader = this.getShaderByShape()
    this.position = this.buffers.vertex.position
    this.uniqueProps = {
      id: this.id,
      uColor: this.uColor,
    }
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
  getColor() {
    return this.uColor
  }
  updateColor(color: number[]) {
    this.uColor = color
    this.uniforms.set('uColor', color)
  }

  updateUniform(uniform: string, value: any) {
    this[uniform] = value
    this.uniqueProps[uniform] = value
    this.uniforms.set(uniform, this[uniform])
  }

  updateRectMarkProps<T extends Omit<Partial<MarkProps>, 'id'>>(props: T) {
    for (const key in props) {
      const element = props[key]
      if (key !== 'id') {
        //console.log('key:', element)
        this.updateUniform(key, element as any)
      }
    }
  }
  updateUniqueProps<T extends Omit<Partial<MarkProps>, 'id'>>(uniqueProps: T) {
    this.updateRectMarkProps(uniqueProps)
  }
  updateFromRemote<T extends SpiritsAction>(
    action: T,
    actionType: SpiritsActionLiteral,
  ) {
    if (actionType === 'Model') {
      this.updateModel(action as Model)
    } else {
      this.updateUniqueProps(action as MarkProps)
    }
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
    this.spiritType = 'Mosaic'
    const buffers = this.getBuffersByShape(type)
    this.position = buffers.vertex.position
    this.vertexBuffers = this.beam.resource(VertexBuffers, buffers.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, buffers.index)
    this.shader = this.beam.shader(this.getShaderByShape(type))
    this.uniforms = this.beam.resource(Uniforms, {
      transMat: this.transMat,
      rotateMat: this.rotateMat,
      scaleMat: this.scaleMat,
      projectionMat: this.projectionMat,
      layer: this.layer,
    })
    this.updateGuidRect()
  }
  getShaderByShape(type: MosaicType) {
    let shader: any
    if (type === 'multi') {
      shader = MosaicMultiShader
    } else if (type === 'frac') {
      shader = MosaicFracShader
    } else if (type === 'snow') {
      shader = MosaicSnowShader
    }
    return shader
  }
  getBuffersByShape(type: MosaicType): Buffers {
    let buffers: any
    buffers = createMosaic(300, 300)
    return buffers
  }

  updateFromRemote<T extends SpiritsAction>(
    action: T,
    actionType: SpiritsActionLiteral,
  ) {
    if (actionType === 'Model') {
      this.updateRectModel(action as Model)
      //} else {
      //this.updateRectMarkProps(action as MarkProps)
    }
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
export class CircleLikeSpirit extends BeamSpirit {
  protected radius: number
  protected uColor: number[]
  protected projectionX: number
  protected projectionY: number
  protected uniqueProps: CircleProps = {
    id: -1,
    radius: 200,
    uColor: [1, 1, 1, 1],
    //centerX:0,
    //centerY:0
  }
  constructor(canvas: HTMLCanvasElement, id: number) {
    super(canvas, id)
    this.spiritType = 'Mark'
    this.radius = 200
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
      layer: this.layer,
    })
    this.shader = this.beam.shader(circleShader)
    this.updateGuidRect()
  }
  updateGuidRect() {
    this.guidRect = updateCircle(this.radius, this.offset, this.scale)
  }
  updateCircleModel<T extends Partial<Model>>(model: T) {
    if (model.scale) this.updateScaleMat(model.scale)
    if (model.rotate) this.updateRotateMat(model.rotate)
    if (model.trans) this.updatePosition(model.trans)
    if (model.layer) this.updateLayer(model.layer)
    //this.updateGuidRect()
  }

  updateUniform(uniform: string, value: any) {
    this[uniform] = value
    this.uniqueProps[uniform] = value
    this.uniforms.set(uniform, this[uniform])
  }
  updatePosition(distance: Pos = { left: 0, top: 0 }) {
    this.offset = { ...distance }
    this.model.trans = this.offset
    this.uniforms.set('centerX', this.offset.left)
    this.uniforms.set('centerY', this.offset.top)
    this.updateGuidRect()
  }
  updateScaleMat(scale: number) {
    this.scale = scale
    this.updateUniform('scale', this.scale)
    this.uniforms.set('rotate', this.rotate)
  }
  updateRotateMat(value: number) {
    this.rotate = value
    this.uniforms.set('rotate', this.rotate)
  }
  updateModel<T extends Partial<Model>>(model: T) {
    this.updateCircleModel(model)
  }

  updateUniqueProps<T extends Partial<CircleProps>>(uniqueProps: T) {
    for (const key in uniqueProps) {
      const element = uniqueProps[key]
      this.updateUniform(key, element)
    }
  }

  updateFromRemote<T extends SpiritsAction>(
    action: T,
    actionType: SpiritsActionLiteral,
  ) {
    if (actionType === 'Model') {
      this.updateModel(action as Model)
    } else {
      this.updateUniqueProps(action as CircleProps)
    }
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
export class CircleSpirit extends CircleLikeSpirit {
  constructor(canvas: HTMLCanvasElement, id: number) {
    super(canvas, id)
  }
}
export class SolidCircleSpirit extends CircleLikeSpirit {
  constructor(canvas: HTMLCanvasElement, id: number) {
    super(canvas, id)
    this.spiritType = 'Mark'
    this.radius = 20
    const xy = createProjectionXY(getCanvasEdge(this.canvas))
    this.projectionX = xy.x
    this.projectionY = xy.y
    const circle = createSolidCircle()
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
      layer: this.layer,
    })
    this.shader = this.beam.shader(solidCircleShader)
    this.updateGuidRect()
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
export class userNames {
  beam: Beam
  user: User
  canvas: HTMLCanvasElement
  constructor(canvas: HTMLCanvasElement, user: User) {
    this.canvas = canvas
    this.user = user
  }
}
export class BackgroundSpirit extends BeamSpirit {
  uColor: number[]
  backShader: object
  backUniforms: object
  backType: 'image' | 'nonImage'
  constructor(canvas: HTMLCanvasElement, id: number) {
    super(canvas, id)
    this.isToggle = false
    //this.isToggle = true
    this.spiritType = 'Background'
    const back = createBackGrid()
    this.layer = 0.8
    this.model.layer = this.layer
    this.vertexBuffers = this.beam.resource(VertexBuffers, back.vertex)
    this.indexBuffer = this.beam.resource(IndexBuffer, back.index)
  }
  setBackground(shader: any, uniforms: UniformsResource) {
    //this.shader = this.beam.shader(shader)

    //this.uniforms = this.beam.resource(Uniforms,uniforms)
    throw new Error('not implemented')
  }

  render() {
    this.beam
      .clear()
      .depth()
      .draw(
        this.shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.uniforms as any,
      )
  }
}
export class BackImageSpirit extends BackgroundSpirit {
  textures: TexturesResource
  image: HTMLImageElement
  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    super(canvas, 0)
    this.backType = 'image'
    this.shader = this.beam.shader(backImageShader)
    this.textures = this.beam.resource(Textures)
    this.image = image
    this.textures.set('img', { image: this.image, flip: true })
  }
  render() {
    this.beam
      .clear()
      .depth()
      .draw(
        this.shader,
        this.vertexBuffers as any,
        this.indexBuffer as any,
        this.textures as any,
      )
  }
}
export class BackNonImageSpirit extends BackgroundSpirit {
  shaderName: string
  constructor(canvas: HTMLCanvasElement) {
    super(canvas, 0)
    this.backType = 'nonImage'
    this.spiritType = 'BackNonImage'
  }
  updateUniform(uniform: string, value: number) {
    this.uniqueProps[uniform] = value
    this.uniforms.set(uniform, value)
  }
  setShaderName(shaderName: string) {
    this.shaderName = shaderName
  }
  getShaderName() {
    return this.shaderName
  }
  setShader(shader: any, uniforms: any) {
    this.shader = this.beam.shader(shader)
    this.uniforms = this.beam.resource(Uniforms, uniforms)
    this.uniqueProps = this.uniforms.state as any
    this.uniqueProps.id = 0
    this.updateUniqueProps(uniforms)
  }
  updateUniqueProps(uniqueProps: object) {
    for (const key in uniqueProps) {
      const element = uniqueProps[key]
      this.updateUniform(key, element)
    }
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
const updateContainer = (offset:Pos,width:number,height:number,scale:number) => {
  return {
    x: offset.left*scale,
    y: offset.top*scale,
    width:  width*scale,
    height:  height*scale
  }
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
