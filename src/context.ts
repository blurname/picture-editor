import React, {Dispatch, SetStateAction} from 'react'
import {OperationHistory, SpiritCanvas } from './store/globalCanvas'
type globalCanvasType = {
	spiritCanvas:SpiritCanvas
	operationHistory:OperationHistory
  cmpCount: number
  setCmpCount: React.Dispatch<React.SetStateAction<number>>
	selectNum:number
  setSelectNum: React.Dispatch<React.SetStateAction<number>>
	adjustNum:number
	zoomable:boolean
	setZoomable:Dispatch<SetStateAction<boolean>>
  setAdjustNum: React.Dispatch<React.SetStateAction<number>>
}
export const globalContext = React.createContext({} as globalCanvasType)
