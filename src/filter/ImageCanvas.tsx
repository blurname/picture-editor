import { Beam, ResourceTypes } from 'beam-gl'
import React, { useEffect, useRef } from 'react'
import { renderImage } from './saturationShader'
import { createRectangle } from '../utils/geo-utils'
type Props = {
	imgSrc:string
	width:number
	height:number
}
export function ImageCanvas(props:Props) {
const {imgSrc='../../public/t2.jpg',width=100,height=100} = props
  const canvas = useRef(null as HTMLCanvasElement)
  const init = () => {
	canvas.current.height = height
	canvas.current.width = width
    const beam = new Beam(canvas.current)
    const shader = beam.shader(renderImage)
    const quad = createRectangle()
    console.log(quad)
    const vertexBuffers = beam.resource(
      ResourceTypes.VertexBuffers,
      quad.vertex,
    )
    const indexBuffer = beam.resource(ResourceTypes.IndexBuffer, quad.index)
    const textures = beam.resource(ResourceTypes.Textures)
    const image = new Image()
    image.src = imgSrc
    textures.set('img', { image, flip: true })
    beam
      .clear()
      .draw(shader, vertexBuffers as any, indexBuffer as any, textures as any)
  }
  useEffect(() => {
    init()
  })
  return <canvas ref={canvas}></canvas>
}
