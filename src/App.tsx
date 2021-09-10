import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { Editor } from './layout/Editor'
import { Canvas } from './layout/Canvas'
import { Components } from './layout/Components'
import { globalContext } from './context'
import { spiritCanvas } from './store/globalCanvas'
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout'
import { Col, Divider, Row } from 'antd'
import Column from 'antd/lib/table/Column'
type a = {
aa:Window
}
function App() {
  const [cmpCount, setCmpCount] = useState(0)
  const [selectNum, setSelectNum] = useState(0)
  const [adjustNum, setAdjustNum] = useState(0)


  const canvasParent = useRef(null as HTMLDivElement)
  useEffect(() => {
    console.log(canvasParent.current)
  }, [])
  return (
    <div className="App h-max">
      <Layout>
        <Header className="bg-green-100">
          <h1 className="text-blue-gray-900 font-large">picture editor</h1>
        </Header>
        <Divider />
        <div className="Container">
          <Content>
            <Row className="">
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
                <Col span={3}>
                  <Components />
                </Col>
                <Col span={18} ref={canvasParent}>
                  <Canvas canvasParentRef={canvasParent} />
                </Col>
                <Col span={3}>
                  <Editor />
                </Col>
              </globalContext.Provider>
            </Row>
          </Content>
        </div>
        <Footer className="bg-green-400" />
      </Layout>
    </div>
  )
}

export default App
