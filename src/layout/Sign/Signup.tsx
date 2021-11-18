import {message} from 'antd'
import React, { useState, ChangeEvent } from 'react'
import {ax, baseUrl} from '../../utils/http'
const signUpUrl = baseUrl+'/signup' 
export function Signup() {
  const [name, setName] = useState('')
  const [passwd, setPasswd] = useState('')
  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const changePasswd = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswd(e.target.value)
  }

	const signUp = async () => {
		const res = await ax.post(
			`/user/signup/?name=${name}&password=${passwd}`,
		)
		if(res.data === null){
			message.error('the name is duplicated')
		}else{
			message.success('sing up successfully')
		}
		console.log(res.data)
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
        <button onClick={signUp} className="bg-blue-300 w-lg h-30 text-8xl align-top">sign up</button>
      </div>
    </div>
  )
}
