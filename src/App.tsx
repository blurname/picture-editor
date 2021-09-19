import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { Editor } from './layout/Editor'
import { Canvas } from './layout/Canvas'
import { Components } from './layout/Components'
import { globalContext } from './context'
import { spiritCanvas } from './store/globalCanvas'
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout'
function App() {
  const [cmpCount, setCmpCount] = useState(0)
  const [selectNum, setSelectNum] = useState(0)
  const [adjustNum, setAdjustNum] = useState(0)
  const kRef = useRef(null as HTMLDivElement)

  const canvasParent = useRef(null as HTMLDivElement)
  useEffect(() => {
    //console.log(canvasParent.current)
  }, [])
  return (
    <div className="App h-max">
      <Header className="bg-green-100">
        <h1 className="text-blue-gray-900 font-large">picture editor</h1>
      </Header>
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
            kRef,
          }}
        >
          <Components />
          <Canvas />
          <Editor />
        </globalContext.Provider>
      </div>
      <Footer className="bg-green-200" />
    </div>
  )
}

export default App
