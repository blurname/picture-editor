import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useReducer,
} from 'react'
import { io } from 'socket.io-client'
export function useSocket(URL: string, canvasId: number, userId: number) {
  const [socket, setSocket] = useState(
    io(URL, {
      transports: ['websocket'],
			autoConnect:false
    }),
  )
  useEffect(() => {
		socket.connect()
    socket.emit('server-join', canvasId, userId)

  }, [])
  return socket
}
