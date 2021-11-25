import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import {Socket} from 'socket.io-client';
export type User={
	id:number
	name:string
}
export function useUsers(socket:Socket){
	const [users, setUsers] = useState(Map);
	useEffect(() => {
		socket.on('user-joined', (user) => {
			setUsers([...users,user])
		})
	}, []);
	return users
}
