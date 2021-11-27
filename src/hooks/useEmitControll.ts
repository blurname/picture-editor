import React, { useState, useEffect, useCallback, useMemo, MutableRefObject } from 'react'
import { Socket } from 'socket.io-client'
import { clearRectBorder, drawNames, drawRectBorder } from '../utils/geo-utils'
import { BeamSpirit } from '../utils/gl-uitls'
export type Controller = {
  id: number
  spiritId: number
}
export function useController(
  socket: Socket,
  canvasId: number,
  userId: number,
  selectNum: number,
  canvas2d: MutableRefObject<HTMLCanvasElement>,
  images: BeamSpirit[],
) {
  const [controller, setController] = useState(new Map<number, number>())
  const [controllerList, setControllerList] = useState<Controller[]>([])
  //const renderController = useCallback(() => {
    //if (canvas2d.current === undefined) return
    //clearRectBorder(canvas2d.current)
    //for (let i = 0; i < controllerList.length; i++) {
      //const selectId = controllerList[i].spiritId
      //if (selectId !== -1) {
        //drawRectBorder(canvas2d.current, images[selectId].getGuidRect())
        //drawNames(canvas2d.current, images[selectId].getGuidRect(), {
          //id: controllerList[i].id,
          //name: 'baolei',
        //})
        ////if (!zoomable && !isMoveable)
        ////spiritCanvas.setChosenType(images[curImage].getSpiritType())
      //}
    //}
  //}, [controllerList, canvas2d,images])
  useEffect(() => {
    socket.on('client-who-controll', (userId: number, selectNum) => {
      console.log(`${userId} controll: ${selectNum}`)
      const newControllerList = [] as Controller[]
      controller.set(userId, selectNum)
      for (const iterator of controller.keys()) {
        console.log('users map', controller.get(iterator))
        const value = controller.get(iterator)
        newControllerList.push({ id: iterator, spiritId: value })
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
      newControllerList.push({ id: iterator, spiritId: value })
    }
    setControllerList(newControllerList)
  }, [selectNum])
  return { controllerList,  }
}
