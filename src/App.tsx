import React, { MouseEvent, useState } from 'react'
import './App.css'
import { Editor } from './layout/Editor'
import { Canvas } from './layout/Canvas'
import { Components } from './layout/Components'
import { globalContext } from './context'
import { globalCanvas } from './store/globalCanvas'
import {Pos} from './utils/geo-utils'
function App() {
  const [cmpCount, setCmpCount] = useState(0)
  const [selectNum, setSelectNum] = useState(0)
  const [adjustNum, setAdjustNum] = useState(0)
  const handleOnMouseMove = (e:MouseEvent) => {
    console.log('x' + e.pageX)
    console.log('y' + e.pageY)
		const cursor:Pos = {
			left:e.clientX,
			top:e.clientY,
		}
  }
  return (
    <div className="App" style={{backgroundColor:'gray'}}>
      <h1>picture editor</h1>
      <div className="Container">
        <globalContext.Provider
          value={{
            globalCanvas,
            cmpCount,
            setCmpCount,
            selectNum,
            setSelectNum,
            adjustNum,
            setAdjustNum,
          }}
        >
          <Components />
          <Canvas />
          <Editor />
        </globalContext.Provider>
      </div>
    </div>
  )
}

export default App
