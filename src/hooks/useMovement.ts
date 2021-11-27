import React, { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { SpiritCanvas } from '../store/globalCanvas'
import { BeamSpirit } from '../utils/gl-uitls'
export function useMovement(
  socket: Socket,
  images: BeamSpirit[],
  spiritCanvas: SpiritCanvas,
  //renderController: (context: HTMLCanvasElement) => void,
  renderController: () => void,
  //context: HTMLCanvasElement,
) {
  useEffect(() => {
    socket.on('client-move', (spiritId: number, distance: Pos) => {
      console.log('move', spiritId, distance)
      images[spiritId].updatePosition(distance)
      spiritCanvas.updateGuidRect(images[spiritId])
      for (let i = 0; i < images.length; i++) {
        if (images[i] !== null) {
          images[i].render()
          ////if (!zoomable && !isMoveable)
          ////spiritCanvas.setChosenType(images[curImage].getSpiritType())
          //}
        }
      }
      renderController()

      spiritCanvas.renderAllLine()
    })
    return () => {
      socket.removeListener('client-move')
    }
  }, [renderController])
}
