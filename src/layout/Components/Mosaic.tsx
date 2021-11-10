import { Button } from 'antd'
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { globalContext } from '../../context'
import { menu } from './menuSchema'
type Mosaic = {
  id: number
  value: MosaicType
}
const mosaics: Mosaic[] = [
  {
    id: 1,
    value: 'multi',
  },
  //{
    //id: 2,
    //value: 'fract',
  //},
]
export function Mosaic() {
  //const { props } = menu.children.filter((child) => {
    //child.desc === 'mosaic'
  //})[0]

  const { spiritCanvas, cmpCount, setCmpCount } = useContext(globalContext)
  const addMosaic = (type: MosaicType) => () => {
    spiritCanvas.addMosaic(type, cmpCount)
    setCmpCount(cmpCount + 1)
  }
  return (
    <div className="w-1/12">
      {mosaics.map((mosaic, index) => {
        return (
          <div className="auto mb-6" key={mosaic.id}>
            <Button onClick={addMosaic(mosaic.value)}>{mosaic.value}</Button>
          </div>
        )
      })}
    </div>
  )
}
