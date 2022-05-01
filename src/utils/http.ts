import axios from 'axios'
export const baseUrl = 'http://localhost:30001'
export const wsbaseUrl = 'ws://localhost:30000'
export const ax = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  //timeout:1000
})
export const createCanvas = async (ownerId: number) => {
  try {
    const res = await ax.post(
      '/canvas/create',
      JSON.stringify({ ownerId: ownerId }),
    )
    //const res = await postData('http://localhost:30001/canvas/create',{ownerId:ownerId})
    const json = res.data
    const id = JSON.parse(json).id
    return id
  } catch (err) {
    console.error(err)
  }
}
export const getSpirits = async (id: number) => {
  try {
    const res = await ax.get(`/canvas/get_spirits/?canvas_id=${id}`)
    const data = res.data
    return data
  } catch (err) {}
}
export const getOneSpirit  = async (id:number,pcId:number) => {
  const res = await ax.get(`/canvas/get_one_pointcontainer/?canvas_id=${id}&canvas_spirit_id=${pcId}`)
  const data = res.data
  return data
}
export const getIsHavingSpirits = async (id: number): Promise<number> => {
  try {
    const res = await ax.get(`/canvas/get_is_having_spirits/?canvas_id=${id}`)
    const data = res.data
    return data
  } catch (err) {}
}

export const getCanvasUrl = (img: any) => {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const dataurl = canvas.toDataURL()
  return dataurl
}

export const getPoints = async(spiritId:number)=>{
  try {
    const res = await ax.get(`/canvas/get_point/?spirit_id=${spiritId}`)
    const data = res.data as any[]
    console.log('points',data)
    const points = data.map((point) => {
      return {
        left:point.left,
        top:point.top
      }
    })
    return points
  } catch (err) {
    
  }
}
