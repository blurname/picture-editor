import React from 'react'
import { Canvas } from './store/globalCanvas'
type globalCanvasType = {
  globalCanvas: Canvas
  cmpCount: number
  setCmpCount: React.Dispatch<React.SetStateAction<number>>
	selectNum:number
  setSelectNum: React.Dispatch<React.SetStateAction<number>>
}
export const globalContext = React.createContext({} as globalCanvasType)
