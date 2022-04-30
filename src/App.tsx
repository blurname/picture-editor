import React, { useEffect, useRef, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
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
import { userContext } from './context'
import {Invite} from './layout/User/Invite'
function App() {
  const [userId, setUserId] = useState()
  return (
    <Router>
      <div className="App h-full">
        <Header className="bg-green-100">
          {/* <h1 className="text-blue-gray-900 font-large">picture editor</h1> */}
          <userContext.Provider
            value={{
              userId,
              setUserId,
            }}
          >
            <Head />
          </userContext.Provider>
        </Header>
        <div className="h-full">
          <Routes>
            <Route
              path="/canvas/:id"
              element={
                <userContext.Provider
                  value={{
                    userId,
                    setUserId,
                  }}
                >
                  <Layout />
                </userContext.Provider>
              }
            />
            <Route path="/boxes/:id" element={<Boxes />} />
            <Route
              path="/signin/:rn"
              element={
                <userContext.Provider
                  value={{
                    userId,
                    setUserId,
                  }}
                >
                  <Signin />
                </userContext.Provider>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/usercenter"
              element={
                <userContext.Provider
                  value={{
                    userId,
                    setUserId,
                  }}
                >
                  <Center />
                </userContext.Provider>
              }
            >
              <Route path="boxes/:id" element={<Boxes />} />
              <Route
                path="ipaticipate/:id"
                element={
                  <userContext.Provider
                    value={{
                      userId,
                      setUserId,
                    }}
                  >
                    <IPaticipate />
                  </userContext.Provider>
                }
              />
              {/* <Route
                path="invite/:id"
                element={
                  <userContext.Provider
                    value={{
                      userId,
                      setUserId,
                    }}
                  >
                    <Invite />
                  </userContext.Provider>
                }
              /> */}
            </Route>
          </Routes>
        </div>
        <Footer className="bg-green-100" />
      </div>
    </Router>
  )
}
export default App
