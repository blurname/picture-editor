import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import {Socket} from 'socket.io-client';
export type User={
	id:number
	name:string
}
export function useUsers(socket:Socket,adjustNum:number){
	const [users, setUsers] = useState([] as User[]);
	useEffect(() => {
		socket.on('client-users', (u:string) => {
			console.log('new users',u)
			const map = jsonToMap(u)
			const newUsers = [] as User[]
			for (const iterator of map.keys()) {
				console.log('users map',map.get(iterator))
				const value = map.get(iterator) as {id:number}
				newUsers.push({id:value.id,name:'user'+value.id})
			}
			setUsers(newUsers)
		})
		socket.on('client-who-controll', (userId:number,selectNum)=>{
			console.log(`${userId} controll: ${selectNum}`)
		})
	},[]);
	return {users}
}
const jsonToMap = (json:string) => {
	return new Map(JSON.parse(json))
}
