import { Button, Card, Col, Row } from 'antd'
import Meta from 'antd/lib/card/Meta'
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import useSWR from 'swr'
import { useHistory } from 'react-router-dom'
const fetcher = (url: string) => fetch(url, {}).then((res) => res.json())
const url = 'http://localhost:30001/canvas/get/?ownerid=24'
type CanvasDB = {
  id: number
  owner_id: number
  create_at: number
}
export function Boxes() {
  const { data, error } = useSWR(url, fetcher)
  const history = useHistory()
  if (!data) return <div>loading</div>
  //console.log(JSON.parse(data) )
  const goCanvas = () => {
    history.push('/canvas-editor')
  }
  const canvases = JSON.parse(data)
  return (
    <div>
      <Row>
        {canvases.map((item: CanvasDB, index: number) => (
          <Col span={8} key={index}>
            <Card
              onClick={goCanvas}
              hoverable
              className="mt-4"
              style={{ width: 240, height: 360 }}
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <h1>{item.id}</h1>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
