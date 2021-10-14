import React, { useState, useEffect, useRef } from 'react'
import { Editor } from '../layout/Editor'
import { Canvas } from '../layout/Canvas'
import { Components } from '../layout/Components'
import { globalContext } from '../context'
import { spiritCanvas, operationHistory } from '../store/globalCanvas'
import { ax } from '../utils/http'
import { useCanvas } from '../hooks/useCanvas'
console.log('canvaseditor')
export function CanvasEditor() {
  const [cmpCount, setCmpCount] = useState(0)
  const [selectNum, setSelectNum] = useState(-1)
  const [adjustNum, setAdjustNum] = useState(0)
  const [zoomable, setZoomable] = useState(false)
  //const spiritCanvas = useCanvas(24)
  //const spiritCanvasRef = useRef(new SpiritsCanvas(24,ax));
  //const spiritCanvas = spiritCanvasRef.current
  //const [spiritCanvas, setSpiritCanvas] = useState( );
	//const [operationHistory, setOperationHistory] = useState(
		//new OperationHistory(spiritCanvas, ax),
	//)
  //let spiritCanvas: SpiritsCanvas
  //let operationHistory: OperationHistory
  useEffect(() => {
    console.log('canvascreated')
  })
  return (
    <div className="flex">
      <globalContext.Provider
        value={{
          cmpCount,
          setCmpCount,
          selectNum,
          setSelectNum,
          adjustNum,
          setAdjustNum,
          spiritCanvas,
          zoomable,
          setZoomable,
          operationHistory,
        }}
      >
        <Components />
        <Canvas />
        <Editor />
      </globalContext.Provider>
    </div>
  )
}
