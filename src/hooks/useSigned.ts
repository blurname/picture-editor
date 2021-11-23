import React, { useState, useEffect, createFactory, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../context'
import { ax } from '../utils/http'
import { User } from './useUsers'
export function useSigned() {
  //const userInfo:User =  await ax.get(
  //`/user/get_info_from_id/?id=${userId}`,
  //)
  const { userId, setUserId } = useContext(userContext)
  const [user, setUser] = useState<User>(undefined)
  const signout = () => {
    localStorage.clear()
    setUserId(undefined)
    navigate('/signin')
    setUser(undefined)
  }

  const navigate = useNavigate()
  useEffect(() => {
    const name = localStorage.getItem(userId + '')
    const userInfo = { id: userId, name }
    setUser(userInfo)
		console.log('setUser',user)
  }, [userId])
  return { user, signout }
}

export function useUserId() {
  const [userId, setUserId] = useState()
}

