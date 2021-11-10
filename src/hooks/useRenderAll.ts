import React, {
  useState,
  useCallback,
} from 'react'
import { BeamSpirit } from '../utils/gl-uitls'
export function useRenderAll(spirits: BeamSpirit[]) {
  const renderAll = useCallback(() => {
    for (const si of spirits) {
      si.render()
    }
  }, [spirits])
  return [renderAll]
}
