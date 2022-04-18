import React, { useState, useContext } from 'react'
import { globalContext } from '../../context'
const uploadBaseURL = 'http://localhost:7001'
import { baseUrl } from '../../utils/http'
type Props = {
  ax: any
  userId: number
  socket: any
}

export function UploadButton(props: Props) {
  const { ax, userId } = props
  const { spiritCanvas, cmpCount, setCmpCount, setAdjustNum, adjustNum } =
    useContext(globalContext)
  const addToSpirits = (imgSrc: string) => () => {
    console.log('add', imgSrc)
    spiritCanvas.addImage(imgSrc, cmpCount)
    props.socket.emit('server-add', spiritCanvas.id, 'Image', imgSrc, cmpCount)
    setCmpCount(cmpCount + 1)
    setAdjustNum(adjustNum + 1)
  }
  const changeRaw = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = new FormData()
    form.append('file', e.target.files[0])
    const res = await fetch(uploadBaseURL + '/upload', {
      method: 'POST',
      body: form,
    })
    const name = await res.text()
    const res2 = await ax.post(
      `/image/upload/?type=${1}}&owner=${userId}`,
      { name },
    )
    console.log(res2)
    const imgUrl = baseUrl + '/image/get_single/' + name
    addToSpirits(imgUrl)()
  }
  return (
    <div>
      <input onChange={changeRaw} type="file" accept='image/*' />
    </div>
  )
}