import React,{useState,useEffect, createFactory} from 'react'
import { ax } from '../utils/http';
type User={
  name:string
  passwd:string
}
export async function useSignedUser(userId:number){
  const userInfo:User =  await ax.get(
    `/user/get_info_from_id/?id=${userId}`,
  )
  const [user, setUser] = useState(userInfo)
  return [user]
}