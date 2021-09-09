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
} from '../filter/saturationShader'
import { depthCommand, Offscreen2DCommand } from './command'
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
  textures: TexturesResource
  uniforms: UniformsResource
  canvas: HTMLCanvasElement
  zOffset: number
  scaleMat: number[]
  transMat: number[]
  rotateMat: number[]
  baseResources: Resource[]

  targets: OffscreenTargetResource[]
  inputTextures: TexturesResource
  outputTextures: TexturesResource[]

  hue: number
  saturation: number
  vignette: number
  brightness: number
  contrast: number

  shader: Shader
  brightnessContrastShader: Shader
  hueSaturationShader: Shader
  vignetteShader: Shader
  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    const quad = createRectangle(0)
    this.image = image
    this.canvas = canvas
    this.beam = new Beam(canvas)
    this.beam.define(depthCommand)
    this.beam.define(Offscreen2DCommand)

    this.shader = this.beam.shader(basicImageShader)
    this.brightnessContrastShader = this.beam.shader(BrightnessContrast)
    this.hueSaturationShader = this.beam.shader(HueSaturation)
    this.vignetteShader = this.beam.shader(Vignette)

    this.position = quad.vertex.position
    this.prePosition = quad.vertex.position

    this.vertexBuffers = this.beam.resource(
      ResourceTypes.VertexBuffers,
      quad.vertex,
    )
    this.indexBuffer = this.beam.resource(ResourceTypes.IndexBuffer, quad.index)
    this.textures = this.beam.resource(ResourceTypes.Textures)

    this.rotateMat = createRotateMat(0)
    this.transMat = createTranslateMat(0, 0)
    this.scaleMat = createScaleMat(1, 1)
    this.uniforms = this.beam.resource(ResourceTypes.Uniforms, {
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
      this.beam.resource(ResourceTypes.Textures),
      this.beam.resource(ResourceTypes.Textures),
    ]
    this.targets = [
      this.beam.resource(ResourceTypes.OffscreenTarget),
      this.beam.resource(ResourceTypes.OffscreenTarget),
    ]
    this.outputTextures[0].set('img', this.targets[0])
    this.outputTextures[1].set('img', this.targets[1])
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
  updateRotateMat(rotate: number) {
    this.rotateMat = createRotateMat(rotate)
    this.uniforms.set('rotateMat', this.rotateMat)
  }
  updateTransMat(tx: number, ty: number) {
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
    this.beam.depth().draw(
      shader,
      this.vertexBuffers as any,
      this.indexBuffer as any,
      this.uniforms as any,
      input as any,
    )
    console.log('draw')
  }
  render() {
    //this.beam
      ////.clear()
			//.offscreen2D(this.targets[0], () => {
				//this.draw(this.brightnessContrastShader, this.textures)
			//})
			//.offscreen2D(this.targets[1], () => {
				//this.draw(this.hueSaturationShader, this.outputTextures[0])
			//})
		//this.draw(this.vignetteShader, this.outputTextures[1])
		
		this.draw(this.shader, this.textures)
  }
}
export class Filter {}
