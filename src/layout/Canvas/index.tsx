import React, { useContext } from 'react'
import { globalContext } from '../../context'
import { CanvasWrapper } from './CanvasWrapper'
import {} from './index.css'
export function Canvas() {
  const globalCanvas = useContext(globalContext)
  return (
    <div className="Canvas">
      Canvastypes has no overlap{' '}
      <div>
        sdf
        {globalCanvas.cmps.map((cmp) => (
          <CanvasWrapper img={{style:{width:100,height:100},value:cmp.value}} />
        ))}
      </div>
    </div>
  )
}
