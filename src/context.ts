import React, {Dispatch, SetStateAction} from 'react'
import {SpiritsCanvas } from './store/globalCanvas'
type globalCanvasType = {
	spiritCanvas:SpiritsCanvas
  cmpCount: number
  setCmpCount: React.Dispatch<React.SetStateAction<number>>
	selectNum:number
  setSelectNum: React.Dispatch<React.SetStateAction<number>>
	adjustNum:number
	enlargeable:boolean
	setEnlargeable:Dispatch<SetStateAction<boolean>>
  setAdjustNum: React.Dispatch<React.SetStateAction<number>>
	appRef:React.MutableRefObject<HTMLDivElement>
}
export const globalContext = React.createContext({} as globalCanvasType)
