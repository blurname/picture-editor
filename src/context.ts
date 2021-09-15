import React from 'react'
import {  SpiritsCanvas } from './store/globalCanvas'
type globalCanvasType = {
	spiritCanvas:SpiritsCanvas
  cmpCount: number
  setCmpCount: React.Dispatch<React.SetStateAction<number>>
	selectNum:number
  setSelectNum: React.Dispatch<React.SetStateAction<number>>
	adjustNum:number
  setAdjustNum: React.Dispatch<React.SetStateAction<number>>
	kRef:React.MutableRefObject<HTMLDivElement>
}
export const globalContext = React.createContext({} as globalCanvasType)
