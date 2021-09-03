import { Beam, ResourceTypes } from 'beam-gl'
import React, { useEffect, useRef } from 'react'
import { renderImage } from './saturationShader'
export function ImageCanvas() {
  const canvas = useRef(null as HTMLCanvasElement)
  const init = () => {
    const beam = new Beam(canvas.current)
    const shader = beam.shader(renderImage)
    const quad = {
      vertex: {
        position: [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0],
        texCoord: [0, 0, 0, 1, 1, 1, 1, 0],
      },
      index: {
        array: [0, 1, 2, 0, 2, 3],
      },
    }
    const vertexBuffers = beam.resource(
      ResourceTypes.VertexBuffers,
      quad.vertex,
    )
    const indexBuffer = beam.resource(ResourceTypes.IndexBuffer, quad.index)
    const textures = beam.resource(ResourceTypes.Textures)
    const image = new Image(300, 300)
    image.src = '../../public/t2.jpg'
    textures.set('img', { image, flip: true })
    beam.draw(shader, vertexBuffers as any, indexBuffer as any, textures as any)
  }
  useEffect(() => {
    init()
  })
  return <canvas ref={canvas}></canvas>
}
