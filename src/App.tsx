import React, { useState } from 'react'
import './App.css'
import { Editor } from './layout/Editor'
import { Canvas } from './layout/Canvas'
import { Components } from './layout/Components'
import { globalContext } from './context'
import { spiritCanvas } from './store/globalCanvas'
function App() {
  const [cmpCount, setCmpCount] = useState(0)
  const [selectNum, setSelectNum] = useState(0)
  const [adjustNum, setAdjustNum] = useState(0)

  return (
    <div className="App" style={{ backgroundColor: '' }}>
      <h1>picture editor</h1>
      <div className="Container">
        <globalContext.Provider
          value={{
            cmpCount,
            setCmpCount,
            selectNum,
            setSelectNum,
            adjustNum,
            setAdjustNum,
            spiritCanvas,
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
