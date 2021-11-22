import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import './App.css'
import layer, { Content, Footer, Header } from 'antd/lib/layout/layout'
import { Boxes } from './layout/Boxes'
import { Layout } from './layout'
import { Signin } from './layout/Sign/Signin'
import { Signup } from './layout/Sign/Signup'
import { Center } from './layout/User/Center'
import { Head } from './layout/Head'
import { IFound } from './layout/User/IFound'
import { IPaticipate } from './layout/User/IPaticipate'
function App() {
  return (
    <Router>
      <div className="App h-full">
        <Header className="bg-green-100">
          {/* <h1 className="text-blue-gray-900 font-large">picture editor</h1> */}
          <Head />
        </Header>
        <div className="h-full">
          <Routes>

						<Route path="/canvas/:id" element={<Layout />}/>
            {/* <Route  path="/canvas/:id"
            element ={<Layout />}/>
          <Route  path="/boxes"
            element = {<Boxes />}/>*/}
						<Route path="/boxes" element={<Boxes/>}/>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/usercenter" element={<Center />}>
              <Route path="ifound" element={<IFound />} />
              <Route path="ipaticipate" element={<IPaticipate />} />
            </Route>
          </Routes>
        </div>
        <Footer className="bg-green-200" />
      </div>
    </Router>
  )
}
export default App
