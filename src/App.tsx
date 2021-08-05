import React, { useState } from 'react'
import './App.css'
import { Editor } from './layout/Editor'
import { Canvas } from './layout/Canvas'
import { Components } from './layout/Components'

function App() {
  return (
    <div className="App">
      <h1>picture editor</h1>
      <div className="Container">
        <Canvas />
        <Editor />
        <Components />
      </div>
    </div>
  )
}

export default App
