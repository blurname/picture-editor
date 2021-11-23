import {message} from 'antd'
import React, { useState, ChangeEvent, useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import {userContext} from '../../context'
import {User} from '../../hooks/useUsers'
import {ax, baseUrl} from '../../utils/http'
const signUpUrl = baseUrl+'/signup' 
export function Signin() {
  const {setUserId }= useContext(userContext)
  const [name, setName] = useState('')
  const [passwd, setPasswd] = useState('')
	const navigate = useNavigate()
  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const changePasswd = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswd(e.target.value)
  }

	const signIn = async () => {
		const res = await ax.get(
			`/user/signin/?name=${name}&password=${passwd}`,
		)
		console.log(res)
		if (res.data===null) {
			message.error('user is not exist, mayber you input the wrong info')
		}else {
		const user = res.data as User
			message.success('sign in successfully')
			setUserId(user.id)
			localStorage.setItem('userId', user.id+'')

			localStorage.setItem(user.id+'', user.name)
			navigate(`/boxes/${user.id}`)
		}
	}
  return (
    <div>
      <div>
        <input
          onChange={changeName}
          className="bg-lime-300 w-lg h-30 text-8xl "
          type="text"
        />
      </div>
      <div>
        <input
          onChange={changePasswd}
          className="bg-cyan-300 w-lg h-30 text-8xl"
          type="text"
        />
      </div>
      <div>
        <h1>name:{name}</h1>
        <h1>passwd:{passwd}</h1>
      </div>
      <div>
        <button onClick={signIn} className="bg-blue-300 w-lg h-30 text-8xl align-top">sign in</button>
      </div>
    </div>
  )
}
