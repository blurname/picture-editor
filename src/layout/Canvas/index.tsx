import React, { useContext } from 'react'
import { globalContext } from '../../context'
import { CanvasWrapper } from './CanvasWrapper'
import {} from './index.css'
export function Canvas() {
	const {globalCanvas,cmpCount,setCmpCount} = useContext(globalContext)
  return (
    <div className="Canvas">
				<div>Canvas</div>
				<div>cmpCount:{cmpCount}</div>
      <div>
        {globalCanvas.cmps.map((cmp,index) => (
          <CanvasWrapper key={index.toString()}
					img={{style:{width:100,height:100},value:cmp.value}} />
        ))}
      </div>
    </div>
  )
}
