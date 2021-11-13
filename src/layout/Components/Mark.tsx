import { Button } from 'antd'
import React, { useContext } from 'react'
import { globalContext } from '../../context'
import { menu } from './menuSchema'

type MarkType = {
  id: number
  value: Shape
}
const marks: MarkType[] = [
  {
    id: 1,
    value: 'line',
  },
  {
    id: 2,
    value: 'hollowRect',
  },
  { id: 3, value: 'circle' },
  { id: 4, value: 'theW' },
]
export function Mark() {
  const { spiritCanvas, cmpCount, setCmpCount } = useContext(globalContext)
  const addMark = (shape: Shape) => () => {
    spiritCanvas.addMark(shape, cmpCount)
    setCmpCount(cmpCount + 1)
  }
  return (
    <div className="">
      {marks.map((mark, index) => {
        return (
          <div className="w-1/12 mb-6" key={mark.id}>
            <Button onClick={addMark(mark.value)}>{mark.value}</Button>
          </div>
        )
      })}
    </div>
  )
}
