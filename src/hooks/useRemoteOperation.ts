import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react'
import { Socket } from 'socket.io-client'
import { OperationHistory } from '../store/globalCanvas'
export function useRemoteOperation(
  socket: Socket,
  operationHistory: OperationHistory,
  adjustNum: number,
  setAdjustNum: Dispatch<SetStateAction<number>>,
) {
  useEffect(() => {
    socket.on('client-editor', (spiritId: any, from: any, to: any) => {
      console.log('client-editor', spiritId, from, to)
      operationHistory.mapOperation({ id: spiritId, from, to }, false)
      setAdjustNum(adjustNum + 1)
    })

    return () => {
      socket.removeListener('client-editor')
    }
  }, [adjustNum,setAdjustNum])
}
