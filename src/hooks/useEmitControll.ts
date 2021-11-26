import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Socket } from 'socket.io-client'
type Controller = {
  id: number
  selectId: number
}
export function useController(
  socket: Socket,
  canvasId: number,
  userId: number,
  selectNum: number,
) {
  const [controller, setController] = useState(new Map<number, number>())
  const [controllerList, setControllerList] = useState<Controller[]>([])
  useEffect(() => {
    socket.on('client-who-controll', (userId: number, selectNum) => {
      console.log(`${userId} controll: ${selectNum}`)
      const newControllerList = [] as Controller[]
      controller.set(userId, selectNum)
      for (const iterator of controller.keys()) {
        console.log('users map', controller.get(iterator))
        const value = controller.get(iterator)
        newControllerList.push({ id: iterator, selectId: value })
      }
      setControllerList(newControllerList)
    })
  }, [])
  useEffect(() => {
    socket.emit('server-controll', canvasId, userId, selectNum)
    const newControllerList = [] as Controller[]
    controller.set(userId, selectNum)
    for (const iterator of controller.keys()) {
      console.log('users map', controller.get(iterator))
      const value = controller.get(iterator)
      newControllerList.push({ id: iterator, selectId: value })
    }
    setControllerList(newControllerList)
  }, [selectNum])
  return { controllerList }
}
