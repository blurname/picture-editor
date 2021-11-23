import React, { useState, useEffect, createFactory, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {userContext} from '../context'
import { ax } from '../utils/http'
import { User } from './useUsers'
export function useSigned() {
  //const userInfo:User =  await ax.get(
  //`/user/get_info_from_id/?id=${userId}`,
  //)
	const {userId} = useContext(userContext)
	const [lUserId, setLUserId] = useState();
  const name = localStorage.getItem(lUserId)
  const userInfo = { id: parseInt(lUserId), name }
  const [user, setUser] = useState<User>(userInfo)
  const signout = () => {
    localStorage.clear()
    navigate('/signin')
    setUser(undefined)
  }

  const navigate = useNavigate()
	useEffect(() => {
		

	}, [userId]);
  return { user, signout,setLUserId }
}

export function useUserId(){
	const [userId, setUserId] = useState();

}
