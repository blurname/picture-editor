import {
  useCallback,
} from 'react'
import { BeamSpirit } from '../utils/gl-uitls'
export function useRenderAll(spirits: BeamSpirit[],cmpCount:number) {
  const renderAll = useCallback(() => {
    spirits.forEach((spirit)=>{spirit?.render()})
  }, [spirits,cmpCount])
  return [renderAll]
}
