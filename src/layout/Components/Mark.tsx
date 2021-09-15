import { Button } from 'antd'
import React, { useContext } from 'react'
import { globalContext } from '../../context'
import { globalCanvas } from '../../store/globalCanvas'
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
]
type Shape = 'line' | 'hollowRect'
export function Mark() {
  const { props } = menu.children.filter((child) => child.desc === 'mark')[0]
  const { spiritCanvas, cmpCount, setCmpCount } = useContext(globalContext)
  const addMark = (shape: Shape) => () => {
    spiritCanvas.addMark(shape)
    setCmpCount(cmpCount + 1)
  }
  return (
    <div>
      {marks.map((mark, index) => {
        return (
          <div className="auto mb-6" key={mark.id}>
            <Button onClick={addMark(mark.value)}>{mark.value}</Button>
          </div>
        )
      })}
    </div>
  )
}
