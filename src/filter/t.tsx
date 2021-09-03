import { Beam, Resource, ResourceTypes } from 'beam-gl'
import { Texture } from './saturationShader'
import React, { useEffect, useRef } from 'react'

const basePosition = [-1, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0]
export function TCanvas() {
  const canvas = useRef(null)
  // const beam = new Beam(canvas as HTMLCanvasElement)
  const init = () => {
    const beam = new Beam(canvas.current)
    const shader = beam.shader(Texture)
    const { VertexBuffers, IndexBuffer } = ResourceTypes
    const quad = {
      vertex: {
        position: basePosition.map((i) => i * 0.4),
        color: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0.5, 0.5, 0.5],
        texCoord: [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0],
      },
      index: {
        array: [0, 1, 2, 0, 3, 1],
      },
    }

    // const vertexBuffers = beam.resource(VertexBuffers, quad.vertex)
    // const indexBuffer = beam.resource(IndexBuffer, quad.index)
    for (let i = 0; i < 3; i++) {
      const position = quad.vertex.position.map((item) => item + i * 0.1)
      console.log({
        ...quad.vertex,
        position,
      })
      const vertexBuffers = beam.resource(VertexBuffers, {
        position,
        ...quad.vertex,
      })
      const indexBuffer = beam.resource(IndexBuffer, quad.index)
      beam.draw(shader, vertexBuffers as any, indexBuffer as any)
    }
  }
  useEffect(() => {
    init()
  }, [])
  return (
	<div>
    <canvas ref={canvas}>
    </canvas>
	</div>
  )
}
