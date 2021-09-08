import React, {createContext} from 'react'
import { Canvas, SpiritsCanvas } from './store/globalCanvas'
type globalCanvasType = {
	spiritCanvas:SpiritsCanvas
  cmpCount: number
  setCmpCount: React.Dispatch<React.SetStateAction<number>>
	selectNum:number
  setSelectNum: React.Dispatch<React.SetStateAction<number>>
	adjustNum:number
  setAdjustNum: React.Dispatch<React.SetStateAction<number>>
}
export const globalContext = React.createContext({} as globalCanvasType)
