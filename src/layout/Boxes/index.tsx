import { Button, Card, Col, Row, Upload } from 'antd'
import Meta from 'antd/lib/card/Meta'
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent,
} from 'react'
import useSWR from 'swr'
import { useNavigate } from 'react-router-dom'
import { ax, baseUrl, createCanvas, getSpirits } from '../../utils/http'
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
  const [file, setFile] = useState({} as File)
	const navi = useNavigate()
  if (!data) return <div>loading</div>
  //console.log(JSON.parse(data) )
	const goCanvas = (id: number) => () => {
		//history.push(`/canvas/${id}`)
		navi(`/canvas/${id}`)
	}
  const createNewCanvas = async () => {
    const id = await createCanvas(24)
    goCanvas(id)()
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
			<Button type="primary" onClick={() => getSpirits(829)}>
				get
			</Button>
			<div>
				<Upload {...uploadProps}>
					<Button type="primary" onClick={() => getSpirits(829)}>
						upload Imag
					</Button>
				</Upload>
			</div>
			<div>
				<input onChange={changeRaw} type="file" />
				<h3>{file.name}</h3>
				<button onClick={uploadRaw}>upload raw</button>
			</div>
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
