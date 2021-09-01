import React, { useState } from 'react'
import './App.css'
import { Editor } from './layout/Editor'
import { Canvas } from './layout/Canvas'
import { Components } from './layout/Components'
import { globalContext } from './context'
import { globalCanvas } from './store/globalCanvas'
function App() {
const [cmpCount,setCmpCount] = useState(0)
const [selectNum,setSelectNum] = useState(0)
  return (
    <div className="App">
      <h1>picture editor</h1>
      <div className="Container">
        <globalContext.Provider value={{globalCanvas,cmpCount,setCmpCount,selectNum,setSelectNum}}>
          <Components />
          <Canvas />
          <Editor />
        </globalContext.Provider>
      </div>
    </div>
  )
}

export default App
