import {
  useCallback,
} from 'react'
import { BeamSpirit } from '../utils/gl-uitls'
export function useRenderAll(spirits: BeamSpirit[],cmpCount:number) {
  const renderAll = useCallback(() => {
		for (let i = 0; i < spirits.length; i++) {
			const element = spirits[i];
      element.render()
		}
    //for (const si of spirits) {
			//console.log(si)
    //}
  }, [spirits,cmpCount])
  return [renderAll]
}
