import { Button, Card, Col, Row, Upload } from 'antd'
import React, { useState } from 'react'
import useSWR from 'swr'
import { useNavigate, useParams } from 'react-router-dom'
import { ax, baseUrl, createCanvas, getSpirits } from '../../utils/http'
import { createW } from '../../utils/geo-utils'
const fetcher = (url: string) => fetch(url, {}).then((res) => res.json())
const url = baseUrl + '/collaboration/mine/?user_id='
type CollaborationDB = {
  id: number
  canvas_id: number
  owner_id: number
  collaborator_id: number
}
export function IPaticipate() {
  const { id } = useParams()
  const [canvasUrl, setCanvasUrl] = useState(url + id)
  const { data, error } = useSWR(canvasUrl, fetcher)
	console.log(data)
  const navi = useNavigate()
  if (!data) return <div>loading</div>
  const goCanvas = (id: number) => () => {
    navi(`/canvas/${id}`)
  }
  //const canvases = JSON.parse(data)
  return (
    <div>
      <Row>
        {data.map((item: CollaborationDB, index: number) => (
          <Col span={8} key={index}>
            <Card
              onClick={goCanvas(item.canvas_id)}
              hoverable
              className="mt-4"
              style={{ width: 240, height: 160 }}
              cover={<img alt="example" src="../../../public/test.jpg" />}
            >
              <h1>canvasId:{item.canvas_id}</h1>
              <h1>ownerId:{item.owner_id}</h1>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

