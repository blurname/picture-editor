import React, { useState, useEffect, useRef } from 'react'
import { Editor } from '../layout/Editor'
import { Canvas } from '../layout/Canvas'
import { Components } from '../layout/Components'
import { globalContext } from '../context'
import { SpiritCanvas, OperationHistory } from '../store/globalCanvas'
import { ax } from '../utils/http'
import { useCanvas } from '../hooks/useCanvas'
import { useParams } from 'react-router-dom'
console.log('canvaseditor')
export function CanvasEditor() {
	const { id } = useParams()
  const [cmpCount, setCmpCount] = useState(0)
  const [selectNum, setSelectNum] = useState(-1)
  const [adjustNum, setAdjustNum] = useState(0)
  const [zoomable, setZoomable] = useState(false)
	//const [, set] = useState();
	const spiritCanvas = useCanvas(24,id)
	//const spiritCanvasRef = useRef(new SpiritsCanvas(24,ax));
	//const spiritCanvas = spiritCanvasRef.current
	//spiritCanvas.setCanvas()
  //const [spiritCanvas, setSpiritCanvas] = useState( );
	const [operationHistory, setOperationHistory] = useState(
		new OperationHistory(spiritCanvas, ax),
	)
	console.log(operationHistory.lens)
  useEffect(() => {
    console.log('spiritCanvas.id:', spiritCanvas.id)
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
