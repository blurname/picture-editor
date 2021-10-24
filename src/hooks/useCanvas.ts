import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { SpiritCanvas } from '../store/globalCanvas'
import { ax } from '../utils/http'
export function useCanvas(user: number,canvas:number):SpiritCanvas {
  //const [spiritCanvas, setSpiritCanvas] = useState({}as SpiritsCanvas);
  const spiritCanvasRef = useRef(undefined)
  if (spiritCanvasRef.current === undefined) {
    spiritCanvasRef.current = new SpiritCanvas(user,canvas, ax)
  }
  useEffect(() => {
    if (!spiritCanvasRef.current) {
      const spir = new SpiritCanvas(user,canvas, ax)
      spiritCanvasRef.current = spir
    }
  }, [user])
  return spiritCanvasRef.current
}
