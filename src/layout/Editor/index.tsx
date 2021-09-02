import React, { ChangeEvent, FormEvent, FormEventHandler, useContext } from 'react'
import { globalContext } from '../../context'
import {} from './index.css'
import { editorSchema } from './editorSchema'
export function Editor() {
  const { globalCanvas } = useContext(globalContext)
  const curCmpId = globalCanvas.selectedCmp?.id
  const rangeInput = editorSchema.children[0]
  const { max, min } = rangeInput.props
  const onChangeInput = (desc:string)=>(e:ChangeEvent<HTMLInputElement>) => {
	console.log('kkk');
     console.log(`desc:${desc},value:${e.target.value}`)
  }
  return (
    <div className="Editor">
      Editor
      <div style={{ height: 50 }}>{curCmpId}</div>
      <div>
        {rangeInput.children.map((cur, index) => {
          return (
            <div style={{ marginBottom: 30 }} key={index}>
              {cur.desc}
              <input
                type="range"
                min={min}
                max={max}
                defaultValue={cur.props.value}
                onInput={onChangeInput(cur.desc)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
