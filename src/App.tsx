import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './App.css'
import layer, { Content, Footer, Header } from 'antd/lib/layout/layout'
import { Boxes } from './layout/Boxes'
import { Layout } from './layout'
function App() {
  return (
    <div className="App h-full">
        <Header className="bg-green-100">
          <h1 className="text-blue-gray-900 font-large">picture editor</h1>
        </Header>
        <Router>
          <Route exact path="/canvas/:id">
            <Layout />
          </Route>
          <Route exact path="/">
            <Boxes />
          </Route>
        </Router>
        <Footer className="bg-green-200" />
    </div>
  )
}
export default App
