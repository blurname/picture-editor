import { Button, Card, Col, Row, Upload } from 'antd'
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
import { baseUrl, createCanvas, getSpirits } from '../../utils/http'
import { createW } from '../../utils/geo-utils'
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
  const goCanvas = (id: number) => () => {
    history.push(`/canvas/${id}`)
  }
  const createNewCanvas = async () => {
    const id = await createCanvas(24)
    console.log('id:', id)
    goCanvas(id)()
  }
  const uploadImage = () => {
    return
  }
  const uploadProps = {
    name: 'img',
    action: baseUrl + '/image/upload',
  }
  const canvases = JSON.parse(data)
  return (
    <div>
      <Button type="primary" onClick={createNewCanvas}>
        new
      </Button>
      <Button type="primary" onClick={() => getSpirits(829)}>
        get
      </Button>
      <Upload>
        <div>
          <Button type="primary" onClick={() => getSpirits(829)}>
            upload Imag
          </Button>
        </div>
      </Upload>
      <Row>
        {canvases.map((item: CanvasDB, index: number) => (
          <Col span={8} key={index}>
            <Card
              onClick={goCanvas(item.id)}
              hoverable
              className="mt-4"
              style={{ width: 240, height: 160 }}
              cover={<img alt="example" src="../../../public/test.jpg" />}
            >
              <h1>{item.id}</h1>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
