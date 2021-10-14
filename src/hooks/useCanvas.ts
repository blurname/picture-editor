import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { SpiritsCanvas } from '../store/globalCanvas'
import { ax } from '../utils/http'
export function useCanvas(id: number) {
	//const [spiritCanvas, setSpiritCanvas] = useState({}as SpiritsCanvas);
  const spiritCanvasRef = useRef(undefined)
	//spiritCanvasRef.current = spiritCanvas
	console.log('usecanvas')
	if (spiritCanvasRef.current === undefined){
		console.log('current')
		spiritCanvasRef.current = new SpiritsCanvas(id, ax)
		console.log('setCanvas')
		spiritCanvasRef.current.setCanvas()
	}
  useEffect(() => {
		if(!spiritCanvasRef.current){
			const spir =  new SpiritsCanvas(id,ax)
		spiritCanvasRef.current = spir 
		}
  }, [id])
  return spiritCanvasRef.current
}
