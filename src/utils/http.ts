import axios from 'axios'
export const ax = axios.create({
	baseURL:'http://localhost:30001',
	headers:{
        'Content-Type': 'application/json'
	}
})
