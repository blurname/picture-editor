import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './App.css'
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout'
import { Boxes } from './layout/Boxes'
import { CanvasEditor } from './layout/CanvasEditor'
function App() {
  return (
      <div className="App h-max">
        <Header className="bg-green-100">
          <h1 className="text-blue-gray-900 font-large">picture editor</h1>
        </Header>
            <CanvasEditor />
        <Footer className="bg-green-200" />
      </div>
  )
}
export default App
