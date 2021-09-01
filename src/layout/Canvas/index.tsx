import React, { useContext,useEffect,useRef } from 'react'
import { globalContext } from '../../context'
import { CanvasWrapper } from './CanvasWrapper'
import {} from './index.css'
// import {render} from '../../filter/t'
import {ca} from '../../filter/t'
export function Canvas() {
	const {globalCanvas,cmpCount,setCmpCount} = useContext(globalContext)
	const canvasRef = useRef(null)
	useEffect(()=>{
	// render()
	// ca()

	},[])
  return (
    <div className="Canvas">
				<div>Canvas</div>
				<canvas ref={canvasRef}/>
				<div>cmpCount:{cmpCount}</div>
      <div style={{position:'relative'}}>
        {globalCanvas.cmps.map((cmp,index) => (
          <CanvasWrapper key={index.toString()}
					img={{style:{width:cmp.width,height:cmp.height},value:cmp.value}} />
        ))}
      </div>
    </div>
  )
}
