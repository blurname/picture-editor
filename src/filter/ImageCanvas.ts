import { Beam, ResourceTypes } from 'beam-gl'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { renderImage } from './saturationShader'
import { createRectangle } from '../utils/geo-utils'
type Props = {
  imgSrc?: string
  width?: number
  height?: number
  canvas: MutableRefObject<HTMLCanvasElement>
}
type ImageProp = {
	id:number
	position:number[]
} 
export function ImageCanvas(props: Props) {
  const {
    imgSrc = '../../public/t2.jpg',
    width = 100,
    height = 100,
    canvas,
  } = props
  const init = () => {
    const beam = new Beam(canvas.current)
		console.log(canvas.current.getContext('webgl'))
    const shader = beam.shader(renderImage)
		const imagesT:ImageProp[] = []
    const quad = createRectangle(-0.5)
		imagesT.push({id:1,position:quad.vertex.position})
    const quad2 = createRectangle(0.5)
		imagesT.push({id:2,position:quad2.vertex.position})

    console.log(quad.vertex.position)
    console.log(quad2.vertex.position)
    const vertexBuffers = beam.resource(
      ResourceTypes.VertexBuffers,
      quad.vertex,
    )
    const vertexBuffers2 = beam.resource(
      ResourceTypes.VertexBuffers,
      quad2.vertex,
    )

    const indexBuffer = beam.resource(ResourceTypes.IndexBuffer, quad.index)
    const indexBuffer2 = beam.resource(ResourceTypes.IndexBuffer, quad2.index)

    const textures = beam.resource(ResourceTypes.Textures)
    const image = new Image(100,100)
    image.src = imgSrc
		console.log(image.src);
    textures.set('img', { image, flip: true })
    beam
      .clear()
      .draw(shader, vertexBuffers as any, indexBuffer as any, textures as any)
      .draw(shader, vertexBuffers2 as any, indexBuffer2 as any, textures as any)
    // console.log(canvas.current.nextSibling.src);
  }
    init()
}
