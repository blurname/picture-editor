import axios from 'axios'
export const baseUrl = 'http://localhost:30001'
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
		console.error(err);
	}
}
export const getSpirits = async (id:number) => {
	try {
		const res = await ax.get(
			`/canvas/get_spirits/?canvas_id=${id}`,
		)
			const data = res.data
			return data
	} catch (err) {
		
	}
}
export const getIsHavingSpirits = async (id:number):Promise<number> => {
	try {
		const res = await ax.get(
			`/canvas/get_is_having_spirits/?canvas_id=${id}`
		)
		const data = res.data
		return data
	} catch (err) {
		
	}
}

