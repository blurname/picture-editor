import { Button, Card, Col, Row, Upload } from 'antd'
import React, { useState } from 'react'
import useSWR from 'swr'
import { useNavigate, useParams } from 'react-router-dom'
import { ax, baseUrl, createCanvas, getSpirits } from '../../utils/http'
import { createW } from '../../utils/geo-utils'
const fetcher = (url: string) => fetch(url, {}).then((res) => res.json())
const url = baseUrl + '/canvas/get/?ownerid='
type CanvasDB = {
  id: number
  owner_id: number
  create_at: number
}
export function Boxes() {
  const { id } = useParams()
  const [canvasUrl, setCanvasUrl] = useState(url + id)
  const { data, error } = useSWR(canvasUrl, fetcher)
  const [file, setFile] = useState({} as File)
  const navi = useNavigate()
  if (!data) return <div>loading</div>
  //console.log(JSON.parse(data) )
  const goCanvas = (id: number) => () => {
    //history.push(`/canvas/${id}`)
    navi(`/canvas/${id}`)
  }
  const createNewCanvas = async () => {
    const canvasId = await createCanvas(parseInt(id))
    goCanvas(canvasId)()
  }
  const uploadFormData = () => {
    ax.post(baseUrl + '/image/formdata')
  }
  const uploadProps = {
    name: 'img',
    action: baseUrl + '/image/upload',
  }
  const changeRaw = (e: any) => {
    setFile(e.target.files[0])
    const img = new Image()
    img.src = e.target.files[0]
    console.log(img)
  }
  const uploadRaw = async () => {
    const form = new FormData()
    //form.append('formImg', file)
    form.append('kkk', 'la;skjf;lasdjf;lkd')
    //ax.post(baseUrl + '/image/upload', form, {
    //headers: {
    //'Content-Type': 'application/form-data',
    //},
    //})
    const res = await fetch(baseUrl + '/image/upload', {
      method: 'POST',
      //headers: {
      //'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //},
      body: form,
    })
    console.log(res.text())
  }
  const canvases = JSON.parse(data)
  return (
    <div>
      <Button type="primary" onClick={createNewCanvas}>
        new
      </Button>
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
