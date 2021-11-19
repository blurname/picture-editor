import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import layer, { Content, Footer, Header } from 'antd/lib/layout/layout'
import { Boxes } from './layout/Boxes'
import { Layout } from './layout'
import { Signin } from './layout/Sign/Signin'
import { Signup } from './layout/Sign/Signup'
import { Center } from './layout/User/Center'
import { Head } from './layout/Head'
function App() {
  return (
    <div className="App h-full">
      <Header className="bg-green-100">
        {/* <h1 className="text-blue-gray-900 font-large">picture editor</h1> */}
        {/* <Head/> */}
      </Header>
      <div className="h-full">
        <Router>
          {/* <Route  path="/canvas/:id"
            element ={<Layout />}/>
          <Route  path="/boxes"
            element = {<Boxes />}/>*/}
          {/* <Route  path="signin" element={<Signin />}/> */}
          <Route  path="/signin">
          <Signin />
          </Route>
          <Route  path="/signup"
            >
              <Signup/>
              </Route>
          {/* <Route  path="/usercenter"
            element = {<Center />}/> */}
        </Router>
      </div>
      <Footer className="bg-green-200" />
    </div>
  )
}
export default App
