import axios from 'axios'
export const ax = axios.create({
  baseURL: 'http://localhost:30001',
  headers: {
    'Content-Type': 'application/json',

  },
	//timeout:1000
})
export const createCanvas = async (ownerId: number) => {
  console.log('createpost')
  //try {
  console.log('posting')
		const res = await ax.post(
			'/canvas/create',
			JSON.stringify({ ownerId: ownerId }),
		)
		//const res = await postData('http://localhost:30001/canvas/create',{ownerId:ownerId})
    console.log('afterpost')
		console.log(res)

		const json = res.data
		const id = JSON.parse(json).id
    console.log(id)
    return id
  //} catch (err) {
		//console.error(err);
	//}
}
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
