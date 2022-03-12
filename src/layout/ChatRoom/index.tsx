import React, { useState, useContext, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { Button, Input } from 'antd'
import {Socket} from 'socket.io-client';
import { useSigned } from '../../hooks/useSigned'
const mockData =  [
  {userName:'user1',message:'a'},
  {userName:'user2',message:'b'},
  {userName:'user3',message:'c'},
  {userName:'user4',message:'d'}
]

type Props = {
  socket: Socket
  canvasId:number
}
export function ChatRoom(props:Props){
  const {socket, canvasId} = props
  const [inputValue, setInputValue] = useState('');
  const { user } = useSigned()
  const [messageList, setMessageList] = useState([{userName:'user1',message:'a'}]);
  const handleInput = (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const handleEmitMessage = () => {
    socket.emit('server-message',canvasId,'a',inputValue)
    setMessageList([...messageList,{userName:user.name,message:inputValue}])
  }
  useEffect(() => {
    socket.on('client-message', (userName:string, message: any) => {
      setMessageList([...messageList,{userName,message}])
    })
    return ()=>{
    socket.removeListener('client-message')
    }
  }, [messageList]);
  
  return(
  <div className="flex flex-col">
  <h3>同時在線人數</h3>
     <div className="bg-cyan-100 overflow-auto h-2xl" style={{width:300}}>
     {
     messageList.map((data) => (
     <div className="flex flex-col">
     <h2>user:{data.userName}</h2>
     <h3>message:{data.message}</h3>
     </div>
      ))
     }
     </div>
     <input type="text" className="mt-4" value={inputValue} onChange={handleInput} />
   <Button type="primary" className="mt-4" onClick={handleEmitMessage}>emit message</Button>
  </div>
  )
}
