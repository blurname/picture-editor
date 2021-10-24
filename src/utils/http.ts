import axios from 'axios'
export const ax = axios.create({
  baseURL: 'http://localhost:30001',
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
			console.log('data:', data)
	} catch (err) {
		
	}
}

