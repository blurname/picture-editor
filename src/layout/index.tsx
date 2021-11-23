import React, { useState, useEffect, useRef, useContext } from 'react'
import { Editor } from '../layout/Editor'
import { Canvas } from '../layout/Canvas'
import { Components } from '../layout/Components'
import { globalContext, userContext } from '../context'
import { SpiritCanvas, OperationHistory } from '../store/globalCanvas'
import { ax } from '../utils/http'
import { useCanvas } from '../hooks/useCanvas'
import { useParams } from 'react-router-dom'
console.log('canvaseditor')
export function Layout() {
	const { id } = useParams()
	const {userId} = useContext(userContext)
	console.log('userId:', userId)

  const [cmpCount, setCmpCount] = useState(0)
  const [selectNum, setSelectNum] = useState(-1)
  const [adjustNum, setAdjustNum] = useState(0)
  const [zoomable, setZoomable] = useState(false)
  const spiritCanvas = useCanvas(userId, parseInt(id))
  const [operationHistory, setOperationHistory] = useState(
    new OperationHistory(spiritCanvas, ax),
  )
  console.log(operationHistory.lens)
  useEffect(() => {
    console.log('spiritCanvas.id:', spiritCanvas.id)
  })
  return (
    <div className="flex h-full">
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
